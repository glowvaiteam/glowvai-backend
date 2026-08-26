from pathlib import Path

import pandas as pd


class MetadataValidator:

    def __init__(self, metadata_path: Path):

        self.metadata_path = metadata_path

        self.df = pd.read_csv(
            metadata_path,
            low_memory=False,
        )

    def validate(self):

        report = {}

        report["rows"] = len(self.df)

        report["columns"] = len(self.df.columns)

        report["is_empty"] = self.df.empty

        report["duplicate_rows"] = (
            self.df.duplicated().sum()
        )

        report["duplicate_dataset_image_ids"] = (
            self.df
            .duplicated(
                subset=[
                    "dataset_name",
                    "image_id",
                ]
            )
            .sum()
        )

        report["missing_values"] = (
            self.df.isnull()
            .sum()
            .sum()
        )

        report["missing_image_paths"] = 0

        if "image_path" in self.df.columns:

            invalid = self.df[
                ~self.df["image_path"]
                .fillna("")
                .apply(lambda x: Path(str(x)).exists())
            ]

            report["missing_image_paths"] = len(invalid)

        report["datasets"] = (
            self.df["dataset_name"]
            .value_counts()
            .to_dict()
        )

        return report