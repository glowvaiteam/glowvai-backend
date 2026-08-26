from pathlib import Path
import pandas as pd

from .base_generator import BaseMetadataGenerator


class CelebAMetadataGenerator(BaseMetadataGenerator):
    """
    Metadata generator for the CelebA dataset.
    """

    def __init__(
        self,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):

        super().__init__(
            dataset_name="celeba",
            processed_dataset_dir=processed_dataset_dir,
            metadata_output_dir=metadata_output_dir,
        )

        self.image_dir = self.processed_dataset_dir / "images"
        self.labels_file = self.processed_dataset_dir / "celeba_labels.csv"

    def load_labels(self) -> pd.DataFrame:

        if not self.labels_file.exists():
            raise FileNotFoundError(
                f"Labels file not found: {self.labels_file}"
            )

        return pd.read_csv(self.labels_file)

    def build_metadata(self) -> pd.DataFrame:

        df = self.load_labels()

        metadata = pd.DataFrame()

        metadata["image_id"] = (
            df["filename"]
            .str.replace(".jpg", "", regex=False)
        )

        metadata["image_path"] = df["filename"].apply(
            lambda x: str(self.image_dir / x)
        )

        metadata["dataset_name"] = self.dataset_name

        metadata["task"] = "facial_attributes"

        metadata["split"] = "unassigned"

        # Copy all attribute columns
        exclude = ["filename"]

        attribute_columns = [
            col for col in df.columns
            if col not in exclude
        ]

        for col in attribute_columns:
            metadata[col] = df[col]

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

        self.validate_paths(metadata)

        return metadata

    def run(self):

        metadata = self.generate()

        self.save_metadata(
            metadata,
            "celeba_metadata.csv",
        )

        print()
        print(metadata.head())
        print()

        print("=" * 60)
        print("CelebA Metadata Generated")
        print("=" * 60)
        print(f"Rows : {len(metadata)}")
        print(
            "Saved : datasets/metadata/celeba_metadata.csv"
        )