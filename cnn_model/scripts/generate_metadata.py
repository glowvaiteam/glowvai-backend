from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parent.parent

sys.path.insert(0, str(PROJECT_ROOT))

from src.metadata.manager import MetadataManager


manager = MetadataManager(PROJECT_ROOT)

manager.run()