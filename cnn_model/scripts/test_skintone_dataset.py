import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.skintone_dataset import SkinToneDataset


transform = transforms.Compose([

    transforms.Resize(
        (224,224)
    ),

    transforms.ToTensor(),

])


dataset = SkinToneDataset(

    "datasets/metadata/fitzpatrick_metadata.csv",

    transform

)

print()

print("="*60)
print("SKIN TONE DATASET")
print("="*60)

print()

print(
    "Samples :",
    len(dataset)
)

print()

sample = dataset[0]

print(
    sample["image"].shape
)

print(
    sample["label"]
)