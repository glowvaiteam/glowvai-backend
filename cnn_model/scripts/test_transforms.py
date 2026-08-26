import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

import pandas as pd

from src.data.image_loader import ImageLoader
from src.data.transforms import ImageTransforms


def main():

    df = pd.read_csv(

        "datasets/metadata/master_metadata_clean.csv",

        low_memory=False,

    )

    image_path = df.iloc[0]["image_path"]

    loader = ImageLoader()

    image = loader.load(image_path)

    transform = ImageTransforms.train()

    tensor = transform(image)

    print()

    print("=" * 60)

    print("TRANSFORM TEST")

    print("=" * 60)

    print()

    print("Original Size :", image.size)

    print("Tensor Shape  :", tuple(tensor.shape))

    print("Tensor Type   :", tensor.dtype)

    print("Tensor Min    :", float(tensor.min()))

    print("Tensor Max    :", float(tensor.max()))


if __name__ == "__main__":

    main()