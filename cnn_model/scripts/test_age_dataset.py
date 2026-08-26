import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.age_dataset import AgeDataset


transform = transforms.Compose([

    transforms.Resize((224,224)),

    transforms.ToTensor()

])


dataset = AgeDataset(

    "datasets/metadata/utkface_metadata.csv",

    transform

)

sample = dataset[0]

print()

print("="*60)

print("AGE DATASET")

print("="*60)

print()

print(

    "Samples :",

    len(dataset)

)

print()

print(

    sample["image"].shape

)

print(

    sample["label"]

)