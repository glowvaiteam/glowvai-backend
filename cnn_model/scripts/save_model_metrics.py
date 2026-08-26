import json
from pathlib import Path


metrics = {

    "portrait": {

        "MAE":0.2421,
        "RMSE":0.3189

    },


    "acne": {

        "Accuracy":96.5

    },


    "skin_tone": {

        "Accuracy":53.77

    },


    "gender": {

        "Accuracy":85.13

    },


    "face_quality": {

        "MAE":0.2611,
        "RMSE":0.3344

    },


    "age": {

        "MAE":9.6858,
        "RMSE":12.9692

    }

}


output = Path(
    "reports/model_metrics.json"
)


output.parent.mkdir(
    exist_ok=True
)


with open(
    output,
    "w"
) as f:

    json.dump(
        metrics,
        f,
        indent=4
    )


print(
    "Saved:",
    output
)