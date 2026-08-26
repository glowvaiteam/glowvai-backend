from PIL import Image

import pandas as pd

import torch

from torch.utils.data import Dataset


class SkinToneDataset(Dataset):

    def __init__(
        self,
        metadata_file,
        transform=None,
    ):

        self.df = pd.read_csv(
            metadata_file,
            low_memory=False,
        )

        # ------------------------------------------
        # Remove invalid labels
        # ------------------------------------------

        self.df = self.df[
            self.df["fitzpatrick_scale"] != -1
        ].reset_index(drop=True)

        # ------------------------------------------
        # Convert labels 1-6 -> 0-5
        # ------------------------------------------

        self.df["fitzpatrick_scale"] = (
            self.df["fitzpatrick_scale"] - 1
        )

        self.transform = transform

    def __len__(self):

        return len(self.df)

    def __getitem__(self, index):

        row = self.df.iloc[index]

        image = Image.open(
            row["image_path"]
        ).convert("RGB")

        if self.transform:

            image = self.transform(image)

        label = torch.tensor(

            int(row["fitzpatrick_scale"]),

            dtype=torch.long,

        )

        return {

            "image": image,

            "label": label,

            "image_id": row["image_id"],

        }