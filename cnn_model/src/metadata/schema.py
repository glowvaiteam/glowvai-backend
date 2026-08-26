"""
Unified metadata schema used by all datasets.
"""

METADATA_COLUMNS = [

    # Image Information
    "image_id",
    "image_path",
    "dataset_name",
    "split",

    # Face Score
    "portrait_score",

    # Skin Analysis
    "skin_tone",
    "skin_type",
    "acne_severity",
    "dark_spots",
    "skin_clarity",

    # Face Features
    "eyes",
    "eyebrows",
    "nose",
    "lips",
    "jawline",
    "cheekbones",

    # Demographics
    "age",
    "gender",
    "ethnicity",

    # Detection
    "bbox",

    # Future Segmentation
    "mask_path"

]

DEFAULT_VALUES = {

    "portrait_score": None,

    "skin_tone": None,

    "skin_type": None,

    "acne_severity": None,

    "dark_spots": None,

    "skin_clarity": None,

    "eyes": None,

    "eyebrows": None,

    "nose": None,

    "lips": None,

    "jawline": None,

    "cheekbones": None,

    "age": None,

    "gender": None,

    "ethnicity": None,

    "bbox": None,

    "mask_path": None,

    "split": "unassigned"

}