from pathlib import Path

import pandas as pd


SPLIT_FILE = Path(
    "datasets/metadata/master_metadata_split.csv"
)


def main():

    df = pd.read_csv(
        SPLIT_FILE,
        low_memory=False,
    )

    print()

    print("=" * 60)
    print("DATASET SPLIT REPORT")
    print("=" * 60)

    print()

    print("Total Images")
    print(len(df))

    print()

    print("Split Counts")

    print(
        df["split"]
        .value_counts()
    )

    print()

    print("Split Percentages")

    print(
        (
            df["split"]
            .value_counts(normalize=True)
            * 100
        ).round(2)
    )

    print()

    print("=" * 60)
    print("Dataset Distribution")
    print("=" * 60)

    print()

    distribution = pd.crosstab(

        df["dataset_name"],

        df["split"]

    )

    print(distribution)

    print()

    duplicates = (

        df

        .duplicated(

            subset=[

                "dataset_name",

                "image_id",

            ]

        )

        .sum()

    )

    print(
        "Duplicate Dataset/Image IDs:",
        duplicates,
    )

    print()

    overlap = (

        df.groupby(

            [

                "dataset_name",

                "image_id",

            ]

        )["split"]

        .nunique()

        .gt(1)

        .sum()

    )

    print(
        "Images Appearing In Multiple Splits:",
        overlap,
    )


if __name__ == "__main__":

    main()