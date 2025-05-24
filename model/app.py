from flask import Flask, request, jsonify
from model.predictor import predict_disease
from model.train import train_model
from utils.fertilizers_map import get_fertilizer_recommendation
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    prediction = predict_disease(filepath)
    fertilizer = get_fertilizer_recommendation(prediction)

    return jsonify({
        "prediction": prediction,
        "recommended_fertilizer": fertilizer
    })
# @app.route("/train", methods=["POST"])
# def train():
#     try:
#         result = train_model()
#         return jsonify({"message": result}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
