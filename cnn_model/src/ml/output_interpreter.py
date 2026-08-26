class OutputInterpreter:


    def interpret(self, predictions):

        result = {}


        # -------------------------
        # Portrait score
        # -------------------------

        score = predictions["portrait_score"]

        result["portrait_score"] = round(
            float(score),
            2
        )


        # -------------------------
        # Acne
        # -------------------------

        acne_classes = {

            0: "No Acne",
            1: "Mild Acne",
            2: "Moderate Acne",
            3: "Severe Acne"

        }

        result["acne_level"] = acne_classes.get(
            predictions["acne"],
            "Unknown"
        )


        # -------------------------
        # Skin Tone
        # -------------------------

        skin_tones = {

            1: "Very Light",
            2: "Light",
            3: "Medium",
            4: "Tan",
            5: "Brown",
            6: "Dark"

        }


        result["skin_tone"] = skin_tones.get(
            predictions["skin_tone"],
            "Unknown"
        )


        # -------------------------
        # Gender
        # -------------------------

        genders = {

            0:"Male",
            1:"Female"

        }


        result["gender"] = genders.get(
            predictions["gender"],
            "Unknown"
        )


        # -------------------------
        # Age
        # -------------------------

        result["estimated_age"] = round(
            float(predictions["age"]),
            1
        )


        # -------------------------
        # Face Quality
        # -------------------------

        quality = predictions["face_quality"]

        result["face_quality"] = round(
            float(quality),
            2
        )


        # -------------------------
        # Facial attributes
        # -------------------------

        attributes = [

            "arched_eyebrows",
            "bushy_eyebrows",
            "narrow_eyes",
            "big_lips",
            "big_nose",
            "pointy_nose",
            "high_cheekbones",
            "oval_face"

        ]


        detected = []


        for name,value in zip(
            attributes,
            predictions["facial_attributes"]
        ):

            if value == 1:
                detected.append(name)


        result["facial_features"] = detected


        return result