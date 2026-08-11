import type { AtsAnalysis } from "../analysis";
import { UI_TEXT } from "../content";
import type { ReportMetric } from "../types";
import { getReportMetrics } from "../utils/reportViewModel";

interface ScoreMetricsProps {
  analysis: AtsAnalysis | null;
}

const Metric = ({ label, tone, value }: ReportMetric): JSX.Element => (
  <div className={`app-metric app-metric-${tone}`}>
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

export const ScoreMetrics = ({
  analysis,
}: ScoreMetricsProps): JSX.Element => (
  <section className="app-score-metrics" aria-label={UI_TEXT.metricsLabel}>
    {getReportMetrics(analysis).map((metric) => (
      <Metric {...metric} key={metric.label} />
    ))}
  </section>
);

