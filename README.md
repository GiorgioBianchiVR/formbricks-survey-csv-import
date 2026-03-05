# FormBricks Survey CSV Import CLI

A Node.js CLI application that imports survey forms from a CSV file and creates surveys on FormBricks using their external APIs.

## Description

This tool parses a CSV file containing form data and uses the FormBricks API to automatically build and deploy surveys. The CSV represents the survey form structure, with questions and options defined in the file.

## Prerequisites

- Node.js (version 14 or higher) installed on your system.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create Environment File**:
   Create a `.env` file in the root directory and add your FormBricks API key:
   ```
   API_KEY=your_formbricks_api_key_here
   ```
   You can obtain your API key from your FormBricks account settings.

3. **Configure config.json**:
   Update the `config.json` file with your FormBricks environment ID and CSV parsing options:
   ```json
   {
     "baseUrl": "https://app.formbricks.com/",
     "environmentId": "your_environment_id_here",
     "csvSeparator": ";",
     "optionsSeparator": "|"
   }
   ```
   - `environmentId`: Your FormBricks environment ID where the survey will be created.
   - `csvSeparator`: The character used to separate columns in your CSV file (e.g., ";" or ",").
   - `optionsSeparator`: The character used to separate multiple options within a cell (e.g., "|" for multiple choice options).

4. **Build the Project**:
   ```bash
   npm run build
   ```

## Usage

Run the CLI tool with the path to your CSV file:

```bash
npm run start -- path/to/your/survey.csv
```

For development (without building):

```bash
npm run dev -- path/to/your/survey.csv
```

## CSV Format

The CSV file should contain your survey form data. Ensure the separators match those configured in `config.json`.

## Configuration Details

- **API Key**: Stored securely in `.env` file to avoid exposing sensitive information.
- **Environment ID**: Specifies the FormBricks environment for survey creation.
- **Separators**: Customize parsing based on your CSV structure.

## License

ISC
