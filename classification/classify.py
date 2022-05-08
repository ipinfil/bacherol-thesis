import tensorflow as tf
from tensorflow import keras
from keras import layers
import os
import numpy as np
import argparse
import json
from pathlib import Path
from time import time

IMAGE_SIZE = (100, 100) 


def classify(image_path, model_path):
    img = keras.preprocessing.image.load_img(
        image_path, target_size=IMAGE_SIZE
    )
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create batch axis
    img_array = keras.applications.efficientnet.preprocess_input(img_array)

    t = time()
    model = keras.models.load_model(model_path)
    print("load_model: " + str(time() - t))

    t = time()
    predictions = model.predict(img_array)
    print("predict: " + str(time() - t))

    path = Path(__file__).parent.resolve()
    with open(path / "classes.json", "r") as f:
        class_names = list(json.load(f).keys())

    predictions_decoded = {class_names[i] : value * 100 for i, value in sorted(enumerate(predictions[0]), key=lambda val: val[1], reverse=True)}

    return predictions_decoded

def build_model(num_classes):
    model = tf.keras.applications.EfficientNetB0(
        include_top=False,
        weights="imagenet",
        input_tensor=None,
        input_shape=None,
        pooling=None,
        classes=131
    )

    # Freeze the pretrained weights
    model.trainable = False

    # Rebuild top
    x = layers.GlobalAveragePooling2D(name="avg_pool")(model.output)
    x = layers.BatchNormalization()(x)

    top_dropout_rate = 0.2
    x = layers.Dropout(top_dropout_rate, name="top_dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="pred")(x)

    # Compile
    model = tf.keras.Model(model.input, outputs, name="ResNet50")
    # checkpoint at end of epoch
    # callbacks = [
    #     keras.callbacks.ModelCheckpoint("save_at_{epoch}.h5"),
    # ]
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model

if __name__ == "__main__":
    """Control via arguments."""
    parser = argparse.ArgumentParser("Train fruit and vegetable recoginition neural network based on ResNet50.")
    parser.add_argument("--ds-path", type=str)
    parser.add_argument("--predict-only", action="store_true")
    parser.add_argument("--predict-path", type=str)
    parser.add_argument("--model-path", type=str)
    args = parser.parse_args()

    if not args.predict_only:
        """Create training and validation sets."""
        batch_size = 32
        dataset_root_dir = args.ds_path

        datagen = tf.keras.preprocessing.image.ImageDataGenerator(
            featurewise_center=True,
            featurewise_std_normalization=True,
            preprocessing_function=tf.keras.applications.efficientnet.preprocess_input,
            validation_split=0.2
            )

        train_ds = datagen.flow_from_directory(
            directory=dataset_root_dir,
            target_size=IMAGE_SIZE,
            color_mode="rgb",
            batch_size=32,
            class_mode="categorical",
            shuffle=True,
            seed=42,
            subset="training"
        )

        val_ds = datagen.flow_from_directory(
            directory=dataset_root_dir,
            target_size=IMAGE_SIZE,
            color_mode="rgb",
            batch_size=32,
            class_mode="categorical",
            shuffle=True,
            seed=42,
            subset="validation"
        )

        """Define model."""
        model = build_model(131)

        """Train model."""
        epochs = 1
        history = model.fit(
            train_ds, epochs=epochs, validation_data=val_ds
        )

        if args.model_path:
            model.save(args.model_path)

    if args.predict_path and args.model_path:
        predictions = classify(args.predict_path, args.model_path)

        for class_name in predictions:
            if predictions[class_name] < 0.01:
                continue
            print(class_name + " - " + f"{predictions[class_name]:.2f}" + "%")
