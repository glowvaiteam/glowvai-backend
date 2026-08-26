from pathlib import Path
from PIL import Image
from tqdm import tqdm

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASETS = [
    {
        "name": "scut_fbp5500",
        "input": PROJECT_ROOT / "datasets" / "raw" / "scut_fbp5500" / "Images",
        "output": PROJECT_ROOT / "datasets" / "processed" / "scut_fbp5500" / "images",
    },
    {
        "name": "celeba",
        "input": PROJECT_ROOT / "datasets" / "raw" / "celeba" / "img_align_celeba",
        "output": PROJECT_ROOT / "datasets" / "processed" / "celeba" / "images",
    },
]

TARGET_SIZE = (224, 224)

for dataset in DATASETS:

    dataset["output"].mkdir(parents=True, exist_ok=True)

    image_paths = list(dataset["input"].glob("*"))

    print(f"\nProcessing {dataset['name']}...")
    print(f"Images found: {len(image_paths)}")

    for image_path in tqdm(image_paths):

        try:
            with Image.open(image_path) as img:

                img = img.convert("RGB")
                img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

                output_path = dataset["output"] / image_path.name

                img.save(
                    output_path,
                    quality=95
                )

        except Exception as e:
            print(f"Failed: {image_path.name} -> {e}")

print("\nImage standardization completed.")