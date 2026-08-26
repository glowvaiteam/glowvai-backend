from PIL import Image

import pandas as pd

import torch

from torch.utils.data import Dataset


class GenderDataset(Dataset):

    def __init__(
        self,
        metadata_file,
        transform=None,
    ):

        self.df = pd.read_csv(
            metadata_file,
            low_memory=False,
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
            int(row["gender"]),
            dtype=torch.long,
        )

        return {

            "image": image,

            "label": label,

            "image_id": row["image_id"],

        }