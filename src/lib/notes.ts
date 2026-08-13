import { readJsonFile } from "./files.js";
import { z } from "zod";
import { noteRecordSchema, faqRecordSchema } from "../schemas/notes.js";

type Note = z.infer<typeof noteRecordSchema>;
type Faq = z.infer<typeof faqRecordSchema>;

const MAX_RESULTS = 10;

/**
 * Loads and validates all notes from data/notes.json.
 * Returns an empty array if the file is missing or empty — never throws
 * for that case. Invalid individual records are skipped and logged.
 */
export async function loadNotes(): Promise<Note[]> {
  const raw = await readJsonFile<unknown[]>("notes.json");
  const notes: Note[] = [];

  for (const item of raw) {
    const result = noteRecordSchema.safeParse(item);
    if (result.success) {
      notes.push(result.data);
    } else {
      console.error("[loadNotes] skipping invalid note record:", result.error.message);
    }
  }

  return notes;
}

/**
 * Loads and validates all FAQ entries from data/faqs.json.
 */
export async function loadFaqs(): Promise<Faq[]> {
  const raw = await readJsonFile<unknown[]>("faqs.json");
  const faqs: Faq[] = [];

  for (const item of raw) {
    const result = faqRecordSchema.safeParse(item);
    if (result.success) {
      faqs.push(result.data);
    } else {
      console.error("[loadFaqs] skipping invalid faq record:", result.error.message);
    }
  }

  return faqs;
}

/**
 * Searches notes by keyword, matching against content or tags.
 * Case-insensitive. Returns up to MAX_RESULTS matches — if more exist,
 * `truncated` is true so the caller can tell the user.
 */
export function searchNotes(
  notes: Note[],
  query: string,
): { results: Note[]; truncated: boolean } {
  const lowerQuery = query.toLowerCase();

  const matches = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );

  return {
    results: matches.slice(0, MAX_RESULTS),
    truncated: matches.length > MAX_RESULTS,
  };
}

/**
 * Looks up a FAQ entry by matching keywords in the question.
 * Returns undefined if nothing matches closely enough.
 */
export function findFaqAnswer(faqs: Faq[], question: string): Faq | undefined {
  const lowerQuestion = question.toLowerCase();

  return faqs.find((faq) => {
    const faqWords = faq.question.toLowerCase().split(/\s+/);
    return faqWords.some((word) => word.length > 3 && lowerQuestion.includes(word));
  });
}

/**
 * Creates a new note object with a generated ID. Does not persist it yet —
 * that happens in the tool handler.
 */
export function createNote(
  content: string,
  tags: string[] | undefined,
  existingCount: number,
): Note {
  return {
    id: `note-${existingCount + 1}`,
    content,
    tags,
  };
}