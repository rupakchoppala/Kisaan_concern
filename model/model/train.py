import os
from datasets import Dataset
from transformers import (
    AutoImageProcessor,
    AutoModelForImageClassification,
    TrainingArguments,
    Trainer
)
from torchvision import transforms
from PIL import Image
import torch

def load_and_label_images(data_dir):
    data = {"image": [], "label": []}
    label2id = {label: i for i, label in enumerate(sorted(os.listdir(data_dir)))}
    for label in label2id:
        class_path = os.path.join(data_dir, label)
        for img_name in os.listdir(class_path):
            img_path = os.path.join(class_path, img_name)
            if img_name.lower().endswith((".jpg", ".jpeg", ".png")):
                data["image"].append(img_path)
                data["label"].append(label2id[label])
    return data, label2id

def transform(example, image_processor):
    image = Image.open(example["image"]).convert("RGB")
    processed = image_processor(image, return_tensors="pt")
    example["pixel_values"] = processed["pixel_values"].squeeze()
    return example

def collate_fn(batch):
    pixel_values = torch.stack([torch.tensor(item["pixel_values"]) for item in batch])
    labels = torch.tensor([item["label"] for item in batch])
    return {"pixel_values": pixel_values, "labels": labels}

def train_model():
    data_dir = "../datasets"
    raw_data, label2id = load_and_label_images(data_dir)
    dataset = Dataset.from_dict(raw_data)
    dataset = dataset.train_test_split(test_size=0.2)

    model_name = "google/mobilenet_v2_1.0_224"
    image_processor = AutoImageProcessor.from_pretrained(model_name)

    dataset = dataset.map(lambda x: transform(x, image_processor), remove_columns=["image"])

    model = AutoModelForImageClassification.from_pretrained(
        model_name,
        num_labels=len(label2id),
        id2label={v: k for k, v in label2id.items()},
        label2id=label2id,
        ignore_mismatched_sizes=True 
    )

    training_args = TrainingArguments(
        output_dir="./model/plant-disease-classifier",
        per_device_train_batch_size=8,
        num_train_epochs=5,
        logging_dir="./logs",
        learning_rate=5e-5,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["test"],
        tokenizer=image_processor,
        data_collator=collate_fn,
    )

    trainer.train()
    trainer.save_model("./model/plant-disease-classifier")
    image_processor.save_pretrained("./model/plant-disease-classifier")

    return "✅ Training completed and model saved to ./model/plant-disease-classifier"
if __name__ == "__main__":
    result = train_model()
    print(result)