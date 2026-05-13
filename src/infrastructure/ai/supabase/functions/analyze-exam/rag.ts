import type { DoclingDocument, DocumentSection, ParsedPdfDocument, RagChunk, RetrievalResult } from "./types.ts";
import { withTimeout } from "./http.ts";

const truncate = (value: string | undefined, maxLength: number) => {
  if (!value) return value;
  return value.length > maxLength ? `${value.slice(0, maxLength)}\n[texto truncado]` : value;
};

const stringifyForContext = (value: unknown, maxLength: number) => {
  if (value === undefined || value === null) return "";
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return truncate(text, maxLength) ?? "";
};

const normalizeForSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const tokenize = (value: string) =>
  normalizeForSearch(value)
    .split(/[^a-z0-9<>.,/%+-]+/i)
    .filter((token) => token.length > 2);

const chunkText = (text: string, maxLength: number, overlap: number) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    const hardEnd = Math.min(start + maxLength, clean.length);
    const sentenceEnd = clean.lastIndexOf(". ", hardEnd);
    const end = sentenceEnd > start + maxLength * 0.6 ? sentenceEnd + 1 : hardEnd;
    chunks.push(clean.slice(start, end).trim());

    if (end >= clean.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks;
};

export const buildDocumentSections = ({
  parsedDocument,
  doclingDocument,
}: {
  parsedDocument?: ParsedPdfDocument;
  doclingDocument?: DoclingDocument;
}): DocumentSection[] => {
  const sections: DocumentSection[] = [];

  if (doclingDocument?.textContent) {
    sections.push({ source: "docling-serve", label: "OCR/texto completo", text: doclingDocument.textContent });
  }

  if (doclingDocument?.markdownContent) {
    sections.push({ source: "docling-serve", label: "Markdown estructurado", text: doclingDocument.markdownContent });
  }

  const doclingJson = stringifyForContext(doclingDocument?.jsonContent, 40000);
  if (doclingJson) {
    sections.push({ source: "docling-serve", label: "JSON estructurado", text: doclingJson });
  }

  if (parsedDocument?.labResults?.length) {
    sections.push({
      source: "browser-pdfjs",
      label: "Resultados detectados",
      text: JSON.stringify(parsedDocument.labResults.slice(0, 200), null, 2),
    });
  }

  if (parsedDocument?.pages?.length) {
    for (const page of parsedDocument.pages) {
      if (!page.text?.trim()) continue;
      sections.push({ source: "browser-pdfjs", label: `Página ${page.pageNumber}`, text: page.text });
    }
  } else if (parsedDocument?.fullText) {
    sections.push({ source: "browser-pdfjs", label: "Texto completo", text: parsedDocument.fullText });
  }

  return sections;
};

export const buildChunks = (sections: DocumentSection[], maxLength: number, overlap: number) =>
  sections.flatMap((section, sectionIndex) =>
    chunkText(section.text, maxLength, overlap).map((text, chunkIndex) => ({
      ...section,
      label: `${section.label}${chunkIndex > 0 ? ` parte ${chunkIndex + 1}` : ""}`,
      text,
      index: sectionIndex * 1000 + chunkIndex,
    })),
  );

const lexicalScore = (query: string, chunk: RagChunk) => {
  const queryTokens = new Set(tokenize(query));
  if (!queryTokens.size) return 0;

  const chunkText = normalizeForSearch(`${chunk.label} ${chunk.text}`);
  let score = 0;

  for (const token of queryTokens) {
    if (chunkText.includes(token)) score += token.length > 4 ? 2 : 1;
  }

  if (/fuera|alto|bajo|rango|normal|resultado|valor|hallazgo|examen/i.test(chunk.text)) score += 1;
  if (/resultados detectados|json estructurado/i.test(chunk.label)) score += 2;

  return score;
};

const cosineSimilarity = (a: number[], b: number[]) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const getOllamaEmbedding = async ({
  baseUrl,
  model,
  text,
  timeoutMs,
}: {
  baseUrl: string;
  model: string;
  text: string;
  timeoutMs: number;
}) => {
  const response = await withTimeout(
    `${baseUrl.replace(/\/$/, "")}/api/embeddings`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: text }),
    },
    timeoutMs,
  );

  if (!response.ok) throw new Error(`Ollama embeddings returned ${response.status}: ${await response.text()}`);

  const data = await response.json();
  const embedding = data.embedding as number[] | undefined;
  if (!Array.isArray(embedding)) throw new Error("Ollama embeddings response did not include an embedding");
  return embedding;
};

export const retrieveRelevantChunks = async ({
  chunks,
  query,
  baseUrl,
  embeddingModel,
  timeoutMs,
  maxChunks,
}: {
  chunks: RagChunk[];
  query: string;
  baseUrl: string;
  embeddingModel: string;
  timeoutMs: number;
  maxChunks: number;
}): Promise<RetrievalResult> => {
  if (!chunks.length) return { chunks: [], mode: "none" };

  const lexicalCandidates = chunks
    .map((chunk) => ({ ...chunk, score: lexicalScore(query, chunk) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, Math.min(32, chunks.length));

  try {
    const queryEmbedding = await getOllamaEmbedding({ baseUrl, model: embeddingModel, text: query, timeoutMs });
    const scoredChunks = await Promise.all(
      lexicalCandidates.map(async (chunk) => {
        const embedding = await getOllamaEmbedding({
          baseUrl,
          model: embeddingModel,
          text: `${chunk.label}\n${chunk.text}`,
          timeoutMs,
        });
        return { ...chunk, score: cosineSimilarity(queryEmbedding, embedding) };
      }),
    );

    return {
      chunks: scoredChunks.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, maxChunks),
      mode: "embedding",
    };
  } catch (error) {
    console.warn("Embedding retrieval unavailable, using lexical retrieval:", error);
    return { chunks: lexicalCandidates.slice(0, maxChunks), mode: "lexical" };
  }
};

export const formatRagContext = (chunks: RagChunk[]) => {
  if (!chunks.length) return "No se recuperaron fragmentos de texto del examen.";

  return chunks
    .map(
      (chunk, index) => `[Fragmento ${index + 1} | fuente: ${chunk.source} | sección: ${chunk.label}]
${chunk.text}`,
    )
    .join("\n\n");
};
