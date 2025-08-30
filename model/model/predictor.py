# model/predictor.py
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import torch
import os

# Path to trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "plant-disease-classifier")

# Load feature extractor and model
extractor = AutoFeatureExtractor.from_pretrained(MODEL_PATH)
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH)
model.eval()  # set to evaluation mode

def predict_disease(image_path):
    """
    Predict the rice leaf disease class for a given image.
    """
    image = Image.open(image_path).convert("RGB")
    inputs = extractor(images=image, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        preds = outputs.logits.softmax(dim=1)
        predicted_class = model.config.id2label[preds.argmax().item()]
    
    return predicted_class
