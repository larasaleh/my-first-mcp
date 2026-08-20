import { test } from "node:test";
import assert from "node:assert";
import { searchNotes, findFaqAnswer } from "./notes.js";

const sampleNotes = [
  { id: "note-1", content: "Git branches let you work separately", tags: ["git", "week2"] },
  { id: "note-2", content: "Zod validates input shape", tags: ["zod"] },
];

const sampleFaqs = [
  { id: "faq-1", question: "how do I create a new branch in git?", answer: "Use git checkout -b" },
];

test("searchNotes finds a note by keyword in content", () => {
  const { results } = searchNotes(sampleNotes, "git");
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].id, "note-1");
});

test("searchNotes finds a note by tag", () => {
  const { results } = searchNotes(sampleNotes, "zod");
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].id, "note-2");
});

test("searchNotes returns empty results for no match", () => {
  const { results } = searchNotes(sampleNotes, "xyz-not-found");
  assert.strictEqual(results.length, 0);
});

test("findFaqAnswer matches a reworded question correctly", () => {
  const match = findFaqAnswer(sampleFaqs, "how do I create a new branch in git?");
  assert.ok(match);
  assert.strictEqual(match?.id, "faq-1");
});

test("findFaqAnswer does not false-positive on unrelated question", () => {
  const match = findFaqAnswer(sampleFaqs, "what is Inspector?");
  assert.strictEqual(match, undefined);
});
