from pathlib import Path

import pandas as pd
from PIL import Image

from torch.utils.data import Dataset


class PortraitDataset(Dataset):

    def __init__(
        self,
        metadata_file,
        transform=None,
    ):

        self.metadata = pd.read_csv(
            metadata_file
        )

        self.transform = transform


        self.metadata = self.metadata[
            self.metadata["dataset_name"]
            ==
            "scut_fbp5500"
        ]


        self.metadata = self.metadata.dropna(
            subset=[
                "portrait_score"
            ]
        )


    def __len__(self):

        return len(
            self.metadata
        )


    def __getitem__(
        self,
        index
    ):

        row = self.metadata.iloc[index]


        image_path = Path(
            row["image_path"]
        )


        image = Image.open(
            image_path
        ).convert(
            "RGB"
        )


        if self.transform:

            image = self.transform(
                image
            )


        label = float(
            row["portrait_score"]
        )


        return {

            "image": image,

            "label": label,

            "image_id":
                row["image_id"]

        }