import os
from pathlib import Path
import urllib.request
import torch
from torchvision import transforms
from PIL import Image

try:
    from src.models.model_factory import create_model
except ImportError:
    from cnn_model.src.models.model_factory import create_model

# Direct GitHub Releases CDN URLs for model weights
RELEASE_URLS = {
    "acne": "https://github.com/glowvaiteam/glowvai-backend/releases/download/v1.0.0/acne_model.pth",
    "skin_tone": "https://github.com/glowvaiteam/glowvai-backend/releases/download/v1.0.0/skintone_model.pth",
}


class CNNPredictor:
    def __init__(self, device=None, base_checkpoint_dir=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")

        if base_checkpoint_dir:
            self.base_dir = Path(base_checkpoint_dir)
        else:
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

    def download_if_missing(self, task: str, ckpt_path: Path):
        """Downloads trained weights from GitHub Releases on demand."""
        if not ckpt_path.exists() and task in RELEASE_URLS:
            ckpt_path.parent.mkdir(parents=True, exist_ok=True)
            url = RELEASE_URLS[task]
            print(f"[CNNPredictor] Downloading {task} weights from {url}...")
            try:
                urllib.request.urlretrieve(url, ckpt_path)
                print(f"[CNNPredictor] Successfully downloaded {task} weights ({ckpt_path.stat().st_size / (1024*1024):.1f} MB)")
            except Exception as e:
                print(f"[CNNPredictor] Could not download from release URL: {e}")

    def load_model(self, task: str, relative_ckpt_path: str):
        ckpt_path = self.base_dir / relative_ckpt_path
        self.download_if_missing(task, ckpt_path)

        model = create_model(task)

        if ckpt_path.exists():
            try:
                ckpt = torch.load(ckpt_path, map_location=self.device)
                if isinstance(ckpt, dict) and "model_state_dict" in ckpt:
                    model.load_state_dict(ckpt["model_state_dict"])
                elif isinstance(ckpt, dict):
                    model.load_state_dict(ckpt)
                print(f"[CNNPredictor] Loaded trained weights for {task}")
            except Exception as e:
                print(f"[CNNPredictor] Load warning for {task}: {e}")
        else:
            print(f"[CNNPredictor] Running initialized head for {task}")

        model.to(self.device)
        model.eval()
        return model

    def load_models(self):
        # 1. Real trained Acne CNN model
        self.models["acne"] = self.load_model("acne", "acne/acne_model.pth")

        # 2. Real trained Fitzpatrick Skin Tone CNN model
        self.models["skin_tone"] = self.load_model("skin_tone", "skintone/skintone_model.pth")

    def predict(self, image_input):
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
            if "acne" in self.models:
                acne_logits = self.models["acne"](tensor)
                results["acne_class"] = int(acne_logits.argmax(1).item())
                results["acne_probs"] = torch.softmax(acne_logits, dim=1).cpu().tolist()[0]

            if "skin_tone" in self.models:
                skintone_logits = self.models["skin_tone"](tensor)
                results["skin_tone_type"] = int(skintone_logits.argmax(1).item())
                results["skin_tone_probs"] = torch.softmax(skintone_logits, dim=1).cpu().tolist()[0]

        return results