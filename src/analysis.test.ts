import assert from "node:assert/strict";
import test from "node:test";
import { analyzeResume } from "./analysis.ts";

const RESUME = `
Alex Morgan
Software Engineer
alex@example.com linkedin github phone

Summary
Frontend engineer building accessible React and TypeScript applications.

Experience
Built React dashboards with TypeScript, REST API integration, SQL analytics,
automated testing, and CI/CD. Improved load time by 35%.

Skills
React TypeScript JavaScript HTML CSS Node.js SQL Git AWS

Education
Bachelor of Engineering
`;

const JOB_DESCRIPTION = `
We are hiring a Frontend Software Engineer with React, TypeScript, JavaScript,
HTML, and CSS experience. Build accessible responsive web applications, consume
REST APIs, write automated tests, use Git and CI/CD, and improve performance.
Experience with Node.js, SQL, AWS, agile delivery, and component libraries is
preferred.
`;

test("returns a deterministic score with bounded factors", () => {
  const firstAnalysis = analyzeResume(RESUME, JOB_DESCRIPTION);
  const secondAnalysis = analyzeResume(RESUME, JOB_DESCRIPTION);

  assert.deepEqual(firstAnalysis, secondAnalysis);
  assert.ok(firstAnalysis.score >= 0 && firstAnalysis.score <= 100);
  assert.ok(firstAnalysis.coverage >= 0 && firstAnalysis.coverage <= 1);
  assert.ok(firstAnalysis.density >= 0 && firstAnalysis.density <= 1);
  assert.ok(firstAnalysis.formatScore >= 0 && firstAnalysis.formatScore <= 1);
  assert.ok(firstAnalysis.matchedKeywords.length > 0);
});

test("does not create keyword phrases across punctuation boundaries", () => {
  const analysis = analyzeResume("AWS agile", "AWS, agile delivery. SQL, AWS.");
  const keywords = [...analysis.matchedKeywords, ...analysis.missingKeywords].map(
    (item) => item.keyword,
  );

  assert.equal(keywords.includes("aws agile"), false);
  assert.equal(keywords.includes("sql aws"), false);
});

test("handles empty and malformed-looking content without invalid numbers", () => {
  const analysis = analyzeResume("   ", "... ,,, ---");

  assert.equal(analysis.score, 0);
  assert.equal(Number.isFinite(analysis.coverage), true);
  assert.equal(Number.isFinite(analysis.density), true);
  assert.equal(Number.isFinite(analysis.formatScore), true);
  assert.deepEqual(analysis.matchedKeywords, []);
  assert.deepEqual(analysis.missingKeywords, []);
});

