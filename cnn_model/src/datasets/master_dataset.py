from pathlib import Path

import pandas as pd
from torch.utils.data import Dataset

from src.data.image_loader import ImageLoader


class MasterDataset(Dataset):
    """
    Unified dataset for all CNN models.
    """

    def __init__(
        self,
        metadata_file,
        split=None,
        transform=None,
    ):

        self.df = pd.read_csv(
            metadata_file,
            low_memory=False,
        )

        if split is not None:

            self.df = self.df[
                self.df["split"] == split
            ].reset_index(drop=True)

        self.transform = transform

        self.loader = ImageLoader()

    def __len__(self):

        return len(self.df)

    def __getitem__(self, index):

        row = self.df.iloc[index]

        image = self.loader.load(
            row["image_path"]
        )

        if self.transform is not None:

            image = self.transform(image)

        sample = {

            "image": image,

            "image_id": str(row["image_id"]),

            "dataset_name": str(row["dataset_name"]),

            "task": str(row["task"]),

            

        }

        return sample