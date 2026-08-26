from abc import ABC, abstractmethod
from pathlib import Path
import pandas as pd
from src.metadata.schema import (
    METADATA_COLUMNS,
    DEFAULT_VALUES,
)

class BaseMetadataGenerator(ABC):
    """
    Base class for all dataset metadata generators.
    """

    def __init__(
        self,
        dataset_name: str,
        dataset_dir: Path,
        output_dir: Path,
    ):

        self.dataset_name = dataset_name

        self.dataset_dir = Path(dataset_dir)

        self.output_dir = Path(output_dir)

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    @abstractmethod
    def generate(self) -> pd.DataFrame:
        """
        Generate metadata dataframe.
        """
        pass

    def save(
        self,
        dataframe: pd.DataFrame,
        filename: str,
    ) -> Path:

        output_path = self.output_dir / filename

        dataframe.to_csv(
            output_path,
            index=False,
        )

        print(
            f"[{self.dataset_name}] Metadata saved -> {output_path}"
        )

        return output_path

    def validate_columns(
        self,
        dataframe: pd.DataFrame,
        required_columns: list,
    ):

        missing = []

        for column in required_columns:

            if column not in dataframe.columns:

                missing.append(column)

        if missing:

            raise ValueError(
                f"Missing required columns: {missing}"
            )

    def image_exists(
        self,
        image_path: Path,
    ) -> bool:

        return image_path.exists()

    def total_images(
        self,
        image_directory: Path,
    ):

        extensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".bmp",
            ".webp",
        ]

        count = 0

        for ext in extensions:

            count += len(
                list(image_directory.rglob(f"*{ext}"))
            )

        return count

    def summary(
        self,
        dataframe: pd.DataFrame,
    ):

        print()

        print("=" * 60)

        print(self.dataset_name)

        print("=" * 60)

        print("Rows :", len(dataframe))

        print("Columns :", len(dataframe.columns))

        print("=" * 60)

    def normalize_dataframe(
    self,
    dataframe,
):

    for column in METADATA_COLUMNS:

        if column not in dataframe.columns:

            dataframe[column] = DEFAULT_VALUES.get(
                column,
                None,
            )

    dataframe = dataframe[METADATA_COLUMNS]

    return dataframe