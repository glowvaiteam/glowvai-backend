from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_METADATA = PROJECT_ROOT / "datasets" / "metadata"

DATASET_METADATA.mkdir(parents=True, exist_ok=True)