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