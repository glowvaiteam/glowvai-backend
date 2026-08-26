from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent

RAW_DIR = PROJECT_ROOT / "datasets" / "raw" / "scut_fbp5500"
OUTPUT_DIR = PROJECT_ROOT / "datasets" / "processed" / "scut_fbp5500"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ratings = pd.read_excel(RAW_DIR / "All_Ratings.xlsx")

summary = (
    ratings
    .groupby("Filename")
    .agg(
        portrait_score=("Rating", "mean"),
        std=("Rating", "std"),
        raters=("Rating", "count")
    )
    .reset_index()
)

summary["portrait_score_100"] = (
    (summary["portrait_score"] - 1) / 4 * 100
).round(2)

summary = summary.rename(columns={"Filename": "filename"})

summary.to_csv(
    OUTPUT_DIR / "portrait_labels.csv",
    index=False
)

print("=" * 60)
print("SCUT LABEL PROCESSING COMPLETED")
print("=" * 60)
print(summary.head())
print()
print(f"Saved to: {OUTPUT_DIR / 'portrait_labels.csv'}")