from pathlib import Path
import sys

sys.path.append(".")

from src.metadata.metadata_validator import (
    MetadataValidator,
)

validator = MetadataValidator(

    Path(
        "datasets/metadata/master_metadata.csv"
    )

)

report = validator.validate()

print()

print("=" * 70)

print("MASTER METADATA REPORT")

print("=" * 70)

print()

for key, value in report.items():

    print(f"{key}: {value}")