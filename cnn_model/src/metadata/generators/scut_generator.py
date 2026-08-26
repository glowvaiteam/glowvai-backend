from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class SCUTMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the SCUT-FBP5500 dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="scut_fbp5500",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = (
            self.processed_dataset_dir /
            "images"
        )

        self.labels_file = (
            self.processed_dataset_dir /
            "portrait_labels.csv"
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

        metadata = pd.DataFrame()

        metadata["image_id"] = (
            df["filename"]
            .str.replace(".jpg", "", regex=False)
        )

        metadata["image_path"] = (
            self.image_dir /
            df["filename"]
        )

        metadata["dataset_name"] = (
            self.dataset_name
        )

        metadata["task"] = "portrait_score"

        metadata["split"] = "unassigned"

        # -------- Labels -------- #

        if "portrait_score_raw" in df.columns:

            metadata["portrait_score_raw"] = (
                df["portrait_score_raw"]
            )

        else:

            metadata["portrait_score_raw"] = (
                df["portrait_score"]
            )

        if "portrait_score" in df.columns:

            metadata["portrait_score"] = (
                df["portrait_score"]
            )

        if "std" in df.columns:

            metadata["std"] = df["std"]

        if "raters" in df.columns:

            metadata["raters"] = (
                df["raters"]
            )

        self.validate_columns(
            metadata,
            [
                "image_id",
                "image_path",
                "dataset_name",
                "task",
                "split",
                "portrait_score",
            ],
        )

        self.validate_paths(metadata)

        return metadata

    def run(self):

        metadata = self.generate()

        self.save_metadata(
            metadata,
            "scut_metadata.csv",
        )

        print()
        print(metadata.head())

        print()

        print("=" * 60)

        print("SCUT Metadata Generated")

        print("=" * 60)

        print()

        print(
            f"Rows : {len(metadata)}"
        )

        print(
            "Saved : datasets/metadata/scut_metadata.csv"
        )
