import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.face_detection_dataset import (
    FaceDetectionDataset,
)

transform = transforms.Compose([

    transforms.Resize((640, 640)),

    transforms.ToTensor(),

])

dataset = FaceDetectionDataset(

    "datasets/metadata/face_detection_metadata.csv",

    transform,

)

sample = dataset[0]

print()

print("=" * 60)
print("FACE DETECTION DATASET")
print("=" * 60)
print()

print("Samples :", len(dataset))
print()

print(sample["image"].shape)
print()

print(sample["target"])