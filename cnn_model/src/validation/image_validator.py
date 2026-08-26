from pathlib import Path
from PIL import Image, UnidentifiedImageError


class ImageValidator:
    """
    Validates image files referenced in metadata.

    Checks:
    - Image exists
    - Image can be opened
    - Image format is valid
    - Image dimensions are valid
    """

    SUPPORTED_FORMATS = {
        "JPEG",
        "PNG",
        "BMP",
        "WEBP"
    }

    MIN_WIDTH = 32
    MIN_HEIGHT = 32

    def validate(self, metadata):

        total_images = len(metadata)

        missing_images = 0
        corrupted_images = 0
        invalid_format = 0
        invalid_size = 0
        valid_images = 0

        missing_files = []
        corrupted_files = []

        for image_path in metadata["image_path"]:

            image_path = Path(image_path)

            # -------------------------
            # File exists
            # -------------------------
            if not image_path.exists():

                missing_images += 1
                missing_files.append(str(image_path))
                continue

            try:

                with Image.open(image_path) as img:

                    img.verify()

                with Image.open(image_path) as img:

                    width, height = img.size

                    if img.format not in self.SUPPORTED_FORMATS:

                        invalid_format += 1

                    if width < self.MIN_WIDTH or height < self.MIN_HEIGHT:

                        invalid_size += 1

                    valid_images += 1

            except (UnidentifiedImageError, OSError):

                corrupted_images += 1
                corrupted_files.append(str(image_path))

        report = {

            "total_images": total_images,

            "valid_images": valid_images,

            "missing_images": missing_images,

            "corrupted_images": corrupted_images,

            "invalid_format": invalid_format,

            "invalid_size": invalid_size,

            "missing_files": missing_files,

            "corrupted_files": corrupted_files

        }

        return report