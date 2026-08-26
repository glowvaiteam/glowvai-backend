from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent

RAW_DIR = PROJECT_ROOT / "datasets" / "raw" / "celeba"
OUTPUT_DIR = PROJECT_ROOT / "datasets" / "processed" / "celeba"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ATTRIBUTES = [
    "Arched_Eyebrows",
    "Bushy_Eyebrows",
    "Narrow_Eyes",
    "Big_Lips",
    "Big_Nose",
    "Pointy_Nose",
    "High_Cheekbones",
    "Oval_Face"
]

# Read attribute file
df = pd.read_csv(
    RAW_DIR / "list_attr_celeba.txt",
    sep=r"\s+",
    skiprows=1
)

df = df.reset_index().rename(columns={"index": "filename"})

# Keep only required columns
selected = df[["filename"] + ATTRIBUTES]

# Convert -1/1 → 0/1
for col in ATTRIBUTES:
    selected[col] = selected[col].replace({-1: 0, 1: 1})

selected.to_csv(
    OUTPUT_DIR / "celeba_labels.csv",
    index=False
)

print("=" * 60)
print("CelebA labels processed successfully")
print("=" * 60)
print(selected.head())