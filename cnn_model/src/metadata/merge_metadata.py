from pathlib import Path

import pandas as pd


METADATA_DIR = Path("datasets/metadata")

OUTPUT_FILE = METADATA_DIR / "master_metadata.csv"


CSV_FILES = [

    "scut_metadata.csv",

    "celeba_metadata.csv",

    "fitzpatrick_metadata.csv",

    "acne_metadata.csv",

    "ffhq_metadata.csv",

    "facial_skin_metadata.csv",

    "utkface_metadata.csv",

    "face_detection_metadata.csv",

]


def merge_metadata():

    dataframes = []

    print()

    print("=" * 70)

    print("Merging Metadata")

    print("=" * 70)

    print()

    for file in CSV_FILES:

        path = METADATA_DIR / file

        print(f"Loading {file}")

        df = pd.read_csv(
            path,
            low_memory=False,
        )

        dataframes.append(df)

    master = pd.concat(

        dataframes,

        ignore_index=True,

        sort=False,

    )

    master.to_csv(

        OUTPUT_FILE,

        index=False,

    )

    print()

    print("=" * 70)

    print("MASTER METADATA CREATED")

    print("=" * 70)

    print()

    print(f"Rows : {len(master)}")

    print(f"Columns : {len(master.columns)}")

    print()

    print(f"Saved : {OUTPUT_FILE}")


if __name__ == "__main__":

    merge_metadata()