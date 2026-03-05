#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import axios from "axios";
import { loadConfig, AppConfig, SurveyStatus, Survey, Question, InputType, QuestionType, Choice, SurveyType, DefaultText, WelcomeCard } from "./config";
import 'dotenv/config';

async function main() {
    if (!process.env.CSV_PATH) {
        console.error("Environment variable 'CSV_PATH' is not set");
        process.exit(1);
    }

    const csvPath = path.resolve(process.env.CSV_PATH);
    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found: ${csvPath}`);
        process.exit(1);
    }

    const config: AppConfig = loadConfig();

    // read file
    const csvData = fs.readFileSync(csvPath, "utf-8");

    // parse CSV using csv-parse library
    parse(
    csvData,
    {
        delimiter: config.csvSeparator,
        columns: true,
        skip_empty_lines: true,
        bom: true,
        // further options may be needed for your specific CSV
    },
    async (err, records: any[]) => {
        if (err) {
            console.error("Failed to parse CSV:", err);
            process.exit(1);
        }

        // TODO: transform records into the desired JSON structure
        const payload = records; // placeholder
        console.log("Parsed CSV records:", payload);
        let newSurvey = new Survey();
        newSurvey.environmentId = config.environmentId;
        newSurvey.name = "Survey from CSV Import";
        newSurvey.status = SurveyStatus.DRAFT;
        newSurvey.questions = [];
        newSurvey.type = SurveyType.LINK;
        if(payload[0].Sezione == 'Presentazione') {
            newSurvey.welcomeCard = new WelcomeCard();
            newSurvey.welcomeCard.enabled = true;
            newSurvey.welcomeCard.headline.default = payload[0].Testo_Migliorato || 'Welcome to the survey!';
            payload.shift();
        }
        payload.forEach((parsedQuestion, index) => {
            let question: Question = new Question();
            console.log(`Processing question ${index + 1}:`, parsedQuestion.q_id);
            question.id = parsedQuestion.q_id;

            // Determine question type based on 'Tipo_Domanda' field
            switch (parsedQuestion.Tipo_Domanda) {
                case 'Scelta singola':
                    question.type = QuestionType.MULTIPLE_CHOICE_SINGLE;
                    break;
                case 'Scelta singola (screening)':
                    question.type = QuestionType.MULTIPLE_CHOICE_SINGLE;
                    break;
                case 'Scelta multipla':
                    question.type = QuestionType.MULTIPLE_CHOICE_MULTI;
                    break;
                case 'Aperta':
                    question.type = QuestionType.OPEN_TEXT;
                    break;
                case 'Aperta, opzionale':
                    question.type = QuestionType.OPEN_TEXT;
                    break;
                case 'Ranking':
                    question.type = QuestionType.RANKING;
                    break;
                case 'Matrice Likert 5 punti':
                    question.type = QuestionType.MATRIX;
                    break;
                default:
                    question.type = QuestionType.OPEN_TEXT;
                    break;
            }
            question.headline.default = parsedQuestion.Testo_Migliorato;

            // For multiple choice questions, split options and create Choice objects
            if(question.type == QuestionType.MULTIPLE_CHOICE_MULTI || question.type == QuestionType.MULTIPLE_CHOICE_SINGLE) {
                question.choices = [];
                let choices : string[] = parsedQuestion.Opzioni_Risposta ? parsedQuestion.Opzioni_Risposta.split(config.optionsSeparator) : [];
                choices.forEach((choice, idx) => {
                    let newChoice = new Choice();
                    newChoice.id = `${question.id}_${idx}`;
                    newChoice.label.default = choice;
                    if(question.choices) {
                        question.choices.push(newChoice);
                    }
                });
            }
            newSurvey.questions.push(question);
        });

        try {
            const url = `${config.baseUrl}api/v1/management/surveys`;
            const response = await axios.post(url, newSurvey, {
                headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.FORMBRICKS_API_KEY,
                },
            });
            console.log("API response status:", response.status);
            console.log("Response data:", response.data);
        } catch (postErr) {
            console.error("Error posting to API:", postErr);
            process.exit(1);
        }
    },
    );
}

// execute
main().catch((e) => {
  console.error("Unhandled error:", e);
  process.exit(1);
});
