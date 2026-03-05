# CSV to JSON CLI

A simple Node.js CLI application written in TypeScript that parses a CSV file and sends the resulting JSON to an external API.

## Features

- Configurable via `config.json`
- CSV parsing with `csv-parse`
- HTTP POST using `axios`
- CLI usage, no GUI

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Update `config.json` with your API key, base URL, environment ID and separators.
3. Build the project:
   ```bash
   npm run build
   ```

## Usage

```bash
npm run start -- path/to/file.csv
```

For development without building, use:

```bash
npm run dev -- path/to/file.csv
```

The parsing logic is left for you to implement in `src/index.ts`.

## Configuration

`config.json` should contain:

```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "baseUrl": "https://api.example.com",
  "environmentId": "your-environment-id",
  "csvSeparator": ",",
  "optionsSeparator": "|"
}
```

Sensitive values (like `apiKey`) should be kept secret and managed securely (e.g., via environment variables or a secrets manager).
