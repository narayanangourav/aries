# Aries

Aries is an ATS resume analyzer that compares a resume against a job description, calculates an ATS-style score locally, finds matched and missing keywords, and uses Gemini only for resume improvement suggestions.

## Why aries

Most of the expensive work does not need AI.

```text
Resume PDF + Job Description
        ↓
Extract Text
        ↓
Keyword Matching
        ↓
ATS Score
        ↓
AI Suggestions
```

This keeps API usage low because:

- ATS score is calculated in the browser
- Missing keywords are detected in the browser
- Resume structure checks are calculated in the browser
- Gemini is called only when the user requests suggestions

## Features

- Upload a resume PDF or Word `.docx` file
- Paste or edit plain resume text or Overleaf-compatible LaTeX
- Paste a target job description
- Extract resume text with PDF.js
- Dynamically extract important job keywords and phrases
- Calculate ATS score using local TypeScript logic
- Show matched and missing keywords
- Show score breakdown for keyword coverage, density, and format signals
- Generate Gemini suggestions for job-specific resume improvements
- Copy or export an ATS report
- Link users to official Gemini API key documentation

## Tech Stack

- React
- TypeScript
- Vite
- PDF.js
- Mammoth.js
- Gemini API
- Lucide React icons

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Run with Podman or Docker

Build and start the production container with Podman Compose:

```bash
podman compose up --build
```

Or use Docker Compose with the same configuration:

```bash
docker compose up --build
```

Open the containerized application at:

```text
http://localhost:8080/aries/
```

Stop and remove the Compose workload:

```bash
podman compose down
```

To build and run without Compose:

```bash
podman build -t localhost/aries-resume-ats:latest .
podman run --rm -p 8080:8080 localhost/aries-resume-ats:latest
```

## Published container packages

Each GitHub Pages workflow run also publishes a container image to GitHub
Container Registry in a separate package job. Tags use the Asia/Kolkata build
date and a daily sequence number:

```text
ghcr.io/narayanangourav/aries:YYYYMMDD-NN
```

For example, the first two builds on August 12, 2026 are tagged
`20260812-01` and `20260812-02`. The sequence starts again at `01` on the next
day. Pull a specific immutable build with:

```bash
podman pull ghcr.io/narayanangourav/aries:20260812-01
```

## Gemini API Key

Aries needs a Gemini API key only for the **Generate suggestions** feature. The ATS score and keyword matching work without an API key.

Official Google documentation:

```text
https://ai.google.dev/gemini-api/docs/api-key
```

Create or view an API key in Google AI Studio:

```text
https://aistudio.google.com/apikey
```

## Project Structure

```text
src/
  analysis.ts   Local ATS scoring and keyword matching logic
  main.tsx      React UI, PDF extraction, and Gemini suggestion flow
  styles.css    App styling
```

## Notes

- Do not commit real API keys.
- Gemini free-tier quota can return `429` if usage is exhausted.
- Gemini can return temporary `503` errors during high demand.
- Scanned image PDFs may not extract text correctly unless OCR is added later.
