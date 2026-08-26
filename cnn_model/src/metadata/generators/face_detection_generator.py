from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class FaceDetectionMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for YOLO Face Detection dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="face_detection",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.images_dir = (
            self.processed_dataset_dir /
            "images"
        )

        self.labels_dir = (
            self.processed_dataset_dir /
            "labels"
        )

    def load_labels(self) -> pd.DataFrame:
        """
        YOLO labels are stored as individual .txt files.
        """
        return pd.DataFrame()

    def build_metadata(self) -> pd.DataFrame:

        metadata_rows = []

        for split in ["train", "val"]:

            image_dir = self.images_dir / split
            label_dir = self.labels_dir / split

            image_files = sorted(
                image_dir.glob("*.jpg")
            )

            for image_path in image_files:

                label_path = (
                    label_dir /
                    f"{image_path.stem}.txt"
                )

                metadata_rows.append(
                    {

                        "image_id": image_path.stem,

                        "image_path": image_path,

                        "label_path": label_path,

                        "dataset_name": self.dataset_name,

                        "task": "face_detection",

                        "split": split,

                        "label_exists": label_path.exists(),

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
                "label_path",
                "dataset_name",
                "task",
                "split",
            ],
        )

        self.validate_paths(metadata)

        return metadata

    def run(self):

        metadata = self.generate()

        self.save_metadata(
            metadata,
            "face_detection_metadata.csv",
        )

        print()
        print(metadata.head())
        print()

        print("=" * 60)
        print("Face Detection Metadata Generated")
        print("=" * 60)
        print()

        print(f"Rows : {len(metadata)}")

        print(
            "Saved : datasets/metadata/face_detection_metadata.csv"
        )