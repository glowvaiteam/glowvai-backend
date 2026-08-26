from pathlib import Path

import pandas as pd
import torch

from PIL import Image

from torch.utils.data import Dataset


class FacialAttributesDataset(Dataset):

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

        self.df = self.df[
            self.df["dataset_name"] == "celeba"
        ].reset_index(drop=True)

    def __len__(self):

        return len(self.df)

    def __getitem__(self, index):

        row = self.df.iloc[index]

        image = Image.open(
            row["image_path"]
        ).convert("RGB")

        if self.transform:

            image = self.transform(image)

        labels = torch.tensor(

            [

                row["Arched_Eyebrows"],

                row["Bushy_Eyebrows"],

                row["Narrow_Eyes"],

                row["Big_Lips"],

                row["Big_Nose"],

                row["Pointy_Nose"],

                row["High_Cheekbones"],

                row["Oval_Face"],

            ],

            dtype=torch.float32,

        )

        return {

            "image": image,

            "labels": labels,

            "image_id": row["image_id"],

        }