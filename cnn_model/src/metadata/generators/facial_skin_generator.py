from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class FacialSkinMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the Facial Skin dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="facial_skin",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = (
            self.processed_dataset_dir /
            "images"
        )

        self.labels_file = (
            self.processed_dataset_dir /
            "labels.csv"
        )

    def load_labels(self) -> pd.DataFrame:

        if not self.labels_file.exists():
            raise FileNotFoundError(
                self.labels_file
            )

        return pd.read_csv(
            self.labels_file
        )

    def build_metadata(self) -> pd.DataFrame:

        df = self.load_labels()

        metadata_rows = []

        view_mapping = {
            "image front": "front",
            "image right side": "right-side",
            "image left side": "left-side",
        }

        for _, row in df.iterrows():
            person_id = int(row["id"])

            for column_name, view_name in view_mapping.items():

                if person_id == 1:
                    filename = f"{view_name}.jpg"
                else:
                    filename = f"{view_name} ({person_id}).jpg"
                
                image_path = self.image_dir / filename

                metadata_rows.append(

                    {

                        "image_id": f"{person_id}_{view_name}",

                        "image_path": str(image_path),

                        "dataset_name": self.dataset_name,

                        "task": "facial_skin",

                        "split": "unassigned",

                        "gender": row["gender"],

                        "view": view_name,

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

                "gender",

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
            "facial_skin_metadata.csv",
        )

        print()

        print(metadata.head())

        print()

        print("=" * 60)

        print(
            "Facial Skin Metadata Generated"
        )

        print("=" * 60)

        print()

        print(
            f"Rows : {len(metadata)}"
        )

        print(
            "Saved : datasets/metadata/facial_skin_metadata.csv"
        )