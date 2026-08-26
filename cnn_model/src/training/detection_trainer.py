import torch


class DetectionTrainer:

    def __init__(
        self,
        model,
        optimizer,
        device,
    ):

        self.model = model

        self.optimizer = optimizer

        self.device = device

    def train_epoch(
        self,
        loader,
    ):

        self.model.train()

        total_loss = 0.0

        for images, targets in loader:

            images = [

                image.to(self.device)

                for image in images

            ]

            targets = [

                {

                    k: v.to(self.device)

                    for k, v in target.items()

                }

                for target in targets

            ]

            loss_dict = self.model(

                images,

                targets,

            )

            loss = sum(

                loss_dict.values()

            )

            self.optimizer.zero_grad()

            loss.backward()

            self.optimizer.step()

            total_loss += loss.item()

        return total_loss / len(loader)