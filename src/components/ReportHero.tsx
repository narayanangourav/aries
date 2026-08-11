import type { AtsAnalysis } from "../analysis";
import { UI_TEXT } from "../content";
import { getScoreMessage } from "../utils/reportViewModel";

interface ReportHeroProps {
  analysis: AtsAnalysis | null;
}

interface ScoreSummaryProps {
  analysis: AtsAnalysis | null;
}

const ScoreSummary = ({ analysis }: ScoreSummaryProps): JSX.Element => {
  const score = analysis?.score ?? 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);
  const scoreLabel = analysis ? `${score}%` : "—";
  const accessibleLabel = analysis
    ? `Total resume score ${score}%`
    : "Resume score not calculated";

  return (
    <div className="app-score-summary">
      <svg
        className="app-score-gauge"
        viewBox="0 0 180 180"
        aria-label={accessibleLabel}
        role="img"
      >
        <circle
          className="app-score-gauge-track"
          cx="90"
          cy="90"
          r={radius}
        />
        <circle
          className="app-score-gauge-value"
          cx="90"
          cy="90"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="app-score-gauge-label" aria-hidden="true">
        <span>{UI_TEXT.scoreLabel}</span>
        <strong>{scoreLabel}</strong>
      </div>
      <p>{getScoreMessage(analysis)}</p>
    </div>
  );
};

export const ReportHero = ({ analysis }: ReportHeroProps): JSX.Element => (
  <section className="app-report-hero" id="top">
    <div className="app-report-intro">
      <h1>
        {UI_TEXT.heroTitleLineOne}
        <br />
        {UI_TEXT.heroTitleLineTwo}
      </h1>
      <p>{UI_TEXT.heroDescription}</p>
    </div>
    <ScoreSummary analysis={analysis} />
  </section>
);

