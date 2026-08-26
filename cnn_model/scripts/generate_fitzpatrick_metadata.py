from pathlib import Path

import sys

sys.path.append(".")

from src.metadata.generators.fitzpatrick_generator import (
    FitzpatrickMetadataGenerator,
)


generator = FitzpatrickMetadataGenerator(

    processed_dataset_dir=Path(
        "datasets/raw/fitzpatrick17k"
    ),

    metadata_output_dir=Path(
        "datasets/metadata"
    ),

)

generator.run()