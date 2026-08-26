import sys
from pathlib import Path


# Add project root
sys.path.append(
    str(Path(__file__).resolve().parents[1])
)


from src.ml.pipeline import SkinAnalysisPipeline
from src.ml.predictor import CNNPredictor



def main():


    print("=" * 60)
    print("INITIALIZING CNN PREDICTOR")
    print("=" * 60)


    predictor = CNNPredictor()



    pipeline = SkinAnalysisPipeline(
        predictor
    )



    result = pipeline.analyze(

        "test_images/sample.jpg"

    )



    print()

    print("=" * 60)
    print("FINAL PIPELINE OUTPUT")
    print("=" * 60)



    print()

    print("RAW PREDICTIONS")
    print(
        result["raw_predictions"]
    )


    print()

    print("ANALYSIS")

    print(
        result["analysis"]
    )


    print()

    print("REPORT")

    print(
        result["report"]
    )



if __name__ == "__main__":

    main()