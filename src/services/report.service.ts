import type { AtsAnalysis } from "../analysis";

const REPORT_TITLE = "Aries Resume ATS Report";
export const REPORT_FILE_NAME = "aries-ats-report.txt";

export const scoreVerdict = (score: number): string => {
  if (score >= 82) return "Strong match";
  if (score >= 65) return "Competitive";
  if (score >= 45) return "Needs tuning";
  return "Low alignment";
};

export const buildReport = (
  analysis: AtsAnalysis,
  suggestions: string,
): string =>
  [
    REPORT_TITLE,
    `ATS Score: ${analysis.score}/100 (${scoreVerdict(analysis.score)})`,
    `Keyword Coverage: ${Math.round(analysis.coverage * 100)}%`,
    `Keyword Density: ${Math.round(analysis.density * 100)}%`,
    `Format Signals: ${Math.round(analysis.formatScore * 100)}%`,
    "",
    "Top missing keywords:",
    analysis.missingKeywords
      .slice(0, 12)
      .map((item) => `- ${item.keyword}`)
      .join("\n") || "- None",
    "",
    "Matched keywords:",
    analysis.matchedKeywords
      .slice(0, 18)
      .map((item) => `- ${item.keyword} (${item.count})`)
      .join("\n") || "- None",
    "",
    "AI suggestions:",
    suggestions || "Not generated yet.",
  ].join("\n");

