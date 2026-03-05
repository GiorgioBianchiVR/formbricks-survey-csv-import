import {
    validateApiKey,
    validateCsvPath,
    validateEnvironmentId,
} from "../index";
import { AppConfig } from "../config";
import { ColumnNames } from "../classes/classes";

describe("Validation Functions", () => {
    process.env.NODE_ENV = "test";
    describe("validateApiKey", () => {
        it("should not throw if API key is present and not empty", () => {
            process.env.FORMBRICKS_API_KEY = "test-api-key";
            expect(() => validateApiKey()).not.toThrow();
        });

        it("should throw if API key is missing", () => {
            delete process.env.FORMBRICKS_API_KEY;
            expect(() => validateApiKey()).toThrow(
                "API key is missing or empty in .env file",
            );
        });

        it("should throw if API key is empty string", () => {
            process.env.FORMBRICKS_API_KEY = "";
            expect(() => validateApiKey()).toThrow(
                "API key is missing or empty in .env file",
            );
        });

        it("should throw if API key is only whitespace", () => {
            process.env.FORMBRICKS_API_KEY = "   ";
            expect(() => validateApiKey()).toThrow(
                "API key is missing or empty in .env file",
            );
        });
    });

    describe("validateCsvPath", () => {
        it("should not throw if CSV path exists", () => {
            // Assuming the CSV file exists in assets
            const csvPath = "src/assets/csvs/survey.csv";
            expect(() => validateCsvPath(csvPath)).not.toThrow();
        });

        it("should throw if CSV path is empty", () => {
            expect(() => validateCsvPath("")).toThrow("CSV path is required");
        });

        it("should throw if CSV path is only whitespace", () => {
            expect(() => validateCsvPath("   ")).toThrow("CSV path is required");
        });

        it("should throw if CSV file does not exist", () => {
            const nonExistentPath = "non-existent.csv";
            expect(() => validateCsvPath(nonExistentPath)).toThrow(
                `CSV file not found: ${nonExistentPath}`,
            );
        });
    });

    describe("validateEnvironmentId", () => {
        it("should not throw if environmentId is present and not empty", () => {
            const config: AppConfig = {
                baseUrl: "https://example.com",
                environmentId: "test-env-id",
                csvSeparator: ";",
                optionsSeparator: "|",
                csvPath: "src/assets/csvs/survey.csv",
                csvSchema: new ColumnNames()
            };
            expect(() => validateEnvironmentId(config)).not.toThrow();
        });

        it("should throw if environmentId is empty", () => {
            const config: AppConfig = {
                baseUrl: "https://example.com",
                environmentId: "",
                csvSeparator: ";",
                optionsSeparator: "|",
                csvPath: "src/assets/csvs/survey.csv",
                csvSchema: new ColumnNames()
            };
            expect(() => validateEnvironmentId(config)).toThrow(
                "Environment ID is missing or empty in config.json",
            );
        });

        it("should throw if environmentId is only whitespace", () => {
            const config: AppConfig = {
                baseUrl: "https://example.com",
                environmentId: "   ",
                csvSeparator: ";",
                optionsSeparator: "|",
                csvPath: "src/assets/csvs/survey.csv",
                csvSchema: new ColumnNames()
            };
            expect(() => validateEnvironmentId(config)).toThrow(
                "Environment ID is missing or empty in config.json",
            );
        });
    });
});
