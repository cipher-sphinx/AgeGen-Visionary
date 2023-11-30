from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import tensorflow as tf


from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Load the pre-trained model
model = tf.keras.models.load_model('Age_Gender_CNN.h5')

# Define a function to preprocess the input image
def preprocess_image(image_data):
    img = cv2.imdecode(np.frombuffer(image_data, np.uint8), -1)
    img = cv2.resize(img, (128, 128))  
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  
    img = img / 255.0
    return img

# Configure CORS
origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict this to specific HTTP methods if needed
    allow_headers=["*"],  # You can restrict this to specific headers if needed
)

@app.post("/predict/")
async def predict(files: UploadFile):
    try:
        if not files:
            return JSONResponse(content={"error": "No image provided"}, status_code=400)

        image = await files.read()

        # Load the pre-trained face detection classifier
        face_cascade = cv2.CascadeClassifier('C:/Users/devel/anaconda3/envs/age_gender/Lib/site-packages/cv2/data/haarcascade_frontalface_default.xml')

        # Convert the uploaded image to a format suitable for face detection
        img = cv2.imdecode(np.frombuffer(image, np.uint8), -1)

        # Ensure the image is in grayscale
        if len(img.shape) == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Convert the image to the required data type (CV_8U)
        if img.dtype != np.uint8:
            img = img.astype(np.uint8)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(img)

        # Ensure there is at least one face in the image
        if len(faces) == 0:
            return JSONResponse(content={"error": "No faces detected in the image"}, status_code=400)

        # If faces are detected, continue with your model prediction
        processed_image = cv2.resize(img, (128, 128)) / 255.0
        predictions = model.predict(np.array([processed_image]))
        gender = 'Male' if predictions[0][0] < 0.5 else 'Female'
        age = int(predictions[1][0])

        return JSONResponse(content=[{"age": age, "gender": gender}])
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


