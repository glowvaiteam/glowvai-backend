import sys
from pathlib import Path

# Add project root to Python path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.config.dataset_config import (
    CHECKPOINT_DIR,
    LOG_DIR,
    RESULT_DIR,
)


def main():

    for directory in [
        CHECKPOINT_DIR,
        LOG_DIR,
        RESULT_DIR,
    ]:

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        print(f"Created : {directory}")


if __name__ == "__main__":
    main()