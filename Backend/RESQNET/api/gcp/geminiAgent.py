import os
import json
from typing import Dict, List, Any
import google.generativeai as genai
from dotenv import load_dotenv
import logging

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

class GeminiAgent:
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
        logger.info("Gemini Agent initialized with Gemini 1.5 Pro model")

    def extract_relevant_info(self, disaster_data) -> Dict:
        """
        Extract relevant disaster information from the input data using Gemini API
        """
        try:
            # Convert disaster data to JSON for the prompt
            disaster_data_json = disaster_data.model_dump_json(indent=2)

            prompt = f"""
            You are a disaster response information extraction system.
            Given the following disaster-related data, extract only the relevant information for emergency response.

            First, identify the primary disaster type (e.g., flood, earthquake, cyclone, wildfire, landslide) from the data.
            Then, extract the following information:
            - Disaster type (e.g., "flood", "earthquake")
            - Affected districts/regions
            - Affected population estimates
            - Evacuation centers
            - Disaster-specific data (based on the disaster type):
              - For floods: rainfall levels, dam and river water levels, live precipitation data
              - For earthquakes: seismic activity (magnitude, depth, epicenter), aftershock predictions
              - For cyclones: wind speeds, atmospheric pressure, storm surge data
              - For wildfires: fire spread (area, containment percentage), air quality index (AQI)
              - For landslides: soil stability, slope analysis, recent rainfall
            - Most affected areas
            - Current relief operations
            - Active disaster incidents

            Return ONLY a valid JSON object with these fields:
            {{
                "disaster_type": "string",
                "affected_districts": ["list", "of", "districts"],
                "affected_population": integer,
                "evacuation_centers": [{"name": "string", "location": "string", "capacity": integer}],
                "disaster_specific_data": {{ "key": "value" }} (specific to the disaster type),
                "most_affected_areas": ["list", "of", "areas"],
                "relief_operations": [{"operation": "string", "status": "string", "resources": ["list"]}],
                "active_incidents": [{"incident_id": "string", "location": "string", "severity": "string"}]
            }}

            Do not include any explanation or text outside the JSON.

            Here is the data:
            {disaster_data_json}
            """

            response = self.model.generate_content(prompt)

            # Extract the JSON from the response
            response_text = response.text

            # Find JSON in the response (it might be wrapped in ```json ... ``` or other formatting)
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1

            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                extracted_data = json.loads(json_str)
                logger.info("Successfully extracted relevant information")
                return extracted_data
            else:
                logger.error("Failed to parse JSON from response")
                raise ValueError("Could not extract JSON from model response")

        except Exception as e:
            logger.error(f"Error extracting relevant information: {str(e)}")
            raise

    def generate_detailed_report(self, extracted_data: Dict) -> str:
        """
        Generate a detailed report with plan of action using Gemini API
        """
        try:
            disaster_type = extracted_data.get("disaster_type", "unknown")
            prompt = f"""
            You are a disaster management expert. Based on the following extracted disaster data,
            create a detailed report for relief workers that includes:

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

            Tailor the report to the specific disaster type ({disaster_type}). For example:
            - For floods: Focus on water levels, flood path predictions, and waterborne disease prevention.
            - For earthquakes: Focus on structural damage, aftershock risks, and search-and-rescue operations.
            - For cyclones: Focus on wind damage, storm surge impacts, and evacuation coordination.
            - For wildfires: Focus on fire containment, air quality management, and evacuation safety.
            - For landslides: Focus on soil stability, road clearance, and secondary landslide risks.

            Make the report practical, specific, and actionable for field workers.

            Extracted disaster data:
            {json.dumps(extracted_data, indent=2)}
            """

            response = self.model.generate_content(prompt)
            detailed_report = response.text
            logger.info("Successfully generated detailed report")
            return detailed_report

        except Exception as e:
            logger.error(f"Error generating detailed report: {str(e)}")
            raise

    def generate_action_plan(self, detailed_report: str, disaster_type: str) -> List[Dict[str, Any]]:
        """
        Extract a structured action plan from the detailed report
        """
        try:
            prompt = f"""
            Based on the following detailed disaster response report for a {disaster_type} disaster,
            extract a structured action plan as a JSON array.

            Each action item in the array should be a JSON object with the following structure:
            {{
                "priority": "high/medium/low",
                "timeframe": "immediate/short-term/medium-term",
                "action": "description of the action",
                "responsible": "agency or team responsible",
                "resources_needed": ["list", "of", "resources"],
                "success_criteria": "how to measure completion"
            }}

            Ensure the actions are specific to a {disaster_type} disaster. For example:
            - For floods: Include actions like "deploy water pumps" or "distribute water purification tablets".
            - For earthquakes: Include actions like "conduct structural assessments" or "set up search-and-rescue teams".
            - For cyclones: Include actions like "reinforce shelters" or "monitor storm surge levels".
            - For wildfires: Include actions like "establish firebreaks" or "distribute air masks".
            - For landslides: Include actions like "clear blocked roads" or "monitor soil stability".

            Return ONLY the JSON array with no additional text or explanation.

            Detailed report:
            {detailed_report}
            """

            response = self.model.generate_content(prompt)
            response_text = response.text

            # Find JSON in the response
            json_start = response_text.find('[')
            json_end = response_text.rfind(']') + 1

            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                action_plan = json.loads(json_str)
                logger.info("Successfully generated structured action plan")
                return action_plan
            else:
                logger.error("Failed to parse action plan JSON from response")
                raise ValueError("Could not extract action plan JSON from model response")

        except Exception as e:
            logger.error(f"Error generating action plan: {str(e)}")
            raise
import json
from typing import Dict, List, Any
import google.generativeai as genai
from dotenv import load_dotenv
import logging

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

class GeminiAgent:
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
        logger.info("Gemini Agent initialized with Gemini 1.5 Pro model")

    def extract_relevant_info(self, disaster_data) -> Dict:
        """
        Extract relevant disaster information from the input data using Gemini API
        """
        try:
            # Convert disaster data to JSON for the prompt
            disaster_data_json = disaster_data.model_dump_json(indent=2)

            prompt = f"""
            You are a disaster response information extraction system.
            Given the following disaster-related data, extract only the relevant information for emergency response.

            First, identify the primary disaster type (e.g., flood, earthquake, cyclone, wildfire, landslide) from the data.
            Then, extract the following information:
            - Disaster type (e.g., "flood", "earthquake")
            - Affected districts/regions
            - Affected population estimates
            - Evacuation centers
            - Disaster-specific data (based on the disaster type):
              - For floods: rainfall levels, dam and river water levels, live precipitation data
              - For earthquakes: seismic activity (magnitude, depth, epicenter), aftershock predictions
              - For cyclones: wind speeds, atmospheric pressure, storm surge data
              - For wildfires: fire spread (area, containment percentage), air quality index (AQI)
              - For landslides: soil stability, slope analysis, recent rainfall
            - Most affected areas
            - Current relief operations
            - Active disaster incidents

            Return ONLY a valid JSON object with these fields:
            {{
                "disaster_type": "string",
                "affected_districts": ["list", "of", "districts"],
                "affected_population": integer,
                "evacuation_centers": [{"name": "string", "location": "string", "capacity": integer}],
                "disaster_specific_data": {{ "key": "value" }} (specific to the disaster type),
                "most_affected_areas": ["list", "of", "areas"],
                "relief_operations": [{"operation": "string", "status": "string", "resources": ["list"]}],
                "active_incidents": [{"incident_id": "string", "location": "string", "severity": "string"}]
            }}

            Do not include any explanation or text outside the JSON.

            Here is the data:
            {disaster_data_json}
            """

            response = self.model.generate_content(prompt)

            # Extract the JSON from the response
            response_text = response.text

            # Find JSON in the response (it might be wrapped in ```json ... ``` or other formatting)
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1

            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                extracted_data = json.loads(json_str)
                logger.info("Successfully extracted relevant information")
                return extracted_data
            else:
                logger.error("Failed to parse JSON from response")
                raise ValueError("Could not extract JSON from model response")

        except Exception as e:
            logger.error(f"Error extracting relevant information: {str(e)}")
            raise

    def generate_detailed_report(self, extracted_data: Dict) -> str:
        """
        Generate a detailed report with plan of action using Gemini API
        """
        try:
            disaster_type = extracted_data.get("disaster_type", "unknown")
            prompt = f"""
            You are a disaster management expert. Based on the following extracted disaster data,
            create a detailed report for relief workers that includes:

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

            Tailor the report to the specific disaster type ({disaster_type}). For example:
            - For floods: Focus on water levels, flood path predictions, and waterborne disease prevention.
            - For earthquakes: Focus on structural damage, aftershock risks, and search-and-rescue operations.
            - For cyclones: Focus on wind damage, storm surge impacts, and evacuation coordination.
            - For wildfires: Focus on fire containment, air quality management, and evacuation safety.
            - For landslides: Focus on soil stability, road clearance, and secondary landslide risks.

            Make the report practical, specific, and actionable for field workers.

            Extracted disaster data:
            {json.dumps(extracted_data, indent=2)}
            """

            response = self.model.generate_content(prompt)
            detailed_report = response.text
            logger.info("Successfully generated detailed report")
            return detailed_report

        except Exception as e:
            logger.error(f"Error generating detailed report: {str(e)}")
            raise

    def generate_action_plan(self, detailed_report: str, disaster_type: str) -> List[Dict[str, Any]]:
        """
        Extract a structured action plan from the detailed report
        """
        try:
            prompt = f"""
            Based on the following detailed disaster response report for a {disaster_type} disaster,
            extract a structured action plan as a JSON array.

            Each action item in the array should be a JSON object with the following structure:
            {{
                "priority": "high/medium/low",
                "timeframe": "immediate/short-term/medium-term",
                "action": "description of the action",
                "responsible": "agency or team responsible",
                "resources_needed": ["list", "of", "resources"],
                "success_criteria": "how to measure completion"
            }}

            Ensure the actions are specific to a {disaster_type} disaster. For example:
            - For floods: Include actions like "deploy water pumps" or "distribute water purification tablets".
            - For earthquakes: Include actions like "conduct structural assessments" or "set up search-and-rescue teams".
            - For cyclones: Include actions like "reinforce shelters" or "monitor storm surge levels".
            - For wildfires: Include actions like "establish firebreaks" or "distribute air masks".
            - For landslides: Include actions like "clear blocked roads" or "monitor soil stability".

            Return ONLY the JSON array with no additional text or explanation.

            Detailed report:
            {detailed_report}
            """

            response = self.model.generate_content(prompt)
            response_text = response.text

            # Find JSON in the response
            json_start = response_text.find('[')
            json_end = response_text.rfind(']') + 1

            if json_start != -1 and json_end != -1:
                json_str = response_text[json_start:json_end]
                action_plan = json.loads(json_str)
                logger.info("Successfully generated structured action plan")
                return action_plan
            else:
                logger.error("Failed to parse action plan JSON from response")
                raise ValueError("Could not extract action plan JSON from model response")

        except Exception as e:
            logger.error(f"Error generating action plan: {str(e)}")
            raise
