import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

import pandas as pd

from src.data.image_loader import ImageLoader


def main():

    df = pd.read_csv(
        "datasets/metadata/master_metadata_clean.csv",
        low_memory=False,
    )

    image_path = df.iloc[0]["image_path"]

    loader = ImageLoader()

    image = loader.load(image_path)

    print()

    print("=" * 60)
    print("IMAGE LOADER TEST")
    print("=" * 60)

    print()

    print("Image Path :", image_path)
    print("Image Size :", image.size)
    print("Image Mode :", image.mode)


if __name__ == "__main__":
    main()