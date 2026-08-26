from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parent.parent

sys.path.insert(0, str(PROJECT_ROOT))

from src.metadata.generators.celeba_generator import (
    CelebAMetadataGenerator,
)

generator = CelebAMetadataGenerator(
    processed_dataset_dir=PROJECT_ROOT
    / "datasets"
    / "processed"
    / "celeba",

    metadata_output_dir=PROJECT_ROOT
    / "datasets"
    / "metadata",
)

generator.run()