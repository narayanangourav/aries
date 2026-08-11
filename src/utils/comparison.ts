import { analyzeResume, type AtsAnalysis } from "../analysis";
import {
  canCompareResume,
  canCompareWithAi,
} from "./comparisonEligibility";
import { resumeTextForAnalysis } from "./resumeText";

export { canCompareResume, canCompareWithAi };

export const createResumeComparison = (
  resumeText: string,
  jobDescription: string,
): AtsAnalysis | null => {
  if (!canCompareResume(resumeText, jobDescription)) return null;

  return analyzeResume(resumeTextForAnalysis(resumeText), jobDescription);
};
