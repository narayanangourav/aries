import assert from "node:assert/strict";
import test from "node:test";
import { resumeTextForAnalysis } from "./resumeText.ts";

test("converts Overleaf LaTeX into clean ATS analysis text", () => {
  const latexResume = String.raw`
    \documentclass{article}
    \usepackage{hyperref}
    \begin{document}
    \section{Experience}
    \textbf{Software Engineer}\\
    Improved application performance by 35\%. % private editing note
    \section{Skills}
    React, TypeScript, and SQL
    \end{document}
  `;

  const analysisText = resumeTextForAnalysis(latexResume);

  assert.match(analysisText, /Experience/u);
  assert.match(analysisText, /Software Engineer/u);
  assert.match(analysisText, /35%/u);
  assert.match(analysisText, /React, TypeScript, and SQL/u);
  assert.doesNotMatch(analysisText, /documentclass|usepackage|textbf/u);
  assert.doesNotMatch(analysisText, /private editing note/u);
});

test("leaves ordinary resume text readable", () => {
  const plainText = "Experience\nSoftware Engineer\nImproved latency by 20%.";

  assert.equal(
    resumeTextForAnalysis(plainText),
    "Experience Software Engineer Improved latency by 20%.",
  );
});

