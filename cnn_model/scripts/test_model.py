import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)


import torch

from src.models.model_factory import create_model



def main():


    model = create_model(
        "portrait_score"
    )


    x = torch.randn(
        4,
        3,
        224,
        224
    )


    output = model(x)


    print()

    print("="*60)
    print("MODEL TEST")
    print("="*60)

    print()

    print(
        "Input:",
        x.shape
    )

    print()

    print(
        "Output:",
        output.shape
    )


if __name__=="__main__":

    main()