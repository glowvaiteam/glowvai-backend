import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.data.dataloader import create_dataloader


def main():

    loader = create_dataloader("train")

    print()

    print("=" * 60)
    print("DATALOADER TEST")
    print("=" * 60)

    print()

    print("Batches :", len(loader))

    batch = next(iter(loader))

    print()

    print("Batch Keys:")

    print(batch.keys())

    print()

    print("Image Tensor Shape:")

    print(batch["image"].shape)

    print()

    print("Batch Size:")

    print(len(batch["image"]))

    print()

    print("Datasets in Batch:")

    print(batch["dataset_name"][:5])


if __name__ == "__main__":

    main()