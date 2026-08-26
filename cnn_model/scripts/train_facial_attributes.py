import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import torch

from torch.utils.data import DataLoader
from torchvision import transforms

from src.datasets.facial_attributes_dataset import FacialAttributesDataset
from src.models.model_factory import create_model
from src.training.trainer import Trainer
from src.training.facial_attributes_loss import facial_attributes_loss


def main():

    device = (
        "cuda"
        if torch.cuda.is_available()
        else "cpu"
    )

    # --------------------------------------------------
    # Checkpoint Directory
    # --------------------------------------------------

    checkpoint_dir = (
        Path("checkpoints")
        / "facial_attributes"
    )

    checkpoint_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------------------------
    # Dataset
    # --------------------------------------------------

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

    dataset = FacialAttributesDataset(

        "datasets/metadata/master_metadata.csv",

        transform

    )

    loader = DataLoader(

        dataset,

        batch_size=32,

        shuffle=True,

        num_workers=0

    )

    # --------------------------------------------------
    # Model
    # --------------------------------------------------

    model = create_model(
        "facial_attributes"
    )

    model = model.to(
        device
    )

    optimizer = torch.optim.AdamW(

        model.parameters(),

        lr=0.0001

    )

    trainer = Trainer(

        model,

        optimizer,

        facial_attributes_loss,

        device

    )

    

    print()

    print("=" * 60)
    print("FACIAL ATTRIBUTES MODEL TRAINING")
    print("=" * 60)

    print(
        "Samples:",
        len(dataset)
    )

    print()

    # --------------------------------------------------
    # Training
    # --------------------------------------------------

    for epoch in range(30):

        loss = trainer.train_epoch(
            loader
        )

        print(

            f"Epoch {epoch + 1}/30 "
            f"Loss: {loss:.4f}"

        )

        checkpoint = {

            "epoch": epoch + 1,

            "loss": loss,

            "model_state_dict":
                model.state_dict(),

            "optimizer_state_dict":
                optimizer.state_dict(),

        }

        # Save latest model

        torch.save(

            checkpoint,

            checkpoint_dir /
            "facial_attributes_model.pth"

        )

        

    print()

    print("=" * 60)
    print("TRAINING COMPLETED")
    print("=" * 60)

    print()

    

    print()

    print(
        f"Model Saved : {checkpoint_dir / 'facial_attributes_model.pth'}"
    )

    print()


if __name__ == "__main__":

    main()