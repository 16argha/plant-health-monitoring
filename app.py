import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import tensorflow as tf
import numpy as np
import cv2
import pickle
import json
from utils import process_image, load_model, cleanup_temp_files
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes with appropriate settings
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
app.config['UPLOAD_FOLDER'] = 'temp_uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
app.config['TEST_MODE'] = True  # Enable test mode by default

# Load disease class names from pickle file if available
DISEASE_CLASSES = {}
label_encoder_path = os.path.join('models', 'label_encoder.pkl')
try:
    if os.path.exists(label_encoder_path):
        # Load the class names
        with open(label_encoder_path, 'rb') as f:
            class_names = pickle.load(f)
            DISEASE_CLASSES = {i: name for i, name in enumerate(class_names)}
            print(f"Loaded {len(DISEASE_CLASSES)} class names from {label_encoder_path}")
    else:
        # Default mapping if pickle file not available
        DISEASE_CLASSES = {
            0: 'bacterial_leaf_blight',
            1: 'bacterial_leaf_streak',
            2: 'bacterial_panicle_blight',
            3: 'blast',
            4: 'brown_spot',
            5: 'dead_heart',
            6: 'downy_mildew',
            7: 'hispa',
            8: 'normal',
            9: 'tungro'
        }
except Exception as e:
    print(f"Error loading class names: {e}")
    # Default mapping as fallback
    DISEASE_CLASSES = {
        0: 'bacterial_leaf_blight',
        1: 'bacterial_leaf_streak',
        2: 'bacterial_panicle_blight',
        3: 'blast',
        4: 'brown_spot',
        5: 'dead_heart',
        6: 'downy_mildew',
        7: 'hispa',
        8: 'normal',
        9: 'tungro'
    }

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load model once when the app starts
model = None
try:
    model = load_model()
    if model is not None:
        print("Model loaded successfully.")
        app.config['TEST_MODE'] = False
    else:
        print("No model loaded. Running in test mode with mock predictions.")
        app.config['TEST_MODE'] = True
except Exception as e:
    print(f"Error loading model: {e}")
    print("Running in test mode with mock predictions.")
    app.config['TEST_MODE'] = True

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        return response

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload an image (PNG, JPG, JPEG)'}), 400
    
    try:
        # Save the uploaded file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process image and get prediction
        processed_image = process_image(filepath)
        
        # Get predictions
        if model is not None and not app.config['TEST_MODE']:
            # Real model prediction
            disease_pred, severity_pred = model.predict(processed_image)
            
            # Print detailed debug information
            print("\nDEBUG - Raw model outputs:")
            print(f"Disease prediction (raw): {disease_pred[0]}")
            
            # Get top 3 classes with probabilities
            top_classes = np.argsort(disease_pred[0])[::-1][:3]  # Top 3 classes
            print("\nTop 3 predicted classes:")
            for i, class_idx in enumerate(top_classes):
                class_name = DISEASE_CLASSES.get(class_idx, f"Unknown (Class {class_idx})")
                probability = disease_pred[0][class_idx] * 100
                print(f"{i+1}. {class_name}: {probability:.2f}%")
            
            disease_class = np.argmax(disease_pred[0])
            print(f"\nSelected class index: {disease_class}")
            disease_name = DISEASE_CLASSES.get(disease_class, f"Unknown Disease (Class {disease_class})")
            print(f"Selected class name: {disease_name}")
            
            severity_percentage = float(severity_pred[0][0])
        else:
            # Mock prediction for testing
            import random
            disease_class = random.randint(0, len(DISEASE_CLASSES)-1)
            disease_name = DISEASE_CLASSES.get(disease_class, f"Unknown Disease (Class {disease_class})")
            severity_percentage = random.uniform(10.0, 90.0)
            
        # Clean up temporary files
        cleanup_temp_files(filepath)
        
        # Ensure all values are JSON serializable
        response_data = {
            'disease': disease_name,
            'severity': float(severity_percentage),
            'mode': 'real' if (model is not None and not app.config['TEST_MODE']) else 'test'
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        # Clean up in case of error
        if 'filepath' in locals():
            cleanup_temp_files(filepath)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0') 