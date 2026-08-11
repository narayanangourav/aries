import { AlertCircle } from "lucide-react";
import { UI_TEXT } from "../content";
import type { ResumeAnalyzerController } from "../hooks/useResumeAnalyzer";
import { ComparisonActions } from "./ComparisonActions";
import { ResumeInputs } from "./ResumeInputs";
import { SuggestionsPanel } from "./SuggestionsPanel";

interface ResumeWorkspaceProps {
  controller: ResumeAnalyzerController;
}

export const ResumeWorkspace = ({
  controller,
}: ResumeWorkspaceProps): JSX.Element => (
  <section
    className="app-workspace-shell"
    id="resume-workspace"
    aria-labelledby="workspace-title"
  >
    <div className="app-workspace-heading">
      <div>
        <p className="app-eyebrow">{UI_TEXT.workspaceEyebrow}</p>
        <h2 id="workspace-title">{UI_TEXT.workspaceTitle}</h2>
      </div>
      <button
        id="close-resume-workspace"
        className="app-close-workspace-button"
        type="button"
        onClick={controller.closeWorkspace}
      >
        {UI_TEXT.closeWorkspace}
      </button>
    </div>

    <ResumeInputs
      extractState={controller.extractState}
      handleFile={controller.handleFile}
      jobDescription={controller.jobDescription}
      resumeFile={controller.resumeFile}
      resumeText={controller.resumeText}
      setJobDescription={controller.setJobDescription}
      setResumeText={controller.setResumeText}
    />

    <ComparisonActions
      canAiCompare={controller.canAiCompare}
      canCompare={controller.canCompare}
      compareResume={controller.compareResume}
      compareWithAi={controller.compareWithAi}
      suggestionState={controller.suggestionState}
      suggestions={controller.suggestions}
    />

    {controller.error ? (
      <div className="app-notice" role="alert">
        <AlertCircle aria-hidden="true" />
        <span>{controller.error}</span>
      </div>
    ) : null}

    <SuggestionsPanel
      analysis={controller.analysis}
      apiKey={controller.apiKey}
      copyReport={controller.copyReport}
      downloadReport={controller.downloadReport}
      generateSuggestions={controller.generateSuggestions}
      reportStatus={controller.reportStatus}
      setApiKey={controller.setApiKey}
      suggestionState={controller.suggestionState}
      suggestions={controller.suggestions}
    />
  </section>
);
