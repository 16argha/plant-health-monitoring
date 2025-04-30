import pandas as pd
import numpy as np
import cv2
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras import layers, callbacks

# Set paths (Kaggle directory structure)
BASE_PATH = "C:\\Users\\HP\\Downloads"
TRAIN_CSV = os.path.join(BASE_PATH, "train.csv")
TRAIN_IMG_DIR = os.path.join(BASE_PATH, "train_images")

# Load data
data = pd.read_csv(TRAIN_CSV)
print("Data columns:", data.columns.tolist())
def estimate_severity(image_path):
    # Load image and convert to HSV
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # For visualization
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    
    # Define HSV ranges for disease symptoms (adjust empirically)
    # Example: Yellow/brown lesions (common in paddy diseases)
    lower_yellow = np.array([20, 50, 50])
    upper_yellow = np.array([40, 255, 255])
    mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
    
    # Combine masks if needed (e.g., add brown for blast disease)
    lower_brown = np.array([10, 50, 50])
    upper_brown = np.array([20, 255, 255])
    mask_brown = cv2.inRange(hsv, lower_brown, upper_brown)
    
    final_mask = cv2.bitwise_or(mask_yellow, mask_brown)
    
    # Calculate disease coverage percentage
    severity_pct = np.sum(final_mask > 0) / (img.shape[0] * img.shape[1]) * 100
    
    # Classify severity
    if severity_pct < 15:
        return "low", severity_pct
    elif 15 <= severity_pct < 40:
        return "medium", severity_pct
    else:
        return "high", severity_pct

# Process all images (this takes time!)
data["severity_level"] = "low"
data["severity_pct"] = 0.0

for idx, row in data.iterrows():
    img_path = os.path.join(TRAIN_IMG_DIR, row["label"], row["image_id"] )
    if os.path.exists(img_path):
        severity_level, severity_pct = estimate_severity(img_path)
        data.loc[idx, "severity_level"] = severity_level
        data.loc[idx, "severity_pct"] = severity_pct

# Save updated dataset
data.to_csv("train_with_severity.csv", index=False)
# Severity distribution
plt.figure(figsize=(10, 6))
sns.countplot(data=data, x="severity_level", order=["low", "medium", "high"], palette="viridis")
plt.title("Synthetic Severity Distribution")
plt.show()

# Severity vs. disease type
plt.figure(figsize=(14, 8))
sns.boxplot(data=data, x="label", y="severity_pct", palette="magma")
plt.xticks(rotation=45)
plt.title("Severity by Disease Type")
plt.show()
# Encode disease labels
label_encoder = LabelEncoder()
data["label_encoded"] = label_encoder.fit_transform(data["label"])
num_classes = len(label_encoder.classes_)

# Create TensorFlow dataset
def load_image(img_path, label, severity):
    img = tf.io.read_file(img_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, [224, 224])
    return img, (label, severity)

# Build paths and labels///////////////////////////////////////////////////////////////////////
img_paths = [os.path.join(TRAIN_IMG_DIR, row["label"], row["image_id"] ) for _, row in data.iterrows()]
labels = data["label_encoded"].values
severities = data["severity_pct"].values
#////////////////////////////////////////////////////////////////////////////////////////////////
# dataset = tf.data.Dataset.from_tensor_slices((img_paths, (labels, severities)))
dataset = tf.data.Dataset.from_tensor_slices((img_paths, labels, severities))

dataset = dataset.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)

# Split into train/val
train_size = int(0.8 * len(dataset))
train_ds = dataset.take(train_size).batch(32).prefetch(tf.data.AUTOTUNE)
val_ds = dataset.skip(train_size).batch(32).prefetch(tf.data.AUTOTUNE)
# Shared backbone
inputs = tf.keras.Input(shape=(224, 224, 3))
x = layers.Rescaling(1./255)(inputs)
x = layers.Conv2D(128, 3, activation="relu")(x)
x = layers.MaxPooling2D()(x)
x = layers.Conv2D(64, 3, activation="relu")(x)
x = layers.MaxPooling2D()(x)
x = layers.Flatten()(x)

# Disease classification head
disease_head = layers.Dense(64, activation="relu")(x)
disease_output = layers.Dense(num_classes, activation="softmax", name="disease")(disease_head)

# Severity regression head
severity_head = layers.Dense(32, activation="relu")(x)
severity_output = layers.Dense(1, activation="linear", name="severity")(severity_head)

model = tf.keras.Model(inputs=inputs, outputs=[disease_output, severity_output])

# Compile
model.compile(
    optimizer="adam",
    loss={
        "disease": "sparse_categorical_crossentropy",
        "severity": "mse"
    },
    metrics={
        "disease": "accuracy",
        "severity": "mae"
    }
)

# Train
early_stopping = callbacks.EarlyStopping(patience=3, restore_best_weights=True)
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=15,   
    callbacks=[early_stopping]
)
# Plot training history
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.plot(history.history["disease_accuracy"], label="Train Disease Accuracy")
plt.plot(history.history["val_disease_accuracy"], label="Val Disease Accuracy")
plt.legend()
plt.title("Disease Accuracy")

plt.subplot(1, 2, 2)
plt.plot(history.history["severity_mae"], label="Train Severity MAE")
plt.plot(history.history["val_severity_mae"], label="Val Severity MAE")
plt.legend()
plt.title("Severity MAE")
plt.show()

# Save the model
print("Saving model...")
model.save("paddy_disease_model.h5")
print("Model saved as paddy_disease_model.h5")

# Save the label encoder classes for later use
import pickle
with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(label_encoder.classes_, f)      
    