from pathlib import Path
import sys

sys.path.append(".")

from src.metadata.generators.utkface_generator import (
    UTKFaceMetadataGenerator,
)

generator = UTKFaceMetadataGenerator(
    processed_dataset_dir=Path(
        "datasets/raw/utkface"
    ),
    metadata_output_dir=Path(
        "datasets/metadata"
    ),
)

generator.run()