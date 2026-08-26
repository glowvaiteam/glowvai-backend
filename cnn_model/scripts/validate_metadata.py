from pathlib import Path
import sys

# -----------------------------------------------------
# Add project root to Python path
# -----------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# -----------------------------------------------------
# Import validator
# -----------------------------------------------------

from src.validation.validator import DatasetValidator

# -----------------------------------------------------
# Metadata Directory
# -----------------------------------------------------

METADATA_DIR = (
    PROJECT_ROOT /
    "datasets" /
    "metadata"
)


def print_separator():

    print("=" * 90)


def main():

    validator = DatasetValidator()

    metadata_files = sorted(
        METADATA_DIR.glob("*_metadata.csv")
    )

    if not metadata_files:

        print("No metadata files found.")
        return

    summary = []

    print()
    print_separator()
    print("GlowVAI Dataset Validation")
    print_separator()

    for metadata_file in metadata_files:

        report = validator.validate(metadata_file)

        image = report["image_validation"]

        meta = report["metadata_validation"]

        stats = report["statistics"]

        summary.append({

            "dataset": report["dataset"],

            "status": report["overall_status"],

            "samples": stats["total_samples"],

            "missing_images": image["missing_images"],

            "corrupted": image["corrupted_images"],

            "duplicates": meta["duplicate_image_ids"],

            "missing_values": meta["missing_values"]

        })

    print()

    print_separator()

    print("VALIDATION SUMMARY")

    print_separator()

    print(
        f'{"Dataset":20}'
        f'{"Status":10}'
        f'{"Samples":12}'
        f'{"Missing":12}'
        f'{"Corrupted":12}'
        f'{"Duplicates":12}'
        f'{"NaN":8}'
    )

    print("-" * 90)

    passed = 0
    failed = 0

    for item in summary:

        if item["status"] == "PASS":
            passed += 1
        else:
            failed += 1

        print(
            f'{item["dataset"]:20}'
            f'{item["status"]:10}'
            f'{item["samples"]:12}'
            f'{item["missing_images"]:12}'
            f'{item["corrupted"]:12}'
            f'{item["duplicates"]:12}'
            f'{item["missing_values"]:8}'
        )

    print_separator()

    print(f"Datasets Passed : {passed}")
    print(f"Datasets Failed : {failed}")
    print(f"Total Datasets  : {len(summary)}")

    print_separator()


if __name__ == "__main__":
    main()