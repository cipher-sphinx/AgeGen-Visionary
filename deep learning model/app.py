from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model('Age_Gender_CNN.h5')

# Define a function to preprocess the input image
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (128, 128))  
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  
    img = img / 255.0
    return img

@app.route('/predict', methods=['POST'])
def predict():
    try:
        image = request.files['image']
        if image:
            image.save('temp.jpg')
            processed_image = preprocess_image('temp.jpg')
            predictions = model.predict(np.array([processed_image]))
            gender = 'Male' if predictions[0][0] < 0.5 else 'Female'
            age = int(predictions[1][0])  # Modify based on your model's output
            return jsonify({'age': age, 'gender': gender})
        else:
            return jsonify({'error': 'No image provided'})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)



