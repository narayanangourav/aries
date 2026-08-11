export const canCompareResume = (
  resumeText: string,
  jobDescription: string,
): boolean => Boolean(resumeText.trim() && jobDescription.trim());

export const canCompareWithAi = (
  resumeText: string,
  jobDescription: string,
  apiKey: string,
): boolean =>
  canCompareResume(resumeText, jobDescription) && Boolean(apiKey.trim());
