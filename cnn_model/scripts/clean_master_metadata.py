from pathlib import Path
import sys

sys.path.append(".")

from src.metadata.clean_master_metadata import (
    MasterMetadataCleaner,
)

cleaner = MasterMetadataCleaner(

    Path(
        "datasets/metadata/master_metadata.csv"
    )

)

cleaner.run()