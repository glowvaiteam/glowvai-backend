import math

import torch


class Evaluator:

    def __init__(
        self,
        model,
        device,
    ):

        self.model = model
        self.device = device

    def evaluate(
        self,
        loader,
        task,
    ):

        self.model.eval()

        predictions = []
        labels = []

        with torch.no_grad():

            for batch in loader:

                images = batch["image"].to(
                    self.device
                )

                outputs = self.model(images)

                # -----------------------
                # Regression /
                # Classification
                # -----------------------

                if "label" in batch:

                    target = batch["label"]

                else:

                    target = batch["labels"]

                predictions.append(
                    outputs.cpu()
                )

                labels.append(
                    target.cpu()
                )

        predictions = torch.cat(
            predictions
        )

        labels = torch.cat(
            labels
        )

        metrics = self.compute_metrics(

            predictions,

            labels,

            task,

        )

        return {

            "predictions": predictions,

            "labels": labels,

            "metrics": metrics,

        }

    def compute_metrics(

        self,

        predictions,

        labels,

        task,

    ):

        # --------------------------
        # Regression
        # --------------------------

        if task in [

            "portrait_score",

            "face_quality",

            "age",

        ]:

            predictions = predictions.squeeze()

            labels = labels.float()

            mae = (

                predictions - labels

            ).abs().mean().item()

            rmse = math.sqrt(

                (

                    (

                        predictions -

                        labels

                    ) ** 2

                ).mean().item()

            )

            return {

                "MAE": round(mae, 4),

                "RMSE": round(rmse, 4),

            }

        # --------------------------
        # Classification
        # --------------------------

        elif task in [

            "acne",

            "skin_tone",

            "gender",

        ]:

            predicted = predictions.argmax(

                dim=1

            )

            accuracy = (

                predicted == labels

            ).float().mean().item()

            return {

                "Accuracy":

                round(

                    accuracy * 100,

                    2

                )

            }

        # --------------------------
        # Multi-label
        # --------------------------

        elif task == "facial_attributes":

            predicted = (

                torch.sigmoid(

                    predictions

                ) > 0.5

            ).float()

            accuracy = (

                predicted == labels

            ).float().mean().item()

            return {

                "Accuracy":

                round(

                    accuracy * 100,

                    2

                )

            }

        else:

            raise ValueError(

                f"Unknown task: {task}"

            )