import { z } from "zod";

// Schema for the add_note tool - saves a new note with optional tags
export const addNoteInputSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(2000)
    .describe("The text content of the note to save"),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10)
    .optional()
    .describe("Optional list of tags to categorize the note"),
});

// Schema for the search_notes tool - searches saved notes by keyword or tag
export const searchNotesInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(200)
    .describe("Search text to look for across your notes"),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Max number of results to return, defaults to 10"),
});

// Schema for the get_faq_answer tool - looks up a previously saved question
export const getFaqAnswerInputSchema = z.object({
  question: z
    .string()
    .min(1)
    .max(300)
    .describe("The question to look up in the saved FAQ entries"),
});

// Schema for validating the shape of data read from data/notes.json.
// Bounded the same way as the input schema, since data read from a file
// should be treated with the same care as untrusted input (OWASP guidance).
export const noteRecordSchema = z.object({
  id: z.string().min(1).max(50),
  content: z.string().min(1).max(2000),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
});

// Schema for validating the shape of data read from data/faqs.json
export const faqRecordSchema = z.object({
  id: z.string().min(1).max(50),
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
});