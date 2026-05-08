"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Paperclip, Send, Sparkles, Loader2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parsePdfToJson } from "@/lib/pdf-parser";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  fileName?: string;
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hola 👋 Soy tu asistente médico. Sube una foto o PDF de tu examen y te lo explico de forma clara y humana.",
    },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      toast.error("Solo se permiten imágenes o PDFs");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Máximo 10MB");
      return;
    }
    setFile(f);
  };

  const send = async () => {
    if (loading) return;
    if (!file && !text.trim()) return;

    const sentFile = file;
    const sentText = text.trim();
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: sentText || `📎 ${sentFile!.name}`,
      fileName: sentFile?.name,
    };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);
    setFile(null);
    setText("");
    if (inputRef.current) inputRef.current.value = "";

    try {
      if (!supabase) {
        throw new Error("Faltan las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
      }

      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));
      const body: Record<string, unknown> = { text: sentText, history };
      if (sentFile) {
        body.mimeType = sentFile.type;
        body.fileName = sentFile.name;

        if (sentFile.type === "application/pdf") {
          body.fileBase64 = await fileToBase64(sentFile);
          body.parsedDocument = await parsePdfToJson(sentFile);
        } else {
          body.fileBase64 = await fileToBase64(sentFile);
        }
      }
      const { data, error } = await supabase.functions.invoke("analyze-exam", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages((p) => [
        ...p,
        { id: crypto.randomUUID(), role: "assistant", content: data.result || "Sin resultado" },
      ]);
    } catch (e: unknown) {
      const err = e as Error;
      toast.error(err.message || "Error analizando");
      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "❌ No pude responder. Intenta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">CANDY AI</h1>
                <p className="text-sm text-slate-600 font-medium">Análisis Médico Inteligente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-700">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-sky-100 to-cyan-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold">Asistente Médico IA</h2>
                <p className="text-slate-500 text-sm">Análisis inteligente de exámenes clínicos</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="h-[500px] overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white"
          >
            {messages.map((m, index) => (
              <div
                key={m.id}
                className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-500 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-md"
                      : "bg-white border border-slate-200 rounded-tl-md text-slate-900"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="text-slate-900 prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-p:my-2 prose-p:text-slate-800 prose-p:leading-relaxed prose-ul:my-2 prose-li:text-slate-800 prose-strong:text-slate-900 prose-strong:font-semibold">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm font-medium">{m.content}</p>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>Analizando tu examen...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
            {file && (
              <div className="mb-4 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Remover archivo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-3">
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="w-11 h-11 rounded-xl border-slate-300 hover:bg-slate-100 hover:border-blue-400 transition-all"
                aria-label="Adjuntar examen"
              >
                <Paperclip className="w-4 h-4 text-slate-600" />
              </Button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={file ? "Añade una pregunta específica..." : "Describe tu consulta médica o adjunta un examen..."}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <Button
                type="button"
                onClick={send}
                disabled={(!file && !text.trim()) || loading}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Información médica orientativa • Consulta siempre a un profesional de salud
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
