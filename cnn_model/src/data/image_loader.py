from pathlib import Path

from PIL import Image


class ImageLoader:
    """
    Loads images from disk.
    """

    def __init__(self):

        pass

    def load(self, image_path):

        image_path = Path(image_path)

        if not image_path.exists():

            raise FileNotFoundError(image_path)

        image = Image.open(image_path)

        image = image.convert("RGB")

        return image