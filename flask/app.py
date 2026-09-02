import os
import io
import base64
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing for your MERN frontend

# Load trained generator model
MODEL_PATH = "pix2pix_Generator.h5"  # Ensure this file is in the same directory
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

def preprocess_image(image_bytes):
    """Decodes, resizes, and normalizes input image bytes to [-1, 1]."""
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (256, 256))
    img = (img / 127.5) - 1.0  # Normalize to [-1, 1]
    img = np.expand_dims(img, axis=0)  # Add batch dimension [1, 256, 256, 3]
    return tf.cast(img, tf.float32)

def postprocess_image(pred_tensor):
    """Converts output tensor back to base64 JPEG string for easy MERN display."""
    pred = pred_tensor[0].numpy()
    pred = ((pred + 1.0) * 127.5).astype(np.uint8)  # Rescale back to [0, 255]
    pred = cv2.cvtColor(pred, cv2.COLOR_RGB2BGR)
    
    _, buffer = cv2.imencode('.jpg', pred)
    base64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{base64_str}"

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded under key "file"'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        image_bytes = file.read()
        input_tensor = preprocess_image(image_bytes)
        prediction = model(input_tensor, training=False)
        result_base64 = postprocess_image(prediction)

        return jsonify({'image': result_base64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)