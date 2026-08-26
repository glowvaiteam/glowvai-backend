def detection_collate(batch):

    images = []

    targets = []

    for sample in batch:

        images.append(
            sample["image"]
        )

        targets.append(
            sample["target"]
        )

    return images, targets