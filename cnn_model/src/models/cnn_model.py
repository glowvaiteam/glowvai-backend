import torch.nn as nn

from .backbone import CNNBackbone
from .heads import (
    RegressionHead,
    ClassificationHead,
)


class SkinCNN(nn.Module):

    def __init__(
        self,
        task_type,
        output_classes=1,
        pretrained=True,
    ):

        super().__init__()


        self.backbone = CNNBackbone(
            pretrained=pretrained,
            freeze=True 
        )


        if task_type == "regression":

            self.head = RegressionHead(
                2048,
                output_classes
            )


        elif task_type == "classification":

            self.head = ClassificationHead(
                2048,
                output_classes
            )


        else:

            raise ValueError(
                "Invalid task type"
            )


    def forward(self,x):

        features = self.backbone(x)

        output = self.head(
            features
        )

        return output