export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
  images?: string[];
};

export type ParsedPdfDocument = {
  fileName?: string;
  pageCount?: number;
  pages?: Array<{ pageNumber: number; text: string }>;
  labResults?: Array<Record<string, unknown>>;
  fullText?: string;
};

export type DoclingDocument = {
  source: "docling-serve";
  fileName?: string;
  status?: string;
  textContent?: string;
  markdownContent?: string;
  jsonContent?: unknown;
  raw?: unknown;
};

export type ProviderResult = {
  provider: "ollama" | "gemini";
  model: string;
  content: string;
};

export type DocumentSection = {
  source: string;
  label: string;
  text: string;
};

export type RagChunk = DocumentSection & {
  index: number;
  score?: number;
};

export type RetrievalResult = {
  chunks: RagChunk[];
  mode: "embedding" | "lexical" | "none";
};

export type AnalyzeRequest = {
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
  text?: string;
  history?: Array<{ role?: string; content?: unknown }>;
  parsedDocument?: ParsedPdfDocument;
};
