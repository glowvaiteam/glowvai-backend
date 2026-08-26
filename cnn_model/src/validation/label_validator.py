import pandas as pd


class LabelValidator:
    """
    Validates dataset-specific labels.

    Supports:
    - SCUT-FBP5500
    - CelebA

    More datasets will be added later.
    """

    def validate(self, metadata):

        dataset = metadata["dataset_name"].iloc[0]

        if dataset == "scut_fbp5500":
            return self.validate_scut(metadata)

        elif dataset == "celeba":
            return self.validate_celeba(metadata)

        else:

            return {
                "status": "UNKNOWN_DATASET",
                "errors": [
                    f"No validator implemented for '{dataset}'"
                ]
            }

    # ---------------------------------------------------------
    # SCUT
    # ---------------------------------------------------------

    def validate_scut(self, metadata):

        report = {
            "dataset": "SCUT",
            "errors": []
        }

        # portrait_score_raw

        if "portrait_score_raw" in metadata.columns:

            invalid = metadata[
                (metadata["portrait_score_raw"] < 1) |
                (metadata["portrait_score_raw"] > 5)
            ]

            if len(invalid):

                report["errors"].append(
                    f"{len(invalid)} invalid portrait_score_raw values"
                )

        # portrait_score

        if "portrait_score" in metadata.columns:

            invalid = metadata[
                (metadata["portrait_score"] < 0) |
                (metadata["portrait_score"] > 100)
            ]

            if len(invalid):

                report["errors"].append(
                    f"{len(invalid)} invalid portrait_score values"
                )

        # std

        if "std" in metadata.columns:

            invalid = metadata[
                metadata["std"] < 0
            ]

            if len(invalid):

                report["errors"].append(
                    f"{len(invalid)} invalid std values"
                )

        # raters

        if "raters" in metadata.columns:

            invalid = metadata[
                metadata["raters"] <= 0
            ]

            if len(invalid):

                report["errors"].append(
                    f"{len(invalid)} invalid rater counts"
                )

        report["status"] = (
            "PASS"
            if len(report["errors"]) == 0
            else "FAIL"
        )

        return report

    # ---------------------------------------------------------
    # CelebA
    # ---------------------------------------------------------

    def validate_celeba(self, metadata):

        report = {
            "dataset": "CelebA",
            "errors": []
        }

        ignore_columns = {
            "image_id",
            "image_path",
            "dataset_name",
            "task",
            "split"
        }

        attribute_columns = [

            c

            for c in metadata.columns

            if c not in ignore_columns

        ]

        for column in attribute_columns:

            invalid = metadata[
                ~metadata[column].isin([0, 1])
            ]

            if len(invalid):

                report["errors"].append(
                    f"{column}: {len(invalid)} invalid values"
                )

        report["status"] = (
            "PASS"
            if len(report["errors"]) == 0
            else "FAIL"
        )

        return report