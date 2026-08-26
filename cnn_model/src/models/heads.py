import torch.nn as nn


class RegressionHead(nn.Module):
    """
    For continuous outputs

    Example:
    Portrait score
    """

    def __init__(
        self,
        input_features,
        output_dim=1
    ):

        super().__init__()

        self.output_classes = output_dim

        self.fc = nn.Sequential(

            nn.Linear(
                input_features,
                512
            ),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(
                512,
                output_dim
            )
        )


    def forward(self,x):

        return self.fc(x)



class ClassificationHead(nn.Module):
    """
    For classification outputs

    Example:
    Acne severity
    Skin tone
    """

    def __init__(
        self,
        input_features,
        classes
    ):

        super().__init__()

        self.output_classes = classes

        self.fc = nn.Sequential(

            nn.Linear(
                input_features,
                512
            ),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(
                512,
                classes
            )
        )


    def forward(self,x):

        return self.fc(x)