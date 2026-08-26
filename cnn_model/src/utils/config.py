from pathlib import Path
import yaml


class ConfigLoader:

    def __init__(self, project_root: Path):

        self.project_root = project_root

        self.config_dir = project_root / "configs"

    def load_dataset_config(self):

        file = self.config_dir / "datasets.yaml"

        if not file.exists():
            raise FileNotFoundError(file)

        with open(file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)