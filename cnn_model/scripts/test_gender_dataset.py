import sys

from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.gender_dataset import GenderDataset


transform = transforms.Compose([

    transforms.Resize((224,224)),

    transforms.ToTensor()

])


dataset = GenderDataset(

    "datasets/metadata/utkface_metadata.csv",

    transform

)

print()

print("="*60)

print("GENDER DATASET")

print("="*60)

print()

print("Samples :",len(dataset))

print()

sample = dataset[0]

print(sample["image"].shape)

print(sample["label"])