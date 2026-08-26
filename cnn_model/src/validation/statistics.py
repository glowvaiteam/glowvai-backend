from pathlib import Path

import pandas as pd


class StatisticsGenerator:
    """
    Generates statistics for a dataset.
    """

    def generate(self, metadata: pd.DataFrame):

        report = {}

        # ---------------------------------------------------
        # Basic Information
        # ---------------------------------------------------

        report["dataset_name"] = metadata["dataset_name"].iloc[0]

        report["total_samples"] = int(len(metadata))

        report["total_columns"] = int(len(metadata.columns))

        report["memory_usage_mb"] = round(
            metadata.memory_usage(deep=True).sum() / (1024 * 1024),
            2
        )

        # ---------------------------------------------------
        # Image Statistics
        # ---------------------------------------------------

        report["unique_images"] = int(
            metadata["image_id"].nunique()
        )

        report["duplicate_images"] = int(
            len(metadata) - metadata["image_id"].nunique()
        )

        # ---------------------------------------------------
        # Split Statistics
        # ---------------------------------------------------

        if "split" in metadata.columns:

            report["split_distribution"] = (
                metadata["split"]
                .value_counts(dropna=False)
                .to_dict()
            )

        else:

            report["split_distribution"] = {}

        # ---------------------------------------------------
        # Task
        # ---------------------------------------------------

        if "task" in metadata.columns:

            report["task"] = metadata["task"].iloc[0]

        else:

            report["task"] = None

        # ---------------------------------------------------
        # Numeric Columns
        # ---------------------------------------------------

        numeric_summary = {}

        numeric_columns = metadata.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:

            numeric_summary[column] = {

                "min": float(metadata[column].min()),

                "max": float(metadata[column].max()),

                "mean": round(
                    float(metadata[column].mean()),
                    3
                ),

                "std": round(
                    float(metadata[column].std()),
                    3
                )

            }

        report["numeric_summary"] = numeric_summary

        return report