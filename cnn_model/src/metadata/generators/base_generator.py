from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional

import logging
import pandas as pd


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)


class BaseMetadataGenerator(ABC):
    """
    Base class for every dataset metadata generator.

    Every dataset (SCUT, CelebA, Fitzpatrick17K, etc.)
    must inherit from this class.
    """

    def __init__(
        self,
        dataset_name: str,
        processed_dataset_dir: Path,
        metadata_output_dir: Path,
    ):
        self.dataset_name = dataset_name
        self.processed_dataset_dir = processed_dataset_dir
        self.metadata_output_dir = metadata_output_dir

        self.metadata_output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    @abstractmethod
    def load_labels(self) -> pd.DataFrame:
        """
        Load processed labels.
        """
        raise NotImplementedError

    @abstractmethod
    def build_metadata(self) -> pd.DataFrame:
        """
        Convert processed labels into metadata.
        """
        raise NotImplementedError

    def save_metadata(
        self,
        metadata: pd.DataFrame,
        filename: str,
    ) -> Path:

        output_file = self.metadata_output_dir / filename

        metadata.to_csv(
            output_file,
            index=False
        )

        logger.info(
            "Saved metadata -> %s",
            output_file
        )

        return output_file

    def validate_columns(
        self,
        metadata: pd.DataFrame,
        required_columns: list[str],
    ):

        missing = [
            c
            for c in required_columns
            if c not in metadata.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

    def validate_paths(
        self,
        metadata: pd.DataFrame,
        path_column: str = "image_path",
    ):

        invalid = metadata[
            ~metadata[path_column].apply(
                lambda x: Path(x).exists()
            )
        ]

        if len(invalid):

            logger.warning(
                "%d images do not exist.",
                len(invalid)
            )

        else:

            logger.info(
                "Image paths verified."
            )

    def generate(self):

        logger.info(
            "Generating metadata for %s",
            self.dataset_name,
        )

        metadata = self.build_metadata()

        logger.info(
            "%d rows generated.",
            len(metadata)
        )

        return metadata