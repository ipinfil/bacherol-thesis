from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from classification.classify import classify
import tensorflow as tf
from tensorflow import keras
from time import time
import json
import io
from PIL import Image

app = FastAPI()
path = Path(__file__).parent.resolve()
model = keras.models.load_model(path / "../classification/EffNetclassification.h5")


async def classify(img):
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create batch axis
    img_array = keras.applications.efficientnet.preprocess_input(img_array)

    t = time()
    predictions = model.predict(img_array)
    print("predict: " + str(time() - t))

    path = Path(__file__).parent.resolve()
    with open(path / "../classification/classes.json", "r") as f:
        class_names = list(json.load(f).keys())

    predictions_decoded = {class_names[i] : value * 100 for i, value in sorted(enumerate(predictions[0]), key=lambda val: val[1], reverse=True)}

    return predictions_decoded


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read()))
    predictions = await classify(img)
    return predictions