/**
 * Hand-written copy for one tool page. Everything here describes what that
 * specific tool does — it replaces the generated, category-level text.
 *
 * intro  — two short paragraphs separated by a blank line ("\n\n")
 * steps  — [title, description] pairs for the "How to use" section
 * faqs   — [question, answer] pairs specific to this tool
 * uses   — concrete situations the tool is used for
 */
export interface ToolCopy {
  intro: string;
  steps: [string, string][];
  faqs: [string, string][];
  uses: string[];
}

export type ToolCopyMap = Record<string, ToolCopy>;
