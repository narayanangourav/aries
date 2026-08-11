import { useState } from "react";
import type { AtsAnalysis } from "../analysis";
import { UI_TEXT } from "../content";
import { getSuggestions } from "../services/gemini.service";
import { extractResumeText } from "../services/resumeFile.service";
import {
  buildReport,
  REPORT_FILE_NAME,
} from "../services/report.service";
import type { StepState } from "../types";
import {
  canCompareResume,
  canCompareWithAi,
  createResumeComparison,
} from "../utils/comparison";

const STATUS_DURATION_MS = 1800;
const WORKSPACE_ID = "resume-workspace";
const OPEN_WORKSPACE_BUTTON_ID = "open-resume-workspace-banner";

export interface ResumeAnalyzerController {
  analysis: AtsAnalysis | null;
  apiKey: string;
  canAiCompare: boolean;
  canCompare: boolean;
  error: string;
  extractState: StepState;
  isWorkspaceOpen: boolean;
  jobDescription: string;
  reportStatus: string;
  resumeFile: File | null;
  resumeText: string;
  suggestionState: StepState;
  suggestions: string;
  closeWorkspace: () => void;
  compareResume: () => void;
  compareWithAi: () => Promise<void>;
  copyReport: () => Promise<void>;
  downloadReport: () => void;
  generateSuggestions: () => Promise<void>;
  handleFile: (file: File | undefined) => Promise<void>;
  openWorkspace: () => void;
  setApiKey: (value: string) => void;
  setJobDescription: (value: string) => void;
  setResumeText: (value: string) => void;
}

const scrollToElement = (id: string): void => {
  window.requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
};

export const useResumeAnalyzer = (): ResumeAnalyzerController => {
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeTextState] = useState("");
  const [jobDescription, setJobDescriptionState] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [extractState, setExtractState] = useState<StepState>("idle");
  const [suggestionState, setSuggestionState] =
    useState<StepState>("idle");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [reportStatus, setReportStatus] = useState("");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const resetDerivedState = (): void => {
    setAnalysis(null);
    setError("");
    setSuggestions("");
    setSuggestionState("idle");
    setReportStatus("");
  };

  const updateResumeText = (value: string): void => {
    setResumeTextState(value);
    resetDerivedState();
  };

  const updateJobDescription = (value: string): void => {
    setJobDescriptionState(value);
    resetDerivedState();
  };

  const handleFile = async (file: File | undefined): Promise<void> => {
    if (!file) return;

    setResumeFile(file);
    resetDerivedState();
    setExtractState("working");

    try {
      const text = await extractResumeText(file);
      setResumeTextState(text);
      setExtractState("done");
    } catch (caughtError) {
      setResumeTextState("");
      setExtractState("error");
      setError(
        caughtError instanceof Error ? caughtError.message : UI_TEXT.parseError,
      );
    }
  };

  const requestSuggestions = async (
    comparison: AtsAnalysis,
  ): Promise<void> => {
    setSuggestionState("working");
    setError("");

    try {
      const nextSuggestions = await getSuggestions(
        apiKey.trim(),
        resumeText,
        jobDescription,
        comparison,
      );
      setSuggestions(nextSuggestions);
      setSuggestionState("done");
    } catch (caughtError) {
      setSuggestionState("error");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : UI_TEXT.suggestionsError,
      );
    }
  };

  const compareResume = (): void => {
    const comparison = createResumeComparison(resumeText, jobDescription);
    if (!comparison) return;

    setAnalysis(comparison);
    setError("");
    setSuggestions("");
    setSuggestionState("idle");
    setReportStatus("");
  };

  const compareWithAi = (): Promise<void> => {
    const comparison = createResumeComparison(resumeText, jobDescription);
    if (!comparison || !apiKey.trim()) return Promise.resolve();

    setAnalysis(comparison);
    setSuggestions("");
    setReportStatus("");
    return requestSuggestions(comparison);
  };

  const generateSuggestions = (): Promise<void> => {
    if (!analysis || !apiKey.trim()) return Promise.resolve();
    return requestSuggestions(analysis);
  };

  const copyReport = async (): Promise<void> => {
    if (!analysis) return;

    try {
      await navigator.clipboard.writeText(buildReport(analysis, suggestions));
      setReportStatus(UI_TEXT.reportCopied);
      window.setTimeout(() => setReportStatus(""), STATUS_DURATION_MS);
    } catch {
      setError(UI_TEXT.reportCopyError);
    }
  };

  const downloadReport = (): void => {
    if (!analysis) return;

    try {
      const report = buildReport(analysis, suggestions);
      const url = URL.createObjectURL(
        new Blob([report], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = REPORT_FILE_NAME;
      link.click();
      URL.revokeObjectURL(url);
      setReportStatus(UI_TEXT.reportDownloaded);
      window.setTimeout(() => setReportStatus(""), STATUS_DURATION_MS);
    } catch {
      setError(UI_TEXT.reportDownloadError);
    }
  };

  const openWorkspace = (): void => {
    setIsWorkspaceOpen(true);
    scrollToElement(WORKSPACE_ID);
  };

  const closeWorkspace = (): void => {
    setIsWorkspaceOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById(OPEN_WORKSPACE_BUTTON_ID)?.focus();
    });
  };

  return {
    analysis,
    apiKey,
    canAiCompare: canCompareWithAi(resumeText, jobDescription, apiKey),
    canCompare: canCompareResume(resumeText, jobDescription),
    error,
    extractState,
    isWorkspaceOpen,
    jobDescription,
    reportStatus,
    resumeFile,
    resumeText,
    suggestionState,
    suggestions,
    closeWorkspace,
    compareResume,
    compareWithAi,
    copyReport,
    downloadReport,
    generateSuggestions,
    handleFile,
    openWorkspace,
    setApiKey,
    setJobDescription: updateJobDescription,
    setResumeText: updateResumeText,
  };
};
