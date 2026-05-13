import type { ChatMessage, ProviderResult } from "./types.ts";
import { withTimeout } from "./http.ts";

export const callOllama = async ({
  baseUrl,
  model,
  messages,
  timeoutMs,
}: {
  baseUrl: string;
  model: string;
  messages: ChatMessage[];
  timeoutMs: number;
}): Promise<ProviderResult> => {
  const response = await withTimeout(
    `${baseUrl.replace(/\/$/, "")}/api/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: false }),
    },
    timeoutMs,
  );

  if (!response.ok) throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);

  const data = await response.json();
  const content = data.message?.content ?? "";
  if (!content) throw new Error("Ollama returned an empty response");

  return { provider: "ollama", model, content };
};

export const callGemini = async ({
  apiKey,
  model,
  systemPrompt,
  history,
  userContent,
  fileBase64,
  mimeType,
  timeoutMs,
}: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  userContent: string;
  fileBase64?: string;
  mimeType?: string;
  timeoutMs: number;
}): Promise<ProviderResult> => {
  const contents = [
    ...history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    {
      role: "user",
      parts: [
        { text: userContent },
        ...(fileBase64 && mimeType?.startsWith("image/")
          ? [{ inlineData: { mimeType, data: fileBase64 } }]
          : []),
      ],
    },
  ];
  const response = await withTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
      }),
    },
    timeoutMs,
  );

  if (!response.ok) throw new Error(`Gemini returned ${response.status}: ${await response.text()}`);

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("") ?? "";
  if (!content) throw new Error("Gemini returned an empty response");

  return { provider: "gemini", model, content };
};
