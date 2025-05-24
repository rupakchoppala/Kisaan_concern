# fertilizer_map = {
#     "Tomato___Late_blight": "Use copper-based fungicides.",
#     "Potato___Early_blight": "Apply Mancozeb or Chlorothalonil.",
#     "Tomato___Healthy": "No fertilizer needed. Plant is healthy.",
#     # Add more mappings
# }
# disease_to_fertilizer.py

fertilizer_map = {
    "bacterial_leaf_blight": {
        "recommended_fertilizers": [
            "Avoid nitrogen-rich fertilizers during early infection",
            "Use potassium chloride (KCl)",
            "Apply organic compost"
        ],
        "notes": "Use disease-free seeds, maintain proper drainage, and avoid over-irrigation."
    },
    "brown_spot": {
        "recommended_fertilizers": [
            "Balanced NPK fertilizer (10-10-10)",
            "Zinc sulfate foliar spray"
        ],
        "notes": "Improve soil fertility and avoid prolonged wet conditions."
    },
    "healthy": {
        "recommended_fertilizers": [
            "Nitrogen-Phosphorus-Potassium (NPK) balanced fertilizer",
            "Organic manure or compost"
        ],
        "notes": "Your crop is healthy. Maintain good agricultural practices and monitor regularly."
    },
    "leaf_blast": {
        "recommended_fertilizers": [
            "Apply phosphorus-rich fertilizer",
            "Avoid excessive nitrogen application"
        ],
        "notes": "Use resistant varieties and maintain field hygiene."
    },
    "leaf_scald": {
        "recommended_fertilizers": [
            "Balanced NPK fertilizer",
            "Foliar application of potassium phosphite"
        ],
        "notes": "Ensure proper air circulation and avoid waterlogged conditions."
    },
    "narrow_brown_spot": {
        "recommended_fertilizers": [
            "Zinc and manganese foliar sprays",
            "Apply potassium sulfate"
        ],
        "notes": "Maintain optimal plant nutrition and reduce humidity in the field."
    }
}
def get_fertilizer_recommendation(disease):
    return fertilizer_map.get(disease, "No recommendation available.")
