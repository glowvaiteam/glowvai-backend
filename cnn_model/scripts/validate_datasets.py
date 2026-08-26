import numpy as np 
from pathlib import Path
from PIL import Image
import pandas as pd
import json

PROJECT_ROOT = Path(__file__).resolve().parent.parent

RAW_DATASET_DIR = PROJECT_ROOT / "datasets" / "raw"
METADATA_DIR = PROJECT_ROOT / "datasets" / "metadata"

METADATA_DIR.mkdir(parents=True, exist_ok=True)


VALID_EXTENSIONS = {".jpg", ".jpeg", ".png"}

def json_converter(obj):
    if isinstance(obj, np.integer):
        return int(obj)

    if isinstance(obj, np.floating):
        return float(obj)

    if isinstance(obj, np.ndarray):
        return obj.tolist()

    raise TypeError(f"{type(obj)} is not JSON serializable")


def validate_images(image_folder):
    stats = {
        "total_images": 0,
        "valid_images": 0,
        "corrupted_images": 0,
        "non_rgb_images": 0,
        "invalid_extensions": 0,
        "missing_dimensions": 0
    }

    corrupted_files = []

    for image_path in image_folder.rglob("*"):

        if image_path.suffix.lower() not in VALID_EXTENSIONS:
            continue

        stats["total_images"] += 1

        try:
            with Image.open(image_path) as img:

                img.verify()

            with Image.open(image_path) as img:

                width, height = img.size

                if width == 0 or height == 0:
                    stats["missing_dimensions"] += 1

                if img.mode != "RGB":
                    stats["non_rgb_images"] += 1

            stats["valid_images"] += 1

        except Exception:

            stats["corrupted_images"] += 1
            corrupted_files.append(str(image_path))

    return stats, corrupted_files


def validate_scut():

    scut_path = RAW_DATASET_DIR / "scut_fbp5500"

    image_folder = scut_path / "Images"

    ratings_file = scut_path / "All_Ratings.xlsx"

    stats, corrupted = validate_images(image_folder)

    ratings = pd.read_excel(ratings_file)

    report = {
        "dataset": "SCUT-FBP5500",
        "image_statistics": stats,
        "rating_rows": int(len(ratings)),
        "unique_images_in_labels": int(ratings["Filename"].nunique()),
        "missing_rating_values": int(ratings["Rating"].isna().sum()),
        "corrupted_files": corrupted
    }

    return report


def validate_celeba():

    celeba_path = RAW_DATASET_DIR / "celeba"

    image_folder = celeba_path / "img_align_celeba"

    attr_file = celeba_path / "list_attr_celeba.txt"

    stats, corrupted = validate_images(image_folder)

    with open(attr_file, "r") as f:
        total_lines = len(f.readlines())

    report = {
        "dataset": "CelebA",
        "image_statistics": stats,
        "attribute_lines": total_lines,
        "corrupted_files": corrupted
    }

    return report


def main():

    report = {
        "SCUT": validate_scut(),
        "CelebA": validate_celeba()
    }

    output_file = METADATA_DIR / "dataset_report.json"

    with open(output_file, "w") as f:
        json.dump(report, f, indent=4, default=json_converter)

    print("=" * 60)
    print("DATASET VALIDATION COMPLETED")
    print("=" * 60)
    print(json.dumps(report, indent=4))
    print()
    print(f"Report saved to: {output_file}")


if __name__ == "__main__":
    main()