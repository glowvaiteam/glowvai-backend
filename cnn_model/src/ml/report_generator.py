class SkinReportGenerator:


    def generate(self, prediction):

        report = {}


        # -------------------------
        # Summary
        # -------------------------

        report["summary"] = {

            "skin_tone":
            prediction["skin_tone"],

            "skin_type":
            "Unknown",

            "age":
            prediction["estimated_age"],

            "face_quality":
            prediction["face_quality"]

        }


        # -------------------------
        # Issues
        # -------------------------

        issues = []


        if prediction["acne_level"] != "No Acne":

            issues.append(
                prediction["acne_level"]
            )


        if prediction["face_quality"] < 3:

            issues.append(
                "Low facial quality score"
            )


        report["detected_issues"] = issues



        # -------------------------
        # Positive features
        # -------------------------

        strengths = []


        if prediction["face_quality"] >= 3:

            strengths.append(
                "Good facial structure"
            )


        if len(
            prediction["facial_features"]
        ) > 4:

            strengths.append(
                "Strong facial feature profile"
            )


        report["strengths"] = strengths



        # -------------------------
        # Recommendations
        # -------------------------

        recommendations = []


        if prediction["acne_level"] == "No Acne":

            recommendations.append(
                "Maintain current skincare routine"
            )

        else:

            recommendations.append(
                "Use acne control ingredients like salicylic acid"
            )


        if prediction["skin_tone"] in [
            "Brown",
            "Dark"
        ]:

            recommendations.append(
                "Use SPF 50 sunscreen for pigmentation protection"
            )


        recommendations.append(
            "Keep skin hydrated and moisturized"
        )


        report["recommendations"] = recommendations



        return report