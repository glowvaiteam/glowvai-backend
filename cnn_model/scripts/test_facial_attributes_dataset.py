import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.facial_attributes_dataset import (
    FacialAttributesDataset,
)


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

dataset = FacialAttributesDataset(
    "datasets/metadata/master_metadata.csv",
    transform,
)

print()

print("=" * 60)
print("FACIAL ATTRIBUTES DATASET")
print("=" * 60)

print()

print("Samples :", len(dataset))

sample = dataset[0]

print()

print(sample["image"].shape)

print(sample["labels"])