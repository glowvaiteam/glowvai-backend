from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


METADATA = Path(
    "datasets/metadata/master_metadata_clean.csv"
)

OUTPUT = Path(
    "datasets/metadata/master_metadata_split.csv"
)


def main():

    df = pd.read_csv(
        METADATA,
        low_memory=False,
    )

    train_df, temp_df = train_test_split(

        df,

        test_size=0.30,

        random_state=42,

        shuffle=True,

    )

    valid_df, test_df = train_test_split(

        temp_df,

        test_size=0.50,

        random_state=42,

        shuffle=True,

    )

    train_df["split"] = "train"

    valid_df["split"] = "validation"

    test_df["split"] = "test"

    final_df = pd.concat(

        [

            train_df,

            valid_df,

            test_df,

        ],

        ignore_index=True,

    )

    final_df.to_csv(

        OUTPUT,

        index=False,

    )

    print()

    print("=" * 60)

    print("DATASET SPLIT CREATED")

    print("=" * 60)

    print()

    print(final_df["split"].value_counts())

    print()

    print(f"Saved : {OUTPUT}")


if __name__ == "__main__":

    main()