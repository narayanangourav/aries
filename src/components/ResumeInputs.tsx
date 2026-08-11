import { Loader2, Upload } from "lucide-react";
import { UI_TEXT } from "../content";
import type { ResumeAnalyzerController } from "../hooks/useResumeAnalyzer";

type ResumeInputsProps = Pick<
  ResumeAnalyzerController,
  | "extractState"
  | "handleFile"
  | "jobDescription"
  | "resumeFile"
  | "resumeText"
  | "setJobDescription"
  | "setResumeText"
>;

const getUploadStatus = (
  extractState: ResumeInputsProps["extractState"],
  fileName: string | undefined,
): string => {
  if (extractState === "working") return UI_TEXT.uploadWorking;
  if (extractState === "done" && fileName) {
    return `${UI_TEXT.uploadDone}: ${fileName}`;
  }
  return fileName ?? UI_TEXT.uploadPrompt;
};

export const ResumeInputs = ({
  extractState,
  handleFile,
  jobDescription,
  resumeFile,
  resumeText,
  setJobDescription,
  setResumeText,
}: ResumeInputsProps): JSX.Element => (
  <div className="app-workspace-inputs">
    <div className="app-input-panel app-resume-panel">
      <label className="app-upload-zone" htmlFor="resume-file">
        <input
          className="app-upload-input"
          id="resume-file"
          name="resume-file"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-describedby="resume-upload-status"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <span className="app-upload-icon" aria-hidden="true">
          {extractState === "working" ? (
            <Loader2 className="app-spin" />
          ) : (
            <Upload />
          )}
        </span>
        <span className="app-upload-copy" id="resume-upload-status">
          {getUploadStatus(extractState, resumeFile?.name)}
        </span>
      </label>

      <label className="app-field-label" htmlFor="resume-text">
        {UI_TEXT.resumeLabel}
      </label>
      <p className="app-field-help" id="resume-text-help">
        {UI_TEXT.resumeHelp}
      </p>
      <textarea
        id="resume-text"
        name="resume-text"
        value={resumeText}
        aria-required="true"
        aria-describedby="resume-text-help"
        onChange={(event) => setResumeText(event.target.value)}
        placeholder={UI_TEXT.resumePlaceholder}
      />
    </div>

    <div className="app-input-panel app-job-panel">
      <label className="app-field-label" htmlFor="job-description">
        {UI_TEXT.jobLabel}
      </label>
      <textarea
        id="job-description"
        name="job-description"
        value={jobDescription}
        aria-required="true"
        onChange={(event) => setJobDescription(event.target.value)}
        placeholder={UI_TEXT.jobPlaceholder}
      />
    </div>
  </div>
);
