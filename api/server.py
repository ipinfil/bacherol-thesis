from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from classification.classify import classify

app = FastAPI()


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    path = Path(__file__).parent.resolve()

    tmp_path = path / f"../tmp/{file.filename}"
    with open(tmp_path, 'wb') as f:
        f.write(contents)

    model_path = path / "../classification/EffNetclassification.h5"
    predictions = classify(tmp_path, model_path)
    return predictions