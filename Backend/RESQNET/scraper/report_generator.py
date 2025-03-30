import os
import json
from typing import List, Dict, Any
import google.generativeai as genai
import datetime
from dotenv import load_dotenv
import logging
from .models import DisasterReport

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Configure Gemini API
genai.configure(api_key=API_KEY)

class ReportGeneratorAgent:
    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config={
                "temperature": 0.2,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
        )
        logger.info("Report Generator Agent initialized with Gemini 1.5 Pro model")

    def generate_report(self, best_data: List, disaster_type: str, location: str) -> None:
        """
        Generate a detailed disaster report and action plan based on the best data sets
        """
        try:
            # Prepare data for Gemini
            data_list = [
                {
                    "combined_text": data.combined_text,
                    "metadata": data.get_metadata()  # Use helper method
                } for data in best_data
            ]

            prompt = f"""
            You are a disaster management expert. Based on the following disaster data for a {disaster_type} in {location},
            generate a detailed report and action plan.

            The report should include:
            1. Executive summary of the situation
            2. Current status assessment
            3. Critical needs and priorities
            4. Detailed plan of action with:
               - Immediate response actions (0-48 hours)
               - Short-term response actions (3-7 days)
               - Medium-term recovery actions (1-4 weeks)
            5. Resource allocation recommendations
            6. Coordination instructions between different agencies
            7. Specific guidance for medical teams, food distribution, shelter management, and water/sanitation

            Also, extract a structured action plan as a JSON array, where each action item has:
            - "priority": "high/medium/low"
            - "timeframe": "immediate/short-term/medium-term"
            - "action": "description of the action"
            - "responsible": "agency or team responsible"
            - "resources_needed": ["list", "of", "resources"]
            - "success_criteria": "how to measure completion"

            Estimate the overall severity index (0-10 scale) based on the data.

            Data:
            {json.dumps(data_list, indent=2)}

            Return a JSON object with:
            - "detailed_report": The detailed report as a string
            - "action_plan": The structured action plan as a JSON array
            - "severity_index": The estimated severity index
            """

            response = self.model.generate_content(prompt)
            response_text = response.text
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1

            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                result = json.loads(json_str)
            else:
                raise ValueError("Could not extract JSON from model response")

            # Save to database
            report = DisasterReport(
                report_id=f"report_{disaster_type}_{location}_{int(datetime.datetime.now().timestamp())}",
                disaster_type=disaster_type,
                location=location,
                detailed_report=result["detailed_report"],
                severity_index=result["severity_index"]
            )
            report.set_action_plan(result["action_plan"])  # Use helper method
            report.save()

            logger.info(f"Successfully generated and saved disaster report for {disaster_type} in {location}")
            return result

        except Exception as e:
            logger.error(f"Error generating disaster report: {str(e)}")
            raise

# Test the report generator
if __name__ == "__main__":
    from .bert_trainer import train_bert_model
    best_data = train_bert_model("flood", "East District")
    agent = ReportGeneratorAgent()
    report = agent.generate_report(best_data, "flood", "East District")
    print(report)
