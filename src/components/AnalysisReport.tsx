import { ChevronUp } from "lucide-react";
import type { AtsAnalysis, KeywordMatch } from "../analysis";
import { UI_TEXT } from "../content";

interface AnalysisReportProps {
  analysis: AtsAnalysis | null;
}

interface KeywordListProps {
  empty: string;
  items: KeywordMatch[];
  title: string;
}

interface ScoreBarProps {
  label: string;
  value: number;
}

const ScoreBar = ({ label, value }: ScoreBarProps): JSX.Element => {
  const percent = Math.round(value * 100);

  return (
    <div className="app-score-bar">
      <div>
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <progress aria-label={label} value={percent} max={100} />
    </div>
  );
};

const KeywordList = ({ empty, items, title }: KeywordListProps): JSX.Element => (
  <div className="app-keyword-panel">
    <h3>{title}</h3>
    <div className="app-chips">
      {items.length ? (
        items.slice(0, 24).map((item) => (
          <span className="app-chip app-chip-muted" key={item.keyword}>
            {item.keyword}
          </span>
        ))
      ) : (
        <p>{empty}</p>
      )}
    </div>
  </div>
);

const KeywordSection = ({ analysis }: AnalysisReportProps): JSX.Element => {
  const missingKeywords = analysis?.missingKeywords ?? [];
  const insight = !analysis
    ? UI_TEXT.missingKeywordsPending
    : missingKeywords.length
      ? UI_TEXT.missingKeywordsWarning
      : UI_TEXT.missingKeywordsSuccess;
  const insightTone = !analysis
    ? "app-insight-neutral"
    : missingKeywords.length
      ? "app-insight-warning"
      : "app-insight-success";

  return (
    <details className="app-analysis-section" open>
      <summary className="app-section-title" id="keyword-analysis-toggle">
        <span className="app-section-score app-section-score-pink">
          {analysis ? `${Math.round(analysis.coverage * 100)}%` : "—"}
        </span>
        <span className="app-section-copy">
          <h2 className="app-section-heading">{UI_TEXT.keywordTitle}</h2>
          <span>{UI_TEXT.keywordDescription}</span>
        </span>
        <span className="app-collapse-indicator" aria-hidden="true">
          <ChevronUp />
        </span>
      </summary>
      <div className="app-insight-card">
        <p className={insightTone}>{insight}</p>
        <KeywordList
          title={UI_TEXT.missingKeywordsTitle}
          empty={
            analysis
              ? UI_TEXT.missingKeywordsEmpty
              : UI_TEXT.missingKeywordsPending
          }
          items={missingKeywords}
        />
      </div>
    </details>
  );
};

const FormatSection = ({ analysis }: AnalysisReportProps): JSX.Element => (
  <details className="app-analysis-section" open>
    <summary className="app-section-title" id="format-analysis-toggle">
      <span className="app-section-score app-section-score-amber">
        {analysis ? `${Math.round(analysis.formatScore * 100)}%` : "—"}
      </span>
      <span className="app-section-copy">
        <h2 className="app-section-heading">{UI_TEXT.formattingTitle}</h2>
        <span>{UI_TEXT.formattingDescription}</span>
      </span>
      <span className="app-collapse-indicator" aria-hidden="true">
        <ChevronUp />
      </span>
    </summary>
    <div className="app-insight-card app-format-list">
      <ScoreBar label={UI_TEXT.keywordCoverage} value={analysis?.coverage ?? 0} />
      <ScoreBar label={UI_TEXT.keywordDensity} value={analysis?.density ?? 0} />
      <ScoreBar label={UI_TEXT.resumeFormat} value={analysis?.formatScore ?? 0} />
    </div>
  </details>
);

const MatchedKeywordSidebar = ({
  analysis,
}: AnalysisReportProps): JSX.Element => {
  const matchedKeywords = analysis?.matchedKeywords ?? [];

  return (
    <aside className="app-report-sidebar">
      <h2>{UI_TEXT.matchedKeywordsTitle}</h2>
      <div className="app-sidebar-list">
        {matchedKeywords.map((item) => (
          <div key={item.keyword}>
            <span>{item.keyword}</span>
            <strong>{item.count}×</strong>
          </div>
        ))}
        {!analysis ? <p>{UI_TEXT.matchedKeywordsPending}</p> : null}
        {analysis && !matchedKeywords.length ? (
          <p>{UI_TEXT.matchedKeywordsEmpty}</p>
        ) : null}
      </div>
    </aside>
  );
};

export const AnalysisReport = ({
  analysis,
}: AnalysisReportProps): JSX.Element => (
  <section
    className="app-analysis-layout"
    aria-label={UI_TEXT.detailedAnalysisLabel}
  >
    <div className="app-analysis-content">
      <KeywordSection analysis={analysis} />
      <FormatSection analysis={analysis} />
    </div>
    <MatchedKeywordSidebar analysis={analysis} />
  </section>
);
