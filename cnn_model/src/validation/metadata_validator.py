from pathlib import Path
import pandas as pd


class MetadataValidator:
    """
    Validates metadata CSV files before model training.
    """

    REQUIRED_COLUMNS = [
        "image_id",
        "image_path",
        "dataset_name",
        "task",
        "split"
    ]

    VALID_IMAGE_EXTENSIONS = {
        ".jpg",
        ".jpeg",
        ".png",
        ".bmp",
        ".webp"
    }

    def load_metadata(self, metadata_file):

        metadata_file = Path(metadata_file)

        if not metadata_file.exists():
            raise FileNotFoundError(
                f"Metadata file not found:\n{metadata_file}"
            )

        return pd.read_csv(metadata_file)

    def validate(self, metadata):

        report = {}

        # -----------------------------------
        # Basic Information
        # -----------------------------------

        report["rows"] = int(len(metadata))
        report["columns"] = int(len(metadata.columns))

        # -----------------------------------
        # Empty Metadata
        # -----------------------------------

        report["is_empty"] = len(metadata) == 0

        # -----------------------------------
        # Required Columns
        # -----------------------------------

        missing_columns = []

        for column in self.REQUIRED_COLUMNS:

            if column not in metadata.columns:
                missing_columns.append(column)

        report["missing_columns"] = missing_columns

        # -----------------------------------
        # Duplicate Image IDs
        # -----------------------------------

        duplicate_ids = metadata["image_id"].duplicated().sum()

        report["duplicate_image_ids"] = int(
            duplicate_ids
        )

        # -----------------------------------
        # Duplicate Image Paths
        # -----------------------------------

        duplicate_paths = metadata[
            "image_path"
        ].duplicated().sum()

        report["duplicate_image_paths"] = int(
            duplicate_paths
        )

        # -----------------------------------
        # Missing Values
        # -----------------------------------

        report["missing_values"] = int(
            metadata.isna().sum().sum()
        )

        # -----------------------------------
        # Empty Rows
        # -----------------------------------

        empty_rows = metadata.isnull().all(axis=1).sum()

        report["empty_rows"] = int(
            empty_rows
        )

        # -----------------------------------
        # Invalid Paths
        # -----------------------------------

        invalid_paths = []

        for path in metadata["image_path"]:

            image_path = Path(path)

            if not image_path.exists():

                invalid_paths.append(
                    str(image_path)
                )

        report["invalid_paths"] = invalid_paths

        report["invalid_path_count"] = len(
            invalid_paths
        )

        # -----------------------------------
        # File Extension Validation
        # -----------------------------------

        invalid_extensions = []

        for path in metadata["image_path"]:

            extension = Path(path).suffix.lower()

            if extension not in self.VALID_IMAGE_EXTENSIONS:

                invalid_extensions.append(
                    str(path)
                )

        report["invalid_extensions"] = (
            invalid_extensions
        )

        report["invalid_extension_count"] = len(
            invalid_extensions
        )

        # -----------------------------------
        # Overall Status
        # -----------------------------------

        report["status"] = (
            "PASS"
            if (
                len(missing_columns) == 0
                and duplicate_ids == 0
                and duplicate_paths == 0
                and report["missing_values"] == 0
                and report["invalid_path_count"] == 0
                and report["invalid_extension_count"] == 0
                and not report["is_empty"]
            )
            else "FAIL"
        )

        return report