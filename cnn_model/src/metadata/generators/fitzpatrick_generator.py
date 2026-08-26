from pathlib import Path

import pandas as pd

from .base_generator import BaseMetadataGenerator


class FitzpatrickMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the Fitzpatrick17K dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="fitzpatrick17k",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = (
            self.processed_dataset_dir /
            "images"
        )

        self.labels_file = (
            self.processed_dataset_dir /
            "fitzpatrick17k.csv"
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
            df["md5hash"]
        )

        metadata["image_path"] = (
            self.image_dir /
            (
                df["md5hash"] +
                ".jpg"
            )
        )

        metadata["dataset_name"] = (
            self.dataset_name
        )

        metadata["task"] = (
            "skin_tone"
        )

        metadata["split"] = (
            "unassigned"
        )

        # ---------------- Labels ---------------- #

        metadata["fitzpatrick_scale"] = (
            df["fitzpatrick_scale"]
        )

        metadata["fitzpatrick_centaur"] = (
            df["fitzpatrick_centaur"]
        )

        metadata["label"] = (
            df["label"]
        )

        metadata["nine_partition_label"] = (
            df["nine_partition_label"]
        )

        metadata["three_partition_label"] = (
            df["three_partition_label"]
        )

        metadata["qc"] = (
            df["qc"]
        )

        metadata["url"] = (
            df["url"]
        )

        metadata["url_alphanum"] = (
            df["url_alphanum"]
        )

        self.validate_columns(
            metadata,
            [
                "image_id",
                "image_path",
                "dataset_name",
                "task",
                "split",
                "fitzpatrick_scale",
            ],
        )

        self.validate_paths(
            metadata
        )

        return metadata

    def run(self):

        metadata = (
            self.generate()
        )

        self.save_metadata(
            metadata,
            "fitzpatrick_metadata.csv",
        )

        print()

        print(
            metadata.head()
        )

        print()

        print("=" * 60)

        print(
            "Fitzpatrick Metadata Generated"
        )

        print("=" * 60)

        print()

        print(
            f"Rows : {len(metadata)}"
        )

        print(
            "Saved : datasets/metadata/fitzpatrick_metadata.csv"
        )