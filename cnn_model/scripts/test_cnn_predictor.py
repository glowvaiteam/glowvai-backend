import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from src.predictors.cnn_predictor import CNNPredictor

predictor = CNNPredictor()

result = predictor.predict(
    "sample.jpg"
)

print()

print("=" * 60)
print("CNN PREDICTIONS")
print("=" * 60)

for k, v in result.items():
    print(k, ":", v)