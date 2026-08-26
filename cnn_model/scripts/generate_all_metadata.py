from pathlib import Path
import sys

sys.path.append(".")

from src.metadata.generators.scut_generator import (
    SCUTMetadataGenerator,
)

from src.metadata.generators.celeba_generator import (
    CelebAMetadataGenerator,
)

from src.metadata.generators.fitzpatrick_generator import (
    FitzpatrickMetadataGenerator,
)

from src.metadata.generators.acne_generator import (
    AcneMetadataGenerator,
)

from src.metadata.generators.ffhq_generator import (
    FFHQMetadataGenerator,
)

from src.metadata.generators.facial_skin_generator import (
    FacialSkinMetadataGenerator,
)

from src.metadata.generators.utkface_generator import (
    UTKFaceMetadataGenerator,
)

from src.metadata.generators.face_detection_generator import (
    FaceDetectionMetadataGenerator,
)


PROCESSED_DATASET_DIR = Path("datasets/processed")
METADATA_DIR = Path("datasets/metadata")


generators = [

    SCUTMetadataGenerator(
        Path("datasets/processed/scut_fbp5500"),
        METADATA_DIR,
    ),

    CelebAMetadataGenerator(
        Path("datasets/processed/celeba"),
        METADATA_DIR,
    ),

    FitzpatrickMetadataGenerator(
        Path("datasets/raw/fitzpatrick17k"),
        METADATA_DIR,
    ),

    AcneMetadataGenerator(
        Path("datasets/raw/acne04"),
        METADATA_DIR,
    ),

    FFHQMetadataGenerator(
        Path("datasets/raw/ffhq"),
        METADATA_DIR,
    ),

    FacialSkinMetadataGenerator(
        Path("datasets/raw/facial_skin"),
        METADATA_DIR,
    ),

    UTKFaceMetadataGenerator(
        Path("datasets/raw/utkface"),
        METADATA_DIR,
    ),

    FaceDetectionMetadataGenerator(
        Path("datasets/raw/face_detection"),
        METADATA_DIR,
    ),

]


def main():

    print()

    print("=" * 70)
    print("Generating Metadata For All Datasets")
    print("=" * 70)

    print()

    for generator in generators:

        print("-" * 70)

        print(generator.dataset_name)

        print("-" * 70)

        generator.run()

        print()

    print("=" * 70)
    print("ALL DATASETS COMPLETED")
    print("=" * 70)


if __name__ == "__main__":
    main()