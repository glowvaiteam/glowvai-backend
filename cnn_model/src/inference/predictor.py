from pathlib import Path
import torch
from torchvision import transforms
from PIL import Image

try:
    from src.models.model_factory import create_model
except ImportError:
    from cnn_model.src.models.model_factory import create_model


class CNNPredictor:
    def __init__(self, device=None, base_checkpoint_dir=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        
        # Base directory for checkpoints
        if base_checkpoint_dir:
            self.base_dir = Path(base_checkpoint_dir)
        else:
            # Detect whether running from cnn_model/ or root
            if Path("checkpoints").exists():
                self.base_dir = Path("checkpoints")
            elif Path("cnn_model/checkpoints").exists():
                self.base_dir = Path("cnn_model/checkpoints")
            else:
                self.base_dir = Path(__file__).resolve().parent.parent.parent / "checkpoints"

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        self.models = {}
        self.load_models()

    def load_model(self, task, relative_ckpt_path):
        ckpt_path = self.base_dir / relative_ckpt_path
        model = create_model(task)

        if ckpt_path.exists():
            try:
                ckpt = torch.load(ckpt_path, map_location=self.device)
                if isinstance(ckpt, dict) and "model_state_dict" in ckpt:
                    model.load_state_dict(ckpt["model_state_dict"])
                elif isinstance(ckpt, dict):
                    model.load_state_dict(ckpt)
                print(f"[CNNPredictor] Loaded weights for {task} from {ckpt_path}")
            except Exception as e:
                print(f"[CNNPredictor] Warning: Could not load weights for {task}: {e}")
        else:
            print(f"[CNNPredictor] Note: Checkpoint {ckpt_path} not found. Running initialized head.")

        model.to(self.device)
        model.eval()
        return model

    def load_models(self):
        # 1. Portrait Score
        self.models["portrait"] = self.load_model(
            "portrait_score",
            "portrait/portrait_model.pth"
        )

        # 2. Acne Detection (Present in checkpoints/acne/acne_model.pth)
        self.models["acne"] = self.load_model(
            "acne",
            "acne/acne_model.pth"
        )

        # 3. Skin Tone Classification (Present in checkpoints/skintone/skintone_model.pth)
        self.models["skin_tone"] = self.load_model(
            "skin_tone",
            "skintone/skintone_model.pth"
        )

        # 4. Gender
        self.models["gender"] = self.load_model(
            "gender",
            "gender/gender_model.pth"
        )

        # 5. Face Quality
        self.models["face_quality"] = self.load_model(
            "face_quality",
            "face_quality/face_quality_model.pth"
        )

        # 6. Age Regression
        self.models["age"] = self.load_model(
            "age",
            "age/age_model.pth"
        )

        # 7. Facial Attributes Multi-label
        self.models["facial_attributes"] = self.load_model(
            "facial_attributes",
            "facial_attributes/facial_attributes_model.pth"
        )

    def predict(self, image_input):
        """
        Accepts a file path, PIL Image, or bytes, and runs multi-task CNN inference.
        """
        if isinstance(image_input, (str, Path)):
            image = Image.open(image_input).convert("RGB")
        elif isinstance(image_input, Image.Image):
            image = image_input.convert("RGB")
        else:
            import io
            image = Image.open(io.BytesIO(image_input)).convert("RGB")

        tensor = self.transform(image).unsqueeze(0).to(self.device)
        results = {}

        with torch.no_grad():
            if "portrait" in self.models:
                results["portrait_score"] = float(self.models["portrait"](tensor).item())

            if "acne" in self.models:
                acne_logits = self.models["acne"](tensor)
                results["acne_class"] = int(acne_logits.argmax(1).item())
                results["acne_probs"] = torch.softmax(acne_logits, dim=1).cpu().tolist()[0]

            if "skin_tone" in self.models:
                skintone_logits = self.models["skin_tone"](tensor)
                results["skin_tone_type"] = int(skintone_logits.argmax(1).item())
                results["skin_tone_probs"] = torch.softmax(skintone_logits, dim=1).cpu().tolist()[0]

            if "gender" in self.models:
                results["gender"] = int(self.models["gender"](tensor).argmax(1).item())

            if "face_quality" in self.models:
                results["face_quality"] = float(self.models["face_quality"](tensor).item())

            if "age" in self.models:
                results["age"] = float(self.models["age"](tensor).item())

            if "facial_attributes" in self.models:
                attributes = torch.sigmoid(self.models["facial_attributes"](tensor))
                results["facial_attributes"] = (attributes > 0.5).int().cpu().tolist()[0]

        return results