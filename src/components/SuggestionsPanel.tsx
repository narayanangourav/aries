import {
  Clipboard,
  Download,
  ExternalLink,
  KeyRound,
  Loader2,
  Sparkles,
} from "lucide-react";
import { EXTERNAL_LINKS, UI_TEXT } from "../content";
import type { ResumeAnalyzerController } from "../hooks/useResumeAnalyzer";

type SuggestionsPanelProps = Pick<
  ResumeAnalyzerController,
  | "analysis"
  | "apiKey"
  | "copyReport"
  | "downloadReport"
  | "generateSuggestions"
  | "reportStatus"
  | "setApiKey"
  | "suggestionState"
  | "suggestions"
>;

export const SuggestionsPanel = ({
  analysis,
  apiKey,
  copyReport,
  downloadReport,
  generateSuggestions,
  reportStatus,
  setApiKey,
  suggestionState,
  suggestions,
}: SuggestionsPanelProps): JSX.Element => {
  const isWorking = suggestionState === "working";
  const canGenerate = Boolean(analysis && apiKey.trim()) && !isWorking;

  return (
    <section
      className="app-suggestions-panel"
      aria-label={UI_TEXT.suggestionsReady}
      aria-busy={isWorking}
    >
      <div className="app-gemini-key-card">
        <label className="app-field-label" htmlFor="gemini-key">
          {UI_TEXT.apiKeyLabel}
        </label>
        <div className="app-api-row">
          <KeyRound aria-hidden="true" />
          <input
            id="gemini-key"
            name="gemini-key"
            type="password"
            autoComplete="off"
            spellCheck="false"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={UI_TEXT.apiKeyPlaceholder}
          />
        </div>
        <div className="app-api-links">
          <a
            href={EXTERNAL_LINKS.apiKeyDocs}
            id="gemini-api-docs-link"
            target="_blank"
            rel="noreferrer"
          >
            {UI_TEXT.apiDocs}
            <ExternalLink aria-hidden="true" />
          </a>
          <a
            href={EXTERNAL_LINKS.createApiKey}
            id="gemini-create-key-link"
            target="_blank"
            rel="noreferrer"
          >
            {UI_TEXT.createApiKey}
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="app-suggestion-actions">
        <button
          id="copy-report-button"
          type="button"
          className="app-secondary-button"
          onClick={() => void copyReport()}
          disabled={!analysis}
        >
          <Clipboard aria-hidden="true" />
          {UI_TEXT.copyReport}
        </button>
        <button
          id="export-report-button"
          type="button"
          className="app-secondary-button"
          onClick={downloadReport}
          disabled={!analysis}
        >
          <Download aria-hidden="true" />
          {UI_TEXT.exportReport}
        </button>
        <button
          id="generate-suggestions-button"
          type="button"
          onClick={() => void generateSuggestions()}
          disabled={!canGenerate}
        >
          {isWorking ? (
            <Loader2 className="app-spin" aria-hidden="true" />
          ) : (
            <Sparkles aria-hidden="true" />
          )}
          {isWorking
            ? UI_TEXT.generatingSuggestions
            : suggestions
              ? UI_TEXT.regenerateAiSuggestions
              : UI_TEXT.generateSuggestions}
        </button>
      </div>
      <p className="app-report-status" aria-live="polite">
        {reportStatus}
      </p>
      <div
        className="app-suggestions-output"
        role="status"
        aria-live="polite"
        aria-label={UI_TEXT.suggestionsReady}
      >
        <pre>{suggestions || UI_TEXT.suggestionsPending}</pre>
      </div>
    </section>
  );
};
