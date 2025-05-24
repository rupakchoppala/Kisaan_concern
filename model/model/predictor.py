from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import torch

# Path to your saved model and feature extractor
MODEL_PATH = "/home/akshay/Documents/kisaan_concern/model/model/model/plant-disease-classifier"
# Load the feature extractor and model
extractor = AutoFeatureExtractor.from_pretrained(MODEL_PATH)
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)
def predict_disease(image_path):
    image = Image.open(image_path).convert("RGB")  # Open and convert image to RGB
    inputs = extractor(images=image, return_tensors="pt")  # Process image using extractor
    outputs = model(**inputs)  # Get model outputs
    preds = outputs.logits.softmax(dim=1)  # Apply softmax to get probabilities
    predicted_class = model.config.id2label[preds.argmax().item()]  # Get the predicted class
    return predicted_class
# # Example usage
# image_path = "path/to/test/image.jpg"
# predicted_class = predict_disease(image_path)
# print(f"The predicted class is: {predicted_class}")
