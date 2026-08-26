import torch.nn as nn

criterion = nn.BCEWithLogitsLoss()


def facial_attributes_loss(
    predictions,
    targets,
):

    return criterion(
        predictions,
        targets,
    )