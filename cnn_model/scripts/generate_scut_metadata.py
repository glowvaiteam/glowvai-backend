from pathlib import Path
import sys

# --------------------------------------------------
# Add project root to Python path
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

sys.path.insert(0, str(PROJECT_ROOT))

# --------------------------------------------------

from src.metadata.generators.scut_generator import SCUTMetadataGenerator

generator = SCUTMetadataGenerator(
    processed_dataset_dir=PROJECT_ROOT / "datasets" / "processed" / "scut_fbp5500",
    metadata_output_dir=PROJECT_ROOT / "datasets" / "metadata",
)

generator.run()