import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)


from src.ml.pipeline import SkinAnalysisPipeline
from src.ml.cnn_predictor import CNNPredictor


IMAGE_PATH = "test_images/sample.jpg"


def main():

    print("=" * 60)
    print("REAL IMAGE CNN TEST")
    print("=" * 60)


    predictor = CNNPredictor()


    pipeline = SkinAnalysisPipeline(
        predictor
    )


    result = pipeline.analyze(
        IMAGE_PATH
    )


    print()

    print("=" * 60)
    print("FINAL CNN REPORT")
    print("=" * 60)


    print()

    print(result["report"])



if __name__ == "__main__":

    main()