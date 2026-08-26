import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import torch
from torch.utils.data import DataLoader
from torchvision import transforms

from src.training.evaluator import Evaluator
from src.models.model_factory import create_model

from src.datasets.portrait_dataset import PortraitDataset
from src.datasets.acne_dataset import AcneDataset
from src.datasets.skintone_dataset import SkinToneDataset
from src.datasets.gender_dataset import GenderDataset
from src.datasets.face_quality_dataset import FaceQualityDataset
from src.datasets.age_dataset import AgeDataset
from src.datasets.facial_attributes_dataset import FacialAttributesDataset


DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


transform = transforms.Compose([

    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(

        mean=[0.485, 0.456, 0.406],

        std=[0.229, 0.224, 0.225]

    )

])


MODELS = [

    {

        "name": "portrait",

        "task": "portrait_score",

        "checkpoint":
        "checkpoints/portrait/portrait_model.pth",

        "dataset": PortraitDataset,

        "metadata":
        "datasets/metadata/scut_metadata.csv",

    },

    {

        "name": "acne",

        "task": "acne",

        "checkpoint":
        "checkpoints/acne/acne_model.pth",

        "dataset": AcneDataset,

        "metadata":
        "datasets/metadata/acne_metadata.csv",

    },

    {

        "name": "skin_tone",

        "task": "skin_tone",

        "checkpoint":
        "checkpoints/skintone/skintone_model.pth",

        "dataset": SkinToneDataset,

        "metadata":
        "datasets/metadata/fitzpatrick_metadata.csv",

    },

    {

        "name": "gender",

        "task": "gender",

        "checkpoint":
        "checkpoints/gender/gender_model.pth",

        "dataset": GenderDataset,

        "metadata":
        "datasets/metadata/utkface_metadata.csv",

    },

    {

        "name": "face_quality",

        "task": "face_quality",

        "checkpoint":
        "checkpoints/face_quality/face_quality_model.pth",

        "dataset": FaceQualityDataset,

        "metadata":
        "datasets/metadata/scut_metadata.csv",

    },

    {

        "name": "age",

        "task": "age",

        "checkpoint":
        "checkpoints/age/age_model.pth",

        "dataset": AgeDataset,

        "metadata":
        "datasets/metadata/utkface_metadata.csv",

    },

    {

        "name": "facial_attributes",

        "task": "facial_attributes",

        "checkpoint":
        "checkpoints/facial_attributes/facial_attributes_model.pth",

        "dataset": FacialAttributesDataset,

        "metadata":
        "datasets/metadata/celeba_metadata.csv",

    },

]


def evaluate(config):

    print("=" * 60)

    print(config["name"].upper())

    print("=" * 60)

    print("Loading dataset...")

    dataset = config["dataset"](
        config["metadata"],
        transform
    )

    print("Dataset loaded:", len(dataset))

    loader = DataLoader(

        dataset,

        batch_size=16,

        shuffle=False,

        num_workers=0

    )

    print("Creating model...")

    model = create_model(
        config["task"]
    ).to(DEVICE)

    print("Loading checkpoint...")

    checkpoint = torch.load(

        config["checkpoint"],

        map_location=DEVICE

    )

    model.load_state_dict(

        checkpoint["model_state_dict"]

    )

    print("Running evaluation...")


    evaluator = Evaluator(

        model,

        DEVICE

    )

    results = evaluator.evaluate(
        loader,
        config["task"]
    )

    print("Metrics:")

    print(
        results["metrics"]
    )

    print()


def main():

    for model in MODELS:

        evaluate(model)


if __name__ == "__main__":

    main()