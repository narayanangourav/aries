import assert from "node:assert/strict";
import test from "node:test";
import {
  canCompareResume,
  canCompareWithAi,
} from "./comparisonEligibility.ts";

test("requires both resume and job description for local comparison", () => {
  assert.equal(canCompareResume("React developer", "React role"), true);
  assert.equal(canCompareResume("", "React role"), false);
  assert.equal(canCompareResume("React developer", "   "), false);
});

test("requires a Gemini key in addition to comparison inputs", () => {
  assert.equal(
    canCompareWithAi("React developer", "React role", "api-key"),
    true,
  );
  assert.equal(canCompareWithAi("React developer", "React role", ""), false);
});
