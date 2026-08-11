const LATEX_COMMENT_PATTERN = /(^|[^\\])%.*$/gmu;
const LATEX_PREAMBLE_PATTERN =
  /\\(?:documentclass|usepackage)(?:\[[^\]]*\])?\{[^}]*\}/gu;
const LATEX_ENVIRONMENT_PATTERN = /\\(?:begin|end)\{[^}]*\}/gu;
const LATEX_COMMAND_PATTERN = /\\[a-zA-Z@]+\*?(?:\[[^\]]*\])?/gu;
const LATEX_SIGNAL_PATTERN =
  /\\(?:begin|documentclass|section|subsection|textbf|usepackage)\b/u;

export const resumeTextForAnalysis = (resumeText: string): string => {
  if (!LATEX_SIGNAL_PATTERN.test(resumeText)) {
    return resumeText.replace(/\s+/gu, " ").trim();
  }

  return resumeText
    .replace(LATEX_COMMENT_PATTERN, "$1")
    .replace(/\\%/gu, "%")
    .replace(LATEX_PREAMBLE_PATTERN, " ")
    .replace(LATEX_ENVIRONMENT_PATTERN, " ")
    .replace(LATEX_COMMAND_PATTERN, " ")
    .replace(/\\\\/gu, "\n")
    .replace(/[{}$&_~^]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
};
