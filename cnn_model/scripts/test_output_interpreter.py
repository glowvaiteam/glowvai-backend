import sys
from pathlib import Path

# Add project root
sys.path.append(
    str(Path(__file__).resolve().parents[1])
)


from src.ml.output_interpreter import OutputInterpreter



predictions = {

    "portrait_score": 3.54,

    "acne": 0,

    "skin_tone": 2,

    "gender": 0,

    "face_quality": 3.36,

    "age": 38.08,

    "facial_attributes": [
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1
    ]

}



interpreter = OutputInterpreter()


result = interpreter.interpret(
    predictions
)


print("=" * 60)

print("FINAL CNN REPORT")

print("=" * 60)


for key, value in result.items():

    print(
        key,
        ":",
        value
    )