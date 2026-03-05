#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { loadConfig, AppConfig} from "./config";
import { Choice, Question, Survey, WelcomeCard } from "./classes/classes";
import 'dotenv/config';
import { QuestionType, SurveyStatus, SurveyType } from "./enums/enums";
import { createSurvey } from "./api-client";

export function validateApiKey(): void {
    const apiKey = process.env.FORMBRICKS_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('API key is missing or empty in .env file');
    }
}

export function validateCsvPath(csvPath: string): void {
    if (!csvPath || csvPath.trim() === '') {
        throw new Error('CSV path is required');
    }
    if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found: ${csvPath}`);
    }
}

export function validateEnvironmentId(config: AppConfig): void {
    if (!config.environmentId || config.environmentId.trim() === '') {
        throw new Error('Environment ID is missing or empty in config.json');
    }
}

export async function main() {
    const config: AppConfig = loadConfig();
    validateEnvironmentId(config);
    validateApiKey();
    validateCsvPath(config.csvPath);
    
    const csvPath = path.resolve(config.csvPath);

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
        newSurvey.name = "Survey from CSV Import" + new Date().toISOString();
        newSurvey.status = SurveyStatus.DRAFT;
        newSurvey.questions = [];
        newSurvey.type = SurveyType.LINK;
        // Check if the first row is a welcome card based on section field
        if(payload[0][config.csvSchema.sectionColumnName] == 'Presentazione') {
            newSurvey.welcomeCard = new WelcomeCard();
            newSurvey.welcomeCard.enabled = true;
            newSurvey.welcomeCard.headline.default = payload[0][config.csvSchema.headlineColumnName] || 'Welcome to the survey!';
            payload.shift();
        }
        payload.forEach((parsedQuestion, index) => {
            let question: Question = new Question();
            question.id = parsedQuestion[config.csvSchema.idColumnName];

            // Determine question type based on 'Tipo_Domanda' field
            switch (parsedQuestion[config.csvSchema.typeColumnName]) {
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
            question.headline.default = parsedQuestion[config.csvSchema.headlineColumnName];

            // For multiple choice questions, split options and create Choice objects
            if(question.type == QuestionType.MULTIPLE_CHOICE_MULTI
                || question.type == QuestionType.MULTIPLE_CHOICE_SINGLE
                || question.type == QuestionType.RANKING) {
                let choices : string[] = parsedQuestion[config.csvSchema.optionsColumnName] ? parsedQuestion[config.csvSchema.optionsColumnName].split(config.optionsSeparator) : [];
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

                let rows : string[] = parsedQuestion[config.csvSchema.optionsColumnName] ? parsedQuestion[config.csvSchema.optionsColumnName].split(config.optionsSeparator) : [];
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

        await createSurvey(config, newSurvey);
    },
    );
}

// execute
if(process.env.NODE_ENV !== 'test') {
    main().catch((e) => {
        console.error("Unhandled error:", e);
        process.exit(1);
    });
}

