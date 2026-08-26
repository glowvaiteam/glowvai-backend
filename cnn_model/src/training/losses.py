import torch.nn as nn

# --------------------------------------------------
# Portrait Score (Regression)
# --------------------------------------------------

portrait_loss = nn.MSELoss()

# --------------------------------------------------
# Acne Severity (4 Classes)
# --------------------------------------------------

acne_loss = nn.CrossEntropyLoss()

skin_tone_loss = nn.CrossEntropyLoss()

# --------------------------------------------------
# Facial Attributes (Multi-label)
# --------------------------------------------------

facial_attributes_loss = nn.BCEWithLogitsLoss()

# --------------------------------------------------
# Gender Classification
# --------------------------------------------------

gender_loss = nn.CrossEntropyLoss()