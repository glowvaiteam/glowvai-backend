from pathlib import Path

from src.validation.image_validator import ImageValidator
from src.validation.metadata_validator import MetadataValidator
from src.validation.label_validator import LabelValidator
from src.validation.statistics import StatisticsGenerator
from src.validation.report import ValidationReport


class DatasetValidator:
    """
    Master validator responsible for validating a dataset
    from its metadata file.
    """

    def __init__(self):

        self.image_validator = ImageValidator()

        self.metadata_validator = MetadataValidator()

        self.label_validator = LabelValidator()

        self.statistics_generator = StatisticsGenerator()

        self.report_generator = ValidationReport()

    def validate(self, metadata_file: Path):

        print("\n" + "=" * 70)
        print(f"Validating : {metadata_file.name}")
        print("=" * 70)

        # ---------------------------------------
        # Load Metadata
        # ---------------------------------------

        metadata = self.metadata_validator.load_metadata(
            metadata_file
        )

        # ---------------------------------------
        # Run Validators
        # ---------------------------------------

        image_report = self.image_validator.validate(
            metadata
        )

        metadata_report = self.metadata_validator.validate(
            metadata
        )

        label_report = self.label_validator.validate(
            metadata
        )

        statistics_report = (
            self.statistics_generator.generate(
                metadata
            )
        )

        # ---------------------------------------
        # Overall Status
        # ---------------------------------------

        overall_status = "PASS"

        if metadata_report["status"] != "PASS":
            overall_status = "FAIL"

        if label_report["status"] != "PASS":
            overall_status = "FAIL"

        if (
            image_report["missing_images"] > 0
            or image_report["corrupted_images"] > 0
            or image_report["invalid_format"] > 0
            or image_report["invalid_size"] > 0
        ):
            overall_status = "FAIL"

        # ---------------------------------------
        # Final Report
        # ---------------------------------------

        dataset_name = metadata["dataset_name"].iloc[0]

        report = {

            "dataset": dataset_name,

            "overall_status": overall_status,

            "image_validation": image_report,

            "metadata_validation": metadata_report,

            "label_validation": label_report,

            "statistics": statistics_report

        }

        self.report_generator.save(report)

        return report