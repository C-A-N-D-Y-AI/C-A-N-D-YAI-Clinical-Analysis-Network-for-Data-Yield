import { getConfig } from "./config.ts";
import { convertPdfWithDocling } from "./docling.ts";
import { isClearlyOffTopic, offTopicResponse } from "./guardrails.ts";
import { corsHeaders, jsonResponse } from "./http.ts";
import { buildUserContent, systemPrompt } from "./prompt.ts";
import { callGemini, callOllama } from "./providers.ts";
import { buildChunks, buildDocumentSections, formatRagContext, retrieveRelevantChunks } from "./rag.ts";
import type { AnalyzeRequest, ChatMessage, DoclingDocument } from "./types.ts";

const toSafeHistory = (history: AnalyzeRequest["history"]) =>
  Array.isArray(history)
    ? history
        .filter((message) => message?.role === "user" || message?.role === "assistant")
        .map((message) => ({
          role: message.role as "user" | "assistant",
          content: String(message.content ?? ""),
        }))
    : [];

const getUserText = ({ fileBase64, parsedDocument, text, fileName }: AnalyzeRequest) =>
  fileBase64 || parsedDocument
    ? (text?.trim() || `Por favor analiza este examen médico (${fileName ?? "archivo"}) y explícamelo de forma clara y humana.`)
    : (text ?? "");

const tryDocling = async (request: AnalyzeRequest, config: ReturnType<typeof getConfig>) => {
  if (request.mimeType !== "application/pdf" || !request.fileBase64) return undefined;

  try {
    return await convertPdfWithDocling({
      baseUrl: config.doclingBaseUrl,
      fileBase64: request.fileBase64,
      fileName: request.fileName,
      timeoutMs: config.doclingTimeoutMs,
      forceOcr: config.doclingForceOcr,
    });
  } catch (error) {
    console.warn("Docling Serve unavailable, using browser PDF extraction fallback:", error);
    return undefined;
  }
};

const buildRagContext = async ({
  request,
  doclingDocument,
  userText,
  config,
}: {
  request: AnalyzeRequest;
  doclingDocument?: DoclingDocument;
  userText: string;
  config: ReturnType<typeof getConfig>;
}) => {
  const sections = buildDocumentSections({
    parsedDocument: request.parsedDocument,
    doclingDocument,
  });
  const chunks = buildChunks(sections, config.ragChunkSize, config.ragChunkOverlap);
  const retrieval = await retrieveRelevantChunks({
    chunks,
    query: `${userText}\nresumen hallazgos valores altos bajos fuera de rango normales próximos pasos`,
    baseUrl: config.ollamaBaseUrl,
    embeddingModel: config.ollamaEmbedModel,
    timeoutMs: config.ollamaEmbedTimeoutMs,
    maxChunks: config.ragMaxChunks,
  });

  return {
    retrieval,
    context: formatRagContext(retrieval.chunks),
  };
};

const answerWithProviderChain = async ({
  request,
  messages,
  safeHistory,
  userContent,
  config,
}: {
  request: AnalyzeRequest;
  messages: ChatMessage[];
  safeHistory: Array<{ role: "user" | "assistant"; content: string }>;
  userContent: string;
  config: ReturnType<typeof getConfig>;
}) => {
  let ollamaError: string | undefined;

  try {
    const providerResult = await callOllama({
      baseUrl: config.ollamaBaseUrl,
      model: config.ollamaModel,
      messages,
      timeoutMs: config.ollamaTimeoutMs,
    });
    return { providerResult, ollamaError };
  } catch (error) {
    ollamaError = error instanceof Error ? error.message : "Ollama unavailable";
    console.warn("Ollama unavailable, falling back to Gemini:", error);
  }

  if (!config.geminiApiKey) {
    throw new Error("No pude conectar con Ollama y GEMINI_API_KEY no está configurada para usar el respaldo remoto.");
  }

  const providerResult = await callGemini({
    apiKey: config.geminiApiKey,
    model: config.geminiModel,
    systemPrompt,
    history: safeHistory,
    userContent,
    fileBase64: request.fileBase64,
    mimeType: request.mimeType,
    timeoutMs: config.geminiTimeoutMs,
  });

  return { providerResult, ollamaError };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const config = getConfig();
    const request = (await req.json()) as AnalyzeRequest;

    if (!request.fileBase64 && !request.text && !request.parsedDocument) {
      return jsonResponse({ error: "Falta el mensaje o archivo" }, 400);
    }

    const doclingDocument = await tryDocling(request, config);
    const userText = getUserText(request);
    const hasMedicalContext = Boolean(request.fileBase64 || request.parsedDocument || doclingDocument);

    if (isClearlyOffTopic({ text: userText, hasMedicalContext })) {
      return jsonResponse({
        result: offTopicResponse,
        provider: "guardrail",
        model: "none",
        usedDocling: Boolean(doclingDocument),
        retrievalMode: "none",
        retrievedChunks: 0,
      });
    }

    const { retrieval, context } = await buildRagContext({ request, doclingDocument, userText, config });
    const userContent = buildUserContent(userText, context);
    const safeHistory = toSafeHistory(request.history);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...safeHistory,
      {
        role: "user",
        content: userContent,
        ...(request.fileBase64 && request.mimeType?.startsWith("image/") ? { images: [request.fileBase64] } : {}),
      },
    ];
    const { providerResult, ollamaError } = await answerWithProviderChain({
      request,
      messages,
      safeHistory,
      userContent,
      config,
    });

    return jsonResponse({
      result: providerResult.content,
      provider: providerResult.provider,
      model: providerResult.model,
      usedDocling: Boolean(doclingDocument),
      retrievalMode: retrieval.mode,
      retrievedChunks: retrieval.chunks.length,
      ollamaError,
    });
  } catch (e) {
    console.error("analyze-exam error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
