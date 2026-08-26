from pathlib import Path

import torch

from src.models.model_factory import create_model


DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


def load_model(task, checkpoint):

    model = create_model(task)

    ckpt = torch.load(
        checkpoint,
        map_location=DEVICE,
    )

    model.load_state_dict(
        ckpt["model_state_dict"]
    )

    model.eval()

    model.to(DEVICE)

    return model