from pathlib import Path

from src.utils.config import ConfigLoader

from .generators.scut_generator import SCUTMetadataGenerator
from .generators.celeba_generator import CelebAMetadataGenerator


class MetadataManager:
    """
    Central manager responsible for generating metadata
    for all enabled datasets.
    """

    def __init__(self, project_root: Path):

        self.project_root = project_root

        self.config = ConfigLoader(
            project_root
        ).load_dataset_config()

        self.metadata_dir = (
            project_root /
            "datasets" /
            "metadata"
        )

        self.generator_registry = {
            "SCUTMetadataGenerator": SCUTMetadataGenerator,
            "CelebAMetadataGenerator": CelebAMetadataGenerator,
        }

    def get_generators(self):

        generators = []

        datasets = self.config["datasets"]

        for dataset_name, dataset_cfg in datasets.items():

            if not dataset_cfg["enabled"]:
                continue

            generator_name = dataset_cfg["generator"]

            generator_class = self.generator_registry[
                generator_name
            ]

            processed_dir = (
                self.project_root /
                dataset_cfg["processed_dir"]
            )

            generators.append(
                generator_class(
                    processed_dataset_dir=processed_dir,
                    metadata_output_dir=self.metadata_dir,
                )
            )

        return generators

    def run(self):

        print()

        print("=" * 70)
        print("GlowVAI Metadata Generation")
        print("=" * 70)

        for generator in self.get_generators():

            print()

            print(f"Dataset : {generator.dataset_name}")

            print("-" * 70)

            generator.run()

        print()

        print("=" * 70)
        print("Metadata Generation Completed")
        print("=" * 70)