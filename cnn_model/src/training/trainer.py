import torch


class Trainer:

    def __init__(
        self,
        model,
        optimizer,
        criterion,
        device,
    ):

        self.model = model
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device

    def train_epoch(
        self,
        loader,
    ):

        self.model.train()

        total_loss = 0.0

        for batch in loader:

            images = batch["image"].to(
                self.device
            )

            # ------------------------------------------
            # Portrait (Regression)
            # ------------------------------------------

            if "label" in batch:

                labels = batch["label"].to(
                    self.device
                )

                # Regression
                if (
                    predictions_classes := getattr(
                        self.model.head,
                        "output_classes",
                        None
                    )
                ) == 1:

                    labels = (
                        labels.float()
                        .unsqueeze(1)
                    )

                # Classification
                else:

                    labels = labels.long()

            # ------------------------------------------
            # Facial Attributes
            # ------------------------------------------

            elif "labels" in batch:

                labels = batch["labels"].float().to(
                    self.device
                )

            else:

                raise ValueError(
                    "No labels found in batch."
                )

            predictions = self.model(
                images
            )

            loss = self.criterion(

                predictions,

                labels

            )

            self.optimizer.zero_grad()

            loss.backward()

            self.optimizer.step()

            total_loss += loss.item()

        return (

            total_loss /

            len(loader)

        )