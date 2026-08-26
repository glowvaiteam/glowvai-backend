import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import torch

from torch.utils.data import DataLoader
from torchvision import transforms

from src.datasets.acne_dataset import AcneDataset
from src.models.model_factory import create_model
from src.training.trainer import Trainer
from src.training.losses import acne_loss


def main():

    device = (
        "cuda"
        if torch.cuda.is_available()
        else "cpu"
    )

    checkpoint_dir = (
        Path("checkpoints")
        / "acne"
    )

    checkpoint_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    transform = transforms.Compose([

        transforms.Resize(
            (224, 224)
        ),

        transforms.ToTensor(),

        transforms.Normalize(

            mean=[
                0.485,
                0.456,
                0.406
            ],

            std=[
                0.229,
                0.224,
                0.225
            ]

        )

    ])

    dataset = AcneDataset(

        "datasets/metadata/acne_metadata.csv",

        transform

    )

    loader = DataLoader(

        dataset,

        batch_size=32,

        shuffle=True,

        num_workers=0

    )

    model = create_model(
        "acne"
    )

    model = model.to(device)

    optimizer = torch.optim.AdamW(

        model.parameters(),

        lr=0.0001

    )

    trainer = Trainer(

        model,

        optimizer,

        acne_loss,

        device

    )

    print()

    print("=" * 60)
    print("ACNE MODEL TRAINING")
    print("=" * 60)

    print(
        "Samples:",
        len(dataset)
    )

    print()

    for epoch in range(30):

        loss = trainer.train_epoch(
            loader
        )

        print(

            f"Epoch {epoch+1}/30 "
            f"Loss: {loss:.8f}"

        )

    checkpoint = {

        "epoch": 30,

        "loss": loss,

        "model_state_dict": model.state_dict(),

        "optimizer_state_dict": optimizer.state_dict(),

    }

    torch.save(

        checkpoint,

        checkpoint_dir /
        "acne_model.pth"

    )

    print()

    print("=" * 60)
    print("TRAINING COMPLETED")
    print("=" * 60)

    print()

    print(
        "Model Saved :",
        checkpoint_dir /
        "acne_model.pth"
    )

    print()


if __name__ == "__main__":

    main()