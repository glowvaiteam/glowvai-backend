import sys
from pathlib import Path


sys.path.append(
    str(Path(__file__).resolve().parents[1])
)


from src.ml.report_generator import SkinReportGenerator



prediction = {

    "skin_tone":"Light",

    "estimated_age":38.1,

    "face_quality":3.36,

    "acne_level":"No Acne",

    "facial_features":[

        "arched_eyebrows",
        "narrow_eyes",
        "big_lips",
        "big_nose",
        "pointy_nose",
        "high_cheekbones",
        "oval_face"

    ]

}



generator = SkinReportGenerator()


report = generator.generate(
    prediction
)


print("="*60)

print("AI SKIN REPORT")

print("="*60)


for key,value in report.items():

    print()

    print(key)

    print(value)