import os
import cv2
import numpy as np
import tensorflow as tf

def load_model():
    """
    Load the trained model or train a new one if not available
    """
    model_path = os.path.join('models', 'paddy_disease_model.h5')
    
    try:
        if os.path.exists(model_path):
            print(f"Loading existing model from {model_path}")
            # Define custom objects to handle 'mse' function
            custom_objects = {
                'mse': tf.keras.losses.MeanSquaredError(),
                'mae': tf.keras.metrics.MeanAbsoluteError()
            }
            return tf.keras.models.load_model(model_path, custom_objects=custom_objects)
        else:
            print("Model not found. Running in test mode with mock predictions.")
            return None
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Running in test mode with mock predictions.")
        return None

def process_image(image_path):
    """Process the uploaded image for model prediction"""
    # Read and preprocess image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0  # Normalize
    img = np.expand_dims(img, axis=0)
    return img

def cleanup_temp_files(filepath):
    """Clean up temporary files after prediction"""
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception as e:
        print(f"Error cleaning up files: {e}") 