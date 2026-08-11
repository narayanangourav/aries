import { Loader2, SearchCheck, Sparkles } from "lucide-react";
import { UI_TEXT } from "../content";
import type { ResumeAnalyzerController } from "../hooks/useResumeAnalyzer";

type ComparisonActionsProps = Pick<
  ResumeAnalyzerController,
  | "canAiCompare"
  | "canCompare"
  | "compareResume"
  | "compareWithAi"
  | "suggestionState"
  | "suggestions"
>;

export const ComparisonActions = ({
  canAiCompare,
  canCompare,
  compareResume,
  compareWithAi,
  suggestionState,
  suggestions,
}: ComparisonActionsProps): JSX.Element => {
  const isWorking = suggestionState === "working";
  const aiLabel = isWorking
    ? UI_TEXT.comparingWithAi
    : suggestions
      ? UI_TEXT.regenerateAiSuggestions
      : UI_TEXT.aiCompare;

  return (
    <div className="app-comparison-actions" aria-label={UI_TEXT.compareActions}>
      <button
        id="compare-resume-button"
        className="app-compare-button"
        type="button"
        disabled={!canCompare || isWorking}
        onClick={compareResume}
      >
        <SearchCheck aria-hidden="true" />
        {UI_TEXT.compareResume}
      </button>
      <button
        id="ai-compare-button"
        type="button"
        disabled={!canAiCompare || isWorking}
        onClick={() => void compareWithAi()}
      >
        {isWorking ? (
          <Loader2 className="app-spin" aria-hidden="true" />
        ) : (
          <Sparkles aria-hidden="true" />
        )}
        {aiLabel}
      </button>
    </div>
  );
};
