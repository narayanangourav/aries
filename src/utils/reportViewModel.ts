import type { AtsAnalysis } from "../analysis";
import { UI_TEXT } from "../content";
import type { ReportMetric } from "../types";

const toPercent = (value: number): string => `${Math.round(value * 100)}%`;

export const getScoreMessage = (analysis: AtsAnalysis | null): string => {
  if (!analysis) return UI_TEXT.scorePending;
  if (analysis.score >= 82) return UI_TEXT.scoreStrong;
  if (analysis.score >= 65) return UI_TEXT.scoreCompetitive;
  if (analysis.score >= 45) return UI_TEXT.scoreNeedsTuning;
  return UI_TEXT.scoreLow;
};

export const getReportMetrics = (
  analysis: AtsAnalysis | null,
): ReportMetric[] => [
  {
    label: UI_TEXT.metricsKeywordsAnalysed,
    value: analysis
      ? String(
          analysis.matchedKeywords.length + analysis.missingKeywords.length,
        )
      : "—",
    tone: "pink",
  },
  {
    label: UI_TEXT.metricsKeywordDensity,
    value: analysis ? toPercent(analysis.density) : "—",
    tone: "pink",
  },
  {
    label: UI_TEXT.metricsKeywordCoverage,
    value: analysis ? toPercent(analysis.coverage) : "—",
    tone: "pink",
  },
  {
    label: UI_TEXT.metricsFormatting,
    value: analysis ? toPercent(analysis.formatScore) : "—",
    tone: "amber",
  },
  {
    label: UI_TEXT.metricsSectionsFound,
    value: analysis ? String(analysis.roleSignals.length) : "—",
    tone: "pink",
  },
  {
    label: UI_TEXT.metricsResumeWords,
    value: analysis ? String(analysis.resumeWordCount) : "—",
    tone: "mint",
  },
  {
    label: UI_TEXT.metricsJobWords,
    value: analysis ? String(analysis.jobWordCount) : "—",
    tone: "pink",
  },
];
