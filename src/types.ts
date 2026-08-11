export type StepState = "idle" | "working" | "done" | "error";

export type MetricTone = "pink" | "amber" | "mint";

export interface ReportMetric {
  label: string;
  tone: MetricTone;
  value: string;
}

