import json
from pathlib import Path
from datetime import datetime


class ValidationReport:
    """
    Saves validation reports to JSON files.
    """

    def __init__(self):

        self.output_dir = Path("outputs") / "validation"

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    def save(self, report: dict):

        dataset_name = report["dataset"]

        output_file = (
            self.output_dir /
            f"{dataset_name}_validation_report.json"
        )

        report["generated_at"] = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        with open(
            output_file,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                report,
                f,
                indent=4,
                ensure_ascii=False
            )

        print(f"\nValidation report saved:")
        print(output_file)

        return output_file