import type { AtsAnalysis } from "../analysis";

const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
] as const;
const TEMPORARY_GEMINI_STATUSES = new Set([500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 700;
const GEMINI_API_BASE_URL =
  import.meta.env.VITE_GEMINI_API_BASE_URL?.trim() ||
  "https://generativelanguage.googleapis.com/v1beta/models";

type JsonPrimitive = boolean | null | number | string;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const isJsonRecord = (
  value: JsonValue,
): value is { [key: string]: JsonValue } =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const textFromParts = (parts: JsonValue): string => {
  if (!Array.isArray(parts)) return "";

  return parts
    .map((part) => {
      if (!isJsonRecord(part)) return "";
      return typeof part.text === "string" ? part.text : "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
};

const extractGeminiText = (result: JsonValue): string => {
  if (!isJsonRecord(result)) return "";

  for (const property of ["output_text", "outputText", "text"] as const) {
    const value = result[property];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  if (Array.isArray(result.candidates)) {
    const candidateText = result.candidates
      .map((candidate) => {
        if (!isJsonRecord(candidate) || !isJsonRecord(candidate.content)) {
          return "";
        }
        return textFromParts(candidate.content.parts ?? null);
      })
      .filter(Boolean)
      .join("\n")
      .trim();

    if (candidateText) return candidateText;
  }

  if (Array.isArray(result.output)) {
    return result.output
      .map((item) => {
        if (!isJsonRecord(item)) return "";
        if (typeof item.text === "string") return item.text;
        return textFromParts(item.content ?? item.parts ?? null);
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
};

const geminiErrorMessage = (result: JsonValue, fallback: string): string => {
  if (!isJsonRecord(result)) return fallback;
  if (typeof result.message === "string") return result.message;
  if (isJsonRecord(result.error) && typeof result.error.message === "string") {
    return result.error.message;
  }
  return fallback;
};

const parseJsonResponse = async (response: Response): Promise<JsonValue> => {
  try {
    return (await response.json()) as JsonValue;
  } catch {
    return null;
  }
};

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const buildPrompt = (
  resumeText: string,
  jobDescription: string,
  analysis: AtsAnalysis,
): string => `You are aries, an expert ATS resume tailoring assistant. Help the candidate improve this resume for the supplied job description.

Use the local ATS score, matched keywords, and missing keywords as evidence. Do not invent companies, titles, dates, degrees, tools, certifications, metrics, or experience. Recommend missing keywords only when truthful.

ATS score: ${analysis.score}/100
Matched keywords: ${analysis.matchedKeywords
  .slice(0, 18)
  .map((item) => `${item.keyword} (${item.count})`)
  .join(", ")}
Missing keywords: ${analysis.missingKeywords
  .slice(0, 18)
  .map((item) => item.keyword)
  .join(", ")}
Keyword coverage: ${Math.round(analysis.coverage * 100)}%
Keyword density: ${Math.round(analysis.density * 100)}%
Resume format score: ${Math.round(analysis.formatScore * 100)}%

Resume:
${resumeText.slice(0, 7000)}

Job description:
${jobDescription.slice(0, 5000)}

Return a concise role-fit summary, the top five edits ranked by ATS impact, missing keywords grouped by type, three truthful rewritten bullets, a tailored professional summary under 45 words, and any red flags.`;

export const getSuggestions = async (
  apiKey: string,
  resumeText: string,
  jobDescription: string,
  analysis: AtsAnalysis,
): Promise<string> => {
  try {
    const prompt = buildPrompt(resumeText, jobDescription, analysis);
    const errors: string[] = [];

    for (const model of GEMINI_MODELS) {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          const endpoint = new URL(`${GEMINI_API_BASE_URL}/${model}:generateContent`);
          endpoint.searchParams.set("key", apiKey);
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                maxOutputTokens: 700,
                temperature: 0.45,
                thinkingConfig: { thinkingBudget: 0 },
              },
            }),
          });
          const result = await parseJsonResponse(response);

          if (response.ok) {
            const text = extractGeminiText(result);
            if (text) return text;
            errors.push(`${model}: empty response`);
            break;
          }

          const message = geminiErrorMessage(result, response.statusText);
          errors.push(`${model}: ${response.status} ${message}`);

          if (response.status === 429) {
            throw new Error(
              "Gemini quota is exhausted for this API key. Wait for the quota to reset or use another key.",
            );
          }

          if (!TEMPORARY_GEMINI_STATUSES.has(response.status)) break;
        } catch (error) {
          if (error instanceof Error && error.message.startsWith("Gemini quota")) {
            throw error;
          }
          errors.push(`${model}: request failed`);
        }

        if (attempt < MAX_ATTEMPTS) await wait(RETRY_DELAY_MS * attempt);
      }
    }

    throw new Error(`Gemini request failed. ${errors.join(" | ")}`);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Gemini suggestions could not be generated.");
  }
};

