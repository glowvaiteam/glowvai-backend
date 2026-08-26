import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from src.inference.predictor import CNNPredictor


predictor = CNNPredictor()

results = predictor.predict(

    "datasets/raw/scut_fbp5500/images/AF1.jpg"

)

print()

print("=" * 60)
print("CNN PREDICTION")
print("=" * 60)

for key, value in results.items():

    print(f"{key}: {value}")

print()