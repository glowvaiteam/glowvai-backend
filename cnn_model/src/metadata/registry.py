from pathlib import Path
from typing import Dict, Type

from src.metadata.base import BaseMetadataGenerator


class MetadataRegistry:
    """
    Registry for all metadata generators.
    """

    def __init__(self):

        self.generators: Dict[str, Type[BaseMetadataGenerator]] = {}

    def register(
        self,
        dataset_name: str,
        generator_class: Type[BaseMetadataGenerator],
    ):

        if dataset_name in self.generators:

            raise ValueError(
                f"{dataset_name} already registered."
            )

        self.generators[dataset_name] = generator_class

    def unregister(
        self,
        dataset_name: str,
    ):

        if dataset_name in self.generators:

            del self.generators[dataset_name]

    def list_generators(self):

        return list(self.generators.keys())

    def get(
        self,
        dataset_name: str,
    ):

        return self.generators.get(dataset_name)

    def generate_all(
        self,
        dataset_configs: dict,
        output_dir: Path,
    ):

        results = {}

        for dataset_name, generator_class in self.generators.items():

            print("\n" + "=" * 70)
            print(f"Generating metadata : {dataset_name}")
            print("=" * 70)

            generator = generator_class(

                dataset_name=dataset_name,

                dataset_dir=Path(
                    dataset_configs[dataset_name]
                ),

                output_dir=output_dir,

            )

            dataframe = generator.generate()

            generator.summary(dataframe)

            generator.save(
                dataframe,
                f"{dataset_name}_metadata.csv",
            )

            results[dataset_name] = dataframe

        return results