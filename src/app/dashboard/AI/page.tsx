"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Paperclip, Send, Sparkles, Loader2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import HumanSilhouette from "@/components/HumanSilhouette";
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
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setMousePosition(prev => ({ ...prev, active: false }));
  };

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
    <main 
      className="relative h-screen overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col lg:flex-row gap-6 px-4 py-6">
        {/* Silhouette Panel - Visible only on large screens */}
        <div className="hidden lg:flex lg:w-1/3 flex-col justify-center items-center bg-slate-50/50 rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="relative w-full h-[600px]">
            <HumanSilhouette mousePosition={mousePosition} />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-lg font-bold text-slate-900">Mapa de Salud</h2>
            <p className="text-sm text-slate-500">Visualización interactiva de tu análisis anatómico</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900">Asistente Médico IA</h1>
              <p className="text-xs text-slate-500">Entiende tus exámenes en lenguaje humano</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 md:inline">
            En línea
          </span>
        </header>

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="relative flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-4 backdrop-blur-md md:p-6"
        >
          <div className="relative z-10 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              {m.role === "assistant" && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm backdrop-blur-md ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-white text-slate-900 border border-slate-200 rounded-tl-sm"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm font-medium">{m.content}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Leyendo tu examen...
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Input bar */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg backdrop-blur-xl">
          {file && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="flex-1 truncate font-medium">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</span>
              <button
                onClick={() => setFile(null)}
                className="rounded-full p-1 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Quitar archivo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
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
              className="shrink-0 rounded-xl"
              aria-label="Adjuntar examen"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
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
              placeholder={file ? "Añade un mensaje (opcional)..." : "Escribe tu mensaje o adjunta un examen..."}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <Button
              type="button"
              onClick={send}
              disabled={(!file && !text.trim()) || loading}
              className="shrink-0 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              aria-label="Enviar"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 px-1 text-[11px] text-muted-foreground">
            ⚕️ La IA orienta, pero no reemplaza al médico.
          </p>
        </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
