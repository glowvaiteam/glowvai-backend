from pathlib import Path

import pandas as pd


class MasterMetadataCleaner:

    def __init__(self, metadata_path: Path):

        self.metadata_path = metadata_path

        self.df = pd.read_csv(
            metadata_path,
            low_memory=False,
        )

    def remove_invalid_paths(self):

        print()

        print("Removing invalid image paths...")

        before = len(self.df)

        self.df = self.df[
            self.df["image_path"].apply(
                lambda x: Path(str(x)).exists()
            )
        ]

        after = len(self.df)

        print(f"Removed {before-after} rows")

    def remove_duplicates(self):

        print()

        print("Removing duplicate rows...")

        before = len(self.df)

        self.df = self.df.drop_duplicates()

        after = len(self.df)

        print(f"Removed {before-after} rows")

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

        print("=" * 60)

        print("MASTER METADATA SAVED")

        print("=" * 60)

        print()

        print(f"Rows : {len(self.df)}")

        print(f"Saved : {output}")

    def run(self):

        self.remove_invalid_paths()

        self.remove_duplicates()

        self.save()