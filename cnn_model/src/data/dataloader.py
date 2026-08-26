from torch.utils.data import DataLoader

from src.config.dataset_config import (
    MASTER_SPLIT,
    BATCH_SIZE,
    NUM_WORKERS,
    PIN_MEMORY,
)

from src.data.transforms import ImageTransforms
from src.datasets.master_dataset import MasterDataset


def create_dataloader(split):

    if split == "train":

        transform = ImageTransforms.train()

        shuffle = True

    else:

        transform = ImageTransforms.validation()

        shuffle = False

    dataset = MasterDataset(

        metadata_file=MASTER_SPLIT,

        split=split,

        transform=transform,

    )

    loader = DataLoader(

        dataset,

        batch_size=BATCH_SIZE,

        shuffle=shuffle,

        num_workers=NUM_WORKERS,

        pin_memory=PIN_MEMORY,

    )

    return loader