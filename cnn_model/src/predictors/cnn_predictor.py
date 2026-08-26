from pathlib import Path

import torch
from torchvision import transforms
from PIL import Image

from src.models.model_factory import create_model


class CNNPredictor:

    def __init__(self, device=None):

        self.device = device or (
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        self.models = {}

        self.load_models()

        self.transform = transforms.Compose([
            transforms.Resize((224,224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485,0.456,0.406],
                std=[0.229,0.224,0.225]
            )
        ])

    def load_model(self, task, checkpoint):

        model = create_model(task)

        ckpt = torch.load(
            checkpoint,
            map_location=self.device
        )

        model.load_state_dict(
            ckpt["model_state_dict"]
        )

        model.to(self.device)

        model.eval()

        return model

    def load_models(self):

        self.models["portrait"] = self.load_model(
            "portrait_score",
            "checkpoints/portrait/portrait_model.pth"
        )

        self.models["acne"] = self.load_model(
            "acne",
            "checkpoints/acne/acne_model.pth"
        )

        self.models["skin_tone"] = self.load_model(
            "skin_tone",
            "checkpoints/skintone/skintone_model.pth"
        )

        self.models["gender"] = self.load_model(
            "gender",
            "checkpoints/gender/gender_model.pth"
        )

        self.models["face_quality"] = self.load_model(
            "face_quality",
            "checkpoints/face_quality/face_quality_model.pth"
        )

        self.models["age"] = self.load_model(
            "age",
            "checkpoints/age/age_model.pth"
        )

        self.models["facial_attributes"] = self.load_model(
            "facial_attributes",
            "checkpoints/facial_attributes/facial_attributes_model.pth"
        )

    def preprocess(self, image_path):

        image = Image.open(image_path).convert("RGB")

        image = self.transform(image)

        image = image.unsqueeze(0)

        return image.to(self.device)

    def predict(self, image_path):

        image = self.preprocess(image_path)

        outputs = {}

        with torch.no_grad():

            outputs["portrait_score"] = (
                self.models["portrait"](image)
                .item()
            )

            outputs["acne"] = (
                self.models["acne"](image)
                .argmax(1)
                .item()
            )

            outputs["skin_tone"] = (
                self.models["skin_tone"](image)
                .argmax(1)
                .item()
            )

            outputs["gender"] = (
                self.models["gender"](image)
                .argmax(1)
                .item()
            )

            outputs["face_quality"] = (
                self.models["face_quality"](image)
                .item()
            )

            outputs["age"] = (
                self.models["age"](image)
                .item()
            )

            outputs["facial_attributes"] = (
                torch.sigmoid(
                    self.models["facial_attributes"](image)
                ) > 0.5
            ).int().cpu().tolist()[0]

        return outputs