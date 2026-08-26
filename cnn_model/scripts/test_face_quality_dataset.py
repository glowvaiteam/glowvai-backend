import sys

from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.face_quality_dataset import FaceQualityDataset


transform = transforms.Compose([

    transforms.Resize((224,224)),

    transforms.ToTensor(),

])

dataset = FaceQualityDataset(

    "datasets/metadata/scut_metadata.csv",

    transform

)

print()

print("="*60)

print("FACE QUALITY DATASET")

print("="*60)

print()

print("Samples :", len(dataset))

print()

sample = dataset[0]

print(sample["image"].shape)

print(sample["label"])