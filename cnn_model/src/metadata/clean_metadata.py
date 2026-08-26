from pathlib import Path

import pandas as pd


class MetadataCleaner:

    def __init__(self, metadata_path: Path):

        self.metadata_path = metadata_path

        self.df = pd.read_csv(
            metadata_path,
            low_memory=False,
        )

    def clean(self):

        print()

        print("=" * 60)
        print("Cleaning Metadata")
        print("=" * 60)

        initial_rows = len(self.df)

        # Remove exact duplicate rows
        self.df = self.df.drop_duplicates()

        # Remove invalid image paths
        self.df = self.df[
            self.df["image_path"]
            .fillna("")
            .apply(
                lambda x: Path(str(x)).exists()
            )
        ]

        final_rows = len(self.df)

        print()

        print(f"Initial Rows : {initial_rows}")
        print(f"Final Rows   : {final_rows}")
        print(f"Removed      : {initial_rows-final_rows}")

        return self.df

    def save(self):

        output = (
            self.metadata_path.parent /
            "master_metadata_clean.csv"
        )

        self.df.to_csv(
            output,
            index=False,
        )

        print()
        print(f"Saved : {output}")