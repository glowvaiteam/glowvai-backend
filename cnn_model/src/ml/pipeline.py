from src.ml.output_interpreter import OutputInterpreter
from src.ml.report_generator import SkinReportGenerator


class SkinAnalysisPipeline:


    def __init__(
        self,
        predictor
    ):

        self.predictor = predictor

        self.interpreter = OutputInterpreter()

        self.report_generator = SkinReportGenerator()



    def analyze(
        self,
        image_path
    ):

        # Step 1
        # Run CNN models

        raw_predictions = self.predictor.predict(
            image_path
        )


        # Step 2
        # Convert numbers to meaning

        interpreted = self.interpreter.interpret(
            raw_predictions
        )


        # Step 3
        # Generate report

        report = self.report_generator.generate(
            interpreted
        )


        return {

            "raw_predictions":
            raw_predictions,


            "analysis":
            interpreted,


            "report":
            report

        }