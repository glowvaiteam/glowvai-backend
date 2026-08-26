import torchvision

from torchvision.models.detection import (
    fasterrcnn_resnet50_fpn,
)

from torchvision.models.detection.faster_rcnn import (
    FastRCNNPredictor,
)


def create_face_detection_model():

    model = fasterrcnn_resnet50_fpn(
        weights="DEFAULT"
    )

    in_features = (
        model.roi_heads.box_predictor.cls_score.in_features
    )

    model.roi_heads.box_predictor = FastRCNNPredictor(

        in_features,

        2,          # background + face

    )

    return model