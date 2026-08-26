import torch
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_DATASET_DIR = (
    PROJECT_ROOT /
    "datasets" /
    "raw"
)

METADATA_DIR = (
    PROJECT_ROOT /
    "datasets" /
    "metadata"
)

MASTER_METADATA = (
    METADATA_DIR /
    "master_metadata_clean.csv"
)

MASTER_SPLIT = (
    METADATA_DIR /
    "master_metadata_split.csv"
)

CHECKPOINT_DIR = (
    PROJECT_ROOT /
    "checkpoints"
)

LOG_DIR = (
    PROJECT_ROOT /
    "logs"
)

RESULT_DIR = (
    PROJECT_ROOT /
    "results"
)

IMAGE_SIZE = 224

BATCH_SIZE = 32

NUM_WORKERS = 4

PIN_MEMORY = torch.cuda.is_available()

RANDOM_SEED = 42

TRAIN_SPLIT = "train"

VALID_SPLIT = "validation"

TEST_SPLIT = "test"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"