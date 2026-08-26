from pathlib import Path

import sys

sys.path.append(".")

from src.metadata.generators.facial_skin_generator import (
    FacialSkinMetadataGenerator,
)

generator = FacialSkinMetadataGenerator(

    processed_dataset_dir=Path(
        "datasets/raw/facial_skin"
    ),

    metadata_output_dir=Path(
        "datasets/metadata"
    ),

)

generator.run()