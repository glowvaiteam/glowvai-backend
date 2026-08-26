import sys
from pathlib import Path

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)


import torch
import matplotlib.pyplot as plt

from torch.utils.data import DataLoader
from torchvision import transforms

from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

from src.models.model_factory import create_model

from src.datasets.acne_dataset import AcneDataset
from src.datasets.skintone_dataset import SkinToneDataset
from src.datasets.gender_dataset import GenderDataset



DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)



transform = transforms.Compose([

    transforms.Resize(
        (224,224)
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



CONFIGS = {


"acne": {

    "task":"acne",

    "checkpoint":
    "checkpoints/acne/acne_model.pth",

    "dataset":AcneDataset,

    "metadata":
    "datasets/metadata/acne_metadata.csv",

    "classes":
    [
        "No Acne",
        "Mild",
        "Moderate",
        "Severe"
    ]

},



"skin_tone": {

    "task":"skin_tone",

    "checkpoint":
    "checkpoints/skintone/skintone_model.pth",

    "dataset":SkinToneDataset,

    "metadata":
    "datasets/metadata/fitzpatrick_metadata.csv",

    "classes":
    [
        "Type1",
        "Type2",
        "Type3",
        "Type4",
        "Type5",
        "Type6"
    ]

},



"gender": {

    "task":"gender",

    "checkpoint":
    "checkpoints/gender/gender_model.pth",

    "dataset":GenderDataset,

    "metadata":
    "datasets/metadata/utkface_metadata.csv",

    "classes":
    [
        "Male",
        "Female"
    ]

}

}



def generate(
    name,
    config
):


    print()
    print("="*60)
    print(name.upper())
    print("="*60)



    dataset = config["dataset"](

        config["metadata"],

        transform

    )


    loader = DataLoader(

        dataset,

        batch_size=16,

        shuffle=False,

        num_workers=0

    )



    model = create_model(
        config["task"]
    )


    checkpoint = torch.load(

        config["checkpoint"],

        map_location=DEVICE

    )


    model.load_state_dict(

        checkpoint["model_state_dict"]

    )


    model.to(
        DEVICE
    )


    model.eval()



    predictions = []

    labels = []



    with torch.no_grad():

        for batch in loader:


            images = batch["image"].to(
                DEVICE
            )


            output = model(
                images
            )


            pred = torch.argmax(

                output,

                dim=1

            )


            predictions.extend(

                pred.cpu().numpy()

            )


            labels.extend(

                batch["label"].numpy()

            )



    cm = confusion_matrix(

        labels,

        predictions

    )



    disp = ConfusionMatrixDisplay(

        confusion_matrix=cm,

        display_labels=config["classes"]

    )


    disp.plot()

    plt.title(
        name.upper()
    )


    Path(
        "reports"
    ).mkdir(
        exist_ok=True
    )


    plt.savefig(

        f"reports/{name}_confusion_matrix.png",

        bbox_inches="tight"

    )


    plt.close()



    print(
        "Saved:",
        f"reports/{name}_confusion_matrix.png"
    )





def main():


    for name, config in CONFIGS.items():

        generate(
            name,
            config
        )



if __name__ == "__main__":

    main()