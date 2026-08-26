from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class FFHQMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the FFHQ dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="ffhq",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = (
            self.processed_dataset_dir /
            "images"
        )

    def load_labels(self) -> pd.DataFrame:
        """
        FFHQ has no labels file.
        """
        return pd.DataFrame()

    def build_metadata(self) -> pd.DataFrame:

        self.load_labels()

        metadata_rows = []

        image_files = sorted(
            self.image_dir.glob("*.png")
        )

        for image_path in image_files:

            metadata_rows.append(

                {

                    "image_id": image_path.stem,

                    "image_path": image_path,

                    "dataset_name": self.dataset_name,

                    "task": "face_representation",

                    "split": "unassigned",

                }

            )

        metadata = pd.DataFrame(
            metadata_rows
        )

        self.validate_columns(

            metadata,

            [

                "image_id",

                "image_path",

                "dataset_name",

                "task",

                "split",

            ],

        )

        self.validate_paths(
            metadata
        )

        return metadata

    def run(self):

        metadata = self.generate()

        self.save_metadata(
            metadata,
            "ffhq_metadata.csv",
        )

        print()

        print(metadata.head())

        print()

        print("=" * 60)

        print("FFHQ Metadata Generated")

        print("=" * 60)

        print()

        print(
            f"Rows : {len(metadata)}"
        )

        print(
            "Saved : datasets/metadata/ffhq_metadata.csv"
        )