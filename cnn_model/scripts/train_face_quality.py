import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import torch

from torch.utils.data import DataLoader
from torchvision import transforms

from src.datasets.face_quality_dataset import FaceQualityDataset
from src.models.model_factory import create_model
from src.training.trainer import Trainer
from src.training.losses import portrait_loss


def main():

    device = (
        "cuda"
        if torch.cuda.is_available()
        else "cpu"
    )

    checkpoint_dir = (
        Path("checkpoints")
        / "face_quality"
    )

    checkpoint_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    transform = transforms.Compose([

        transforms.Resize((224,224)),

        transforms.ToTensor(),

        transforms.Normalize(

            mean=[0.485,0.456,0.406],

            std=[0.229,0.224,0.225]

        )

    ])

    dataset = FaceQualityDataset(

        "datasets/metadata/scut_metadata.csv",

        transform

    )

    loader = DataLoader(

        dataset,

        batch_size=32,

        shuffle=True,

        num_workers=0

    )

    model = create_model(
        "face_quality"
    )

    model = model.to(device)

    optimizer = torch.optim.AdamW(

        model.parameters(),

        lr=1e-4

    )

    trainer = Trainer(

        model,

        optimizer,

        portrait_loss,

        device

    )

    print()

    print("="*60)
    print("FACE QUALITY MODEL TRAINING")
    print("="*60)

    print("Samples:", len(dataset))
    print()

    epochs = 30

    for epoch in range(epochs):

        loss = trainer.train_epoch(loader)

        print(

            f"Epoch {epoch+1}/{epochs} "
            f"Loss: {loss:.6f}"

        )

    checkpoint = {

        "epoch": epochs,

        "loss": loss,

        "model_state_dict": model.state_dict(),

        "optimizer_state_dict": optimizer.state_dict(),

    }

    torch.save(

        checkpoint,

        checkpoint_dir /
        "face_quality_model.pth"

    )

    print()

    print("="*60)
    print("TRAINING COMPLETED")
    print("="*60)

    print()

    print(
        "Model Saved :",
        checkpoint_dir /
        "face_quality_model.pth"
    )

    print()


if __name__ == "__main__":

    main()