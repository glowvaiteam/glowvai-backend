import torch.nn as nn
from torchvision import models


class CNNBackbone(nn.Module):
    """
    Shared CNN feature extractor
    """

    def __init__(
        self,
        pretrained=True,
        freeze=True,
    ):

        super().__init__()

        model = models.resnet50(
            weights=(
                models.ResNet50_Weights.DEFAULT
                if pretrained
                else None
            )
        )


        self.features = nn.Sequential(
            *list(model.children())[:-1]
        )


        # Freeze ResNet50 feature extractor
        if freeze:

            for param in self.features.parameters():

                param.requires_grad = False


        self.output_features = 2048


    def forward(self, x):

        x = self.features(x)

        x = x.view(
            x.size(0),
            -1
        )

        return x