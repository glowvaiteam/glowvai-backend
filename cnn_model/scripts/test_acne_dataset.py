import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from torchvision import transforms

from src.datasets.acne_dataset import AcneDataset


def main():

    transform = transforms.Compose([

        transforms.Resize(
            (224, 224)
        ),

        transforms.ToTensor()

    ])

    dataset = AcneDataset(

        "datasets/metadata/acne_metadata.csv",

        transform

    )

    print()

    print("=" * 60)

    print("ACNE DATASET")

    print("=" * 60)

    print()

    print(
        "Samples :",
        len(dataset)
    )

    sample = dataset[0]

    print()

    print(
        sample["image"].shape
    )

    print(
        sample["label"]
    )

    print()


if __name__ == "__main__":

    main()