import { AnalysisReport } from "./components/AnalysisReport";
import { ReportHero } from "./components/ReportHero";
import { ResumeWorkspace } from "./components/ResumeWorkspace";
import { ScoreMetrics } from "./components/ScoreMetrics";
import { SiteHeader } from "./components/SiteHeader";
import { UI_TEXT } from "./content";
import { useResumeAnalyzer } from "./hooks/useResumeAnalyzer";
import "./app.css";

export const App = (): JSX.Element => {
  const controller = useResumeAnalyzer();

  return (
    <main className="app-shell">
      <SiteHeader />
      <ReportHero analysis={controller.analysis} />

      <section className="app-upgrade-banner" aria-label="Resume workspace">
        <p>{UI_TEXT.bannerCopy}</p>
        <button
          id="open-resume-workspace-banner"
          className="app-primary-button"
          type="button"
          aria-controls="resume-workspace"
          aria-expanded={controller.isWorkspaceOpen}
          onClick={controller.openWorkspace}
        >
          {UI_TEXT.openWorkspace}
        </button>
      </section>

      {controller.isWorkspaceOpen ? (
        <ResumeWorkspace controller={controller} />
      ) : null}
      <ScoreMetrics analysis={controller.analysis} />
      <AnalysisReport analysis={controller.analysis} />
    </main>
  );
};
