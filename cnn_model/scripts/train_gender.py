import sys

from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import torch

from torch.utils.data import DataLoader

from torchvision import transforms

from src.datasets.gender_dataset import GenderDataset

from src.models.model_factory import create_model

from src.training.trainer import Trainer

from src.training.losses import gender_loss


def main():

    device = (
        "cuda"
        if torch.cuda.is_available()
        else "cpu"
    )

    checkpoint_dir = (
        Path("checkpoints")
        / "gender"
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

    dataset = GenderDataset(

        "datasets/metadata/utkface_metadata.csv",

        transform

    )

    loader = DataLoader(

        dataset,

        batch_size=8,

        shuffle=True,

        num_workers=0

    )

    model = create_model(
        "gender"
    )

    model = model.to(device)

    optimizer = torch.optim.AdamW(

        model.parameters(),

        lr=0.0001

    )

    trainer = Trainer(

        model,

        optimizer,

        gender_loss,

        device

    )

    print()

    print("="*60)

    print("GENDER MODEL TRAINING")

    print("="*60)

    print()

    print(
        "Samples:",
        len(dataset)
    )

    print()

    NUM_EPOCHS = 10

    for epoch in range(NUM_EPOCHS):

        loss = trainer.train_epoch(
            loader
        )

        print(

            f"Epoch {epoch+1}/{NUM_EPOCHS} "
            f"Loss: {loss:.6f}"

        )

    checkpoint = {

        "epoch":NUM_EPOCHS,

        "loss":loss,

        "model_state_dict":model.state_dict(),

        "optimizer_state_dict":optimizer.state_dict(),

    }

    torch.save(

        checkpoint,

        checkpoint_dir /
        "gender_model.pth"

    )

    print()

    print("="*60)

    print("TRAINING COMPLETED")

    print("="*60)

    print()

    print(

        "Model Saved :",

        checkpoint_dir /
        "gender_model.pth"

    )

    print()


if __name__=="__main__":

    main()