from pathlib import Path

from PIL import Image

import pandas as pd

import torch

from torch.utils.data import Dataset


class FaceDetectionDataset(Dataset):

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

        width, height = image.size

        boxes = []

        label_file = Path(
            row["label_path"]
        )

        if label_file.exists():

            with open(label_file) as f:

                for line in f:

                    cls, xc, yc, w, h = map(
                        float,
                        line.strip().split()
                    )

                    xmin = (xc - w / 2) * width
                    ymin = (yc - h / 2) * height
                    xmax = (xc + w / 2) * width
                    ymax = (yc + h / 2) * height

                    boxes.append(
                        [
                            xmin,
                            ymin,
                            xmax,
                            ymax,
                        ]
                    )

        boxes = torch.tensor(
            boxes,
            dtype=torch.float32,
        )

        labels = torch.ones(
            (
                len(boxes),
            ),
            dtype=torch.int64,
        )

        target = {

            "boxes": boxes,

            "labels": labels,

        }

        if self.transform:

            image = self.transform(
                image
            )

        return {

            "image": image,

            "target": target,

            "image_id": row["image_id"],

        }