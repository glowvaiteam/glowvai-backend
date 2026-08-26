from pathlib import Path
import sys

sys.path.append(".")

from src.metadata.generators.face_detection_generator import (
    FaceDetectionMetadataGenerator,
)

generator = FaceDetectionMetadataGenerator(
    processed_dataset_dir=Path(
        "datasets/raw/face_detection"
    ),
    metadata_output_dir=Path(
        "datasets/metadata"
    ),
)

generator.run()