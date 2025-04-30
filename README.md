# Plant Disease Detection and Severity Analysis

This project provides a web application for detecting plant diseases and analyzing their severity using a deep learning model.

## Features

- Upload images of plant leaves
- Automatic disease classification
- Severity level prediction
- Responsive design for mobile and desktop

## Requirements

- Python 3.6+
- Flask
- TensorFlow
- OpenCV
- NumPy
- Werkzeug

## Project Structure

```
plant_disease_detection/
├── app.py                # Flask application
├── utils.py              # Helper functions
├── requirements.txt      # Dependencies
├── paddy_disease_model.h5  # Trained model (generated)
├── static/               # Static files
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── script.js     # Frontend logic
├── templates/            # HTML templates
│   └── index.html        # Main page
└── temp_uploads/         # Temporary folder for uploads
```

## Running the Project

### Step 1: Install Dependencies

```bash
pip install flask tensorflow numpy opencv-python werkzeug
```

### Step 2: Train and Save the Model

If you don't have a pre-trained model:

```bash
python Paddy_disease_classification_with_severity_level.py
```

This will create `paddy_disease_model.h5` in your project directory.

### Step 3: Run the Flask Application

```bash
python app.py
```

The application will be available at http://localhost:5000

## Usage

1. Open http://localhost:5000 in your browser
2. Click "Choose File" to select an image of a plant leaf
3. Click "Analyze Image" to process it
4. View the disease classification and severity results

## Note

Make sure the model is trained and saved before running the application. 