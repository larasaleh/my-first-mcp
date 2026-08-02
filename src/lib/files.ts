import { readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

const DATA_DIR = resolve(process.cwd(), "data");

/**
 * Safely reads and parses a JSON file, but only if it lives inside
 * the ./data folder. Rejects any path that tries to escape it (e.g. "..").
 */
export async function readJsonFile<T>(fileName: string): Promise<T> {
  const fullPath = resolve(DATA_DIR, fileName);
  const rel = relative(DATA_DIR, fullPath);

  if (rel.startsWith("..")) {
    throw new Error(`Refused to read file outside of data/: ${fileName}`);
  }

  let raw: string;
  try {
    raw = await readFile(fullPath, "utf-8");
  } catch (err) {
    // File missing or unreadable — treat as empty rather than crashing
    console.error(`[readJsonFile] could not read ${fileName}:`, err);
    return [] as unknown as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[readJsonFile] malformed JSON in ${fileName}:`, err);
    throw new Error(`Data file ${fileName} is not valid JSON`);
  }
}