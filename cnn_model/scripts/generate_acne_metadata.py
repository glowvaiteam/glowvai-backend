from pathlib import Path

import sys

sys.path.append(".")

from src.metadata.generators.acne_generator import (
    AcneMetadataGenerator,
)

generator = AcneMetadataGenerator(

    processed_dataset_dir=Path(
        "datasets/raw/acne04"
    ),

    metadata_output_dir=Path(
        "datasets/metadata"
    ),

)

generator.run()