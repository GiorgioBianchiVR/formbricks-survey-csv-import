#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import axios from "axios";
import { loadConfig, AppConfig, SurveyStatus, Survey, Question, InputType, QuestionType, Choice, SurveyType, DefaultText, WelcomeCard } from "./config";
import 'dotenv/config';

async function main() {
    const config: AppConfig = loadConfig();
    const csvPath = path.resolve(config.csvPath);
    if (!csvPath) {
        console.error("CSV path is not set");
        process.exit(1);
    }

    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found: ${csvPath}`);
        process.exit(1);
    }

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

        const payload = records;
        let newSurvey = new Survey();
        newSurvey.environmentId = config.environmentId;
        newSurvey.name = "Survey from CSV Import";
        newSurvey.status = SurveyStatus.DRAFT;
        newSurvey.questions = [];
        newSurvey.type = SurveyType.LINK;
        // Check if the first row is a welcome card based on 'Sezione' field
        if(payload[0].Sezione == 'Presentazione') {
            newSurvey.welcomeCard = new WelcomeCard();
            newSurvey.welcomeCard.enabled = true;
            newSurvey.welcomeCard.headline.default = payload[0].Testo_Migliorato || 'Welcome to the survey!';
            payload.shift();
        }
        payload.forEach((parsedQuestion, index) => {
            let question: Question = new Question();
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
            if(question.type == QuestionType.MULTIPLE_CHOICE_MULTI 
                || question.type == QuestionType.MULTIPLE_CHOICE_SINGLE
                || question.type == QuestionType.RANKING) {
                let choices : string[] = parsedQuestion.Opzioni_Risposta ? parsedQuestion.Opzioni_Risposta.split(config.optionsSeparator) : [];
                question.choices = [];

                choices.forEach((choice, idx) => {
                    let newChoice = new Choice();
                    newChoice.id = `${question.id}_${idx}`;
                    newChoice.label.default = choice;
                    if(question.choices) {
                        question.choices.push(newChoice);
                    }
                });

                //Fix for insufficient options, as Formbricks requires at least 2 options for question choices
                if(question.choices.length < 2) {
                    console.warn("Insufficient options for question:", question.id);
                    for (let index = question.choices.length; index < 2; index++) {
                        question.choices.push(new Choice());
                    }
                }
            } else if (question.type == QuestionType.MATRIX) {
                question.rows = [];

                //Columns scale initialisation with default values from 1 to 5, can be customized later
                question.columns = [];
                for (let index = 1; index < 6; index++) {
                    const column = new Choice();
                    column.id = `${question.id}_column_${index}`;
                    column.label.default = index.toString();
                    question.columns.push(column);
                }

                let rows : string[] = parsedQuestion.Opzioni_Risposta ? parsedQuestion.Opzioni_Risposta.split(config.optionsSeparator) : [];
                rows.forEach((row, idx) => {
                    let newRow = new Choice();
                    newRow.id = `${question.id}_${idx}`;
                    newRow.label.default = row;
                    if(question.rows) {
                        question.rows.push(newRow);
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
