import torch
from PIL import Image
from torchvision import transforms

from src.models.model_factory import create_model


class CNNPredictor:


    def __init__(self):

        self.device = (
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )


        self.transform = transforms.Compose([

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


        self.models = {}


        self.load_models()



    def load_models(self):

        configs = {


            "portrait_score":(
                "portrait_score",
                "checkpoints/portrait/portrait_model.pth"
            ),


            "acne":(
                "acne",
                "checkpoints/acne/acne_model.pth"
            ),


            "skin_tone":(
                "skin_tone",
                "checkpoints/skintone/skintone_model.pth"
            ),


            "gender":(
                "gender",
                "checkpoints/gender/gender_model.pth"
            ),


            "face_quality":(
                "face_quality",
                "checkpoints/face_quality/face_quality_model.pth"
            ),


            "age":(
                "age",
                "checkpoints/age/age_model.pth"
            ),


            "facial_attributes":(
                "facial_attributes",
                "checkpoints/facial_attributes/facial_attributes_model.pth"
            )

        }



        for name, (task, checkpoint) in configs.items():


            model = create_model(task)

            data = torch.load(
                checkpoint,
                map_location=self.device
            )


            model.load_state_dict(
                data["model_state_dict"]
            )


            model.to(
                self.device
            )


            model.eval()


            self.models[name] = model



    def predict(
        self,
        image_path
    ):


        image = Image.open(
            image_path
        ).convert(
            "RGB"
        )


        image = self.transform(
            image
        )


        image = image.unsqueeze(
            0
        ).to(
            self.device
        )


        results = {}



        with torch.no_grad():


            for name, model in self.models.items():

                output = model(
                    image
                )


                if name in [

                    "acne",
                    "skin_tone",
                    "gender"

                ]:

                    prediction = torch.argmax(
                        output,
                        dim=1
                    ).item()



                elif name == "facial_attributes":


                    prediction = (

                        torch.sigmoid(output)
                        >
                        0.5

                    ).int().tolist()[0]



                else:

                    prediction = output.item()



                results[name] = prediction



        return results