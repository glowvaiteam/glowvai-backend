from .cnn_model import SkinCNN


def create_model(task):

    configs = {

        "portrait_score":
        {
            "type": "regression",
            "classes": 1,
        },

        "acne":
        {
            "type": "classification",
            "classes": 4,
        },

        "skin_tone":
        {
            "type": "classification",
            "classes": 6,
        },

        "gender":
        {
            "type": "classification",
            "classes": 2,
        },

        "face_quality":
        {
            "type": "regression",
            "classes": 1,
        },

        "facial_attributes":
        {
            "type": "classification",
            "classes": 8,
        },

        "age":
        {
            "type": "regression",
            "classes": 1
        }

    }

    if task not in configs:

        raise ValueError(
            f"Unknown task: {task}"
        )

    config = configs[task]

    return SkinCNN(

        task_type=config["type"],

        output_classes=config["classes"],

    )