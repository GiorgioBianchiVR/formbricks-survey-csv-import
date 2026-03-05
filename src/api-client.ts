import axios from "axios";
import { Survey } from "./classes/classes";
import { AppConfig } from "./config";

export async function createSurvey(config: AppConfig, newSurvey: Survey) {
    try {
        const url = `${config.baseUrl}api/v1/management/surveys`;
        const response = await axios.post(url, newSurvey, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.FORMBRICKS_API_KEY,
            },
        });
        console.log("API response status:", response.status);
    } catch (postErr) {
        console.error("Error posting to API:", postErr);
        process.exit(1);
    }
}
