from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class UTKFaceMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the UTKFace dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="utkface",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = (
            self.processed_dataset_dir /
            "images"
        )

    def load_labels(self) -> pd.DataFrame:
        """
        UTKFace does not provide a CSV.
        Labels are extracted from filenames.
        """
        return pd.DataFrame()

    def build_metadata(self) -> pd.DataFrame:

        self.load_labels()

        metadata_rows = []

        image_files = sorted(
            self.image_dir.glob("*")
        )

        for image_path in image_files:

            if not image_path.is_file():
                continue

            parts = image_path.name.split("_")

            if len(parts) < 4:
                continue

            try:

                age = int(parts[0])
                gender = int(parts[1])
                race = int(parts[2])

            except ValueError:
                continue

            metadata_rows.append(
                {

                    "image_id": image_path.stem,

                    "image_path": image_path,

                    "dataset_name": self.dataset_name,

                    "task": "age_gender_race",

                    "split": "unassigned",

                    "age": age,

                    "gender": gender,

                    "race": race,

                }
            )

        metadata = pd.DataFrame(metadata_rows)

        self.validate_columns(
            metadata,
            [
                "image_id",
                "image_path",
                "dataset_name",
                "task",
                "split",
                "age",
                "gender",
                "race",
            ],
        )

        self.validate_paths(metadata)

        return metadata

    def run(self):

        metadata = self.generate()

        self.save_metadata(
            metadata,
            "utkface_metadata.csv",
        )

        print()
        print(metadata.head())
        print()

        print("=" * 60)
        print("UTKFace Metadata Generated")
        print("=" * 60)
        print()

        print(f"Rows : {len(metadata)}")
        print(
            "Saved : datasets/metadata/utkface_metadata.csv"
        )