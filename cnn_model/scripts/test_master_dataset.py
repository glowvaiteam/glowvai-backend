import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.config.dataset_config import MASTER_SPLIT
from src.data.transforms import ImageTransforms
from src.datasets.master_dataset import MasterDataset


def main():

    dataset = MasterDataset(

        metadata_file=MASTER_SPLIT,

        split="train",

        transform=ImageTransforms.train(),

    )

    print()

    print("=" * 60)
    print("MASTER DATASET TEST")
    print("=" * 60)

    print()

    print("Dataset Size :", len(dataset))

    sample = dataset[0]

    print()

    print("Keys :", list(sample.keys()))

    print()

    print("Image Shape :", tuple(sample["image"].shape))

    print("Image ID :", sample["image_id"])

    print("Dataset :", sample["dataset_name"])

    print("Task :", sample["task"])


if __name__ == "__main__":
    main()