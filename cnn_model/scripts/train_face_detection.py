import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

import torch

from torch.utils.data import DataLoader
from torchvision import transforms

from src.datasets.face_detection_dataset import FaceDetectionDataset
from src.datasets.collate import detection_collate
from src.models.face_detection_model import create_face_detection_model
from src.training.detection_trainer import DetectionTrainer


def main():

    device = (
        "cuda"
        if torch.cuda.is_available()
        else "cpu"
    )

    checkpoint_dir = (
        Path("checkpoints")
        / "face_detection"
    )

    checkpoint_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    transform = transforms.Compose([

        transforms.Resize(
            (640, 640)
        ),

        transforms.ToTensor(),

    ])

    dataset = FaceDetectionDataset(

        "datasets/metadata/face_detection_metadata.csv",

        transform,

    )

    loader = DataLoader(

        dataset,

        batch_size=2,

        shuffle=True,

        num_workers=0,

        collate_fn=detection_collate,

    )

    model = create_face_detection_model()

    model = model.to(device)

    optimizer = torch.optim.SGD(

        model.parameters(),

        lr=0.005,

        momentum=0.9,

        weight_decay=0.0005,

    )

    trainer = DetectionTrainer(

        model,

        optimizer,

        device,

    )

    print()

    print("=" * 60)
    print("FACE DETECTION MODEL TRAINING")
    print("=" * 60)

    print(
        "Samples:",
        len(dataset)
    )

    print()

    epochs = 10

    for epoch in range(epochs):

        loss = trainer.train_epoch(
            loader
        )

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
        "face_detection_model.pth"

    )

    print()

    print("=" * 60)
    print("TRAINING COMPLETED")
    print("=" * 60)

    print()

    print(
        "Model Saved :",
        checkpoint_dir /
        "face_detection_model.pth"
    )


if __name__ == "__main__":

    main()