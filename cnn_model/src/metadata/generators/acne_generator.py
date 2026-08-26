from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class AcneMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the Acne04 dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="acne04",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = (
            self.processed_dataset_dir /
            "JPEGImages"
        )

    def load_labels(self) -> pd.DataFrame:
        """
        Acne04 does not provide a labels file.
        Acne severity is encoded in the image filename.
        This method satisfies the BaseMetadataGenerator interface.
        """
        return pd.DataFrame()

    def build_metadata(self) -> pd.DataFrame:
        
        self.load_labels()

        metadata_rows = []

        image_files = sorted(
            self.image_dir.glob("*.jpg")
        )

        severity_map = {
            "levle0": 0,
            "levle1": 1,
            "levle2": 2,
            "levle3": 3,
        }

        for image_path in image_files:

            image_name = image_path.name

            image_stem = image_path.stem

            prefix = image_stem.split("_")[0]

            acne_level = severity_map.get(
                prefix,
                None,
            )

            metadata_rows.append(

                {

                    "image_id": image_stem,

                    "image_path": image_path,

                    "dataset_name": self.dataset_name,

                    "task": "acne_severity",

                    "split": "unassigned",

                    "acne_severity": acne_level,

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

                "acne_severity",

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
            "acne_metadata.csv",
        )

        print()

        print(metadata.head())

        print()

        print("=" * 60)

        print("Acne Metadata Generated")

        print("=" * 60)

        print()

        print(f"Rows : {len(metadata)}")

        print(
            "Saved : datasets/metadata/acne_metadata.csv"
        )