export const getConfig = () => ({
  ollamaBaseUrl: Deno.env.get("OLLAMA_BASE_URL") ?? "http://host.docker.internal:11434",
  ollamaModel: Deno.env.get("OLLAMA_MODEL") ?? "llama3.2-vision:latest",
  ollamaEmbedModel: Deno.env.get("OLLAMA_EMBED_MODEL") ?? "nomic-embed-text:latest",
  ollamaTimeoutMs: Number(Deno.env.get("OLLAMA_TIMEOUT_MS") ?? "8000"),
  ollamaEmbedTimeoutMs: Number(Deno.env.get("OLLAMA_EMBED_TIMEOUT_MS") ?? "8000"),
  geminiApiKey: Deno.env.get("GEMINI_API_KEY"),
  geminiModel: Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash",
  geminiTimeoutMs: Number(Deno.env.get("GEMINI_TIMEOUT_MS") ?? "30000"),
  doclingBaseUrl: Deno.env.get("DOCLING_BASE_URL") ?? "http://host.docker.internal:5001",
  doclingTimeoutMs: Number(Deno.env.get("DOCLING_TIMEOUT_MS") ?? "120000"),
  doclingForceOcr: Deno.env.get("DOCLING_FORCE_OCR") === "true",
  ragChunkSize: Number(Deno.env.get("RAG_CHUNK_SIZE") ?? "1400"),
  ragChunkOverlap: Number(Deno.env.get("RAG_CHUNK_OVERLAP") ?? "200"),
  ragMaxChunks: Number(Deno.env.get("RAG_MAX_CHUNKS") ?? "8"),
});

export type AnalyzeConfig = ReturnType<typeof getConfig>;
