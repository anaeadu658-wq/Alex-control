import React, { useState } from "react";
import { TVDevice } from "../types";
import { Sparkles, Send, Bot, User, Tv, HelpCircle, CheckCircle, RefreshCw } from "lucide-react";

interface AIAssistantViewProps {
  activeTv: TVDevice | null;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ activeTv }) => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string }>>([
    {
      role: "bot",
      text: "Olá! Sou o **Assistente Leleco AI**. Como posso ajudar você a conectar ou controlar sua Smart TV AOC hoje?",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "Como permitir o controle remoto por app na TV AOC Roku?",
    "Minha TV AOC não aparece na busca Wi-Fi, o que fazer?",
    "Como encontrar o IP da minha Smart TV AOC?",
    "Qual porta usar para TV AOC Android ou NetCast?",
  ];

  const handleAsk = async (queryText?: string) => {
    const prompt = queryText || inputQuery;
    if (!prompt.trim() || isLoading) return;

    const userMsg = { role: "user" as const, text: prompt.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/troubleshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          tvModel: activeTv?.model || "AOC Roku TV 50U6305",
          tvIp: activeTv?.ip || "192.168.1.105",
          issueType: "Conexão Wi-Fi",
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Certifique-se de que a TV AOC e seu celular estão na mesma rede Wi-Fi (sem isolamento de AP no roteador) e ative a opção de Controle por App nas configurações da TV.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Para solucionar problemas de conexão Wi-Fi:\n1. Reinicie a TV e o roteador.\n2. Verifique se o IP informado bate com o menu de Rede da TV AOC.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-4 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Assistente Leleco AI
              </h2>
              <p className="text-[10px] text-purple-300 font-medium">Suporte para Smart TVs AOC</p>
            </div>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">
            Gemini AI
          </span>
        </div>

        {/* Quick Sample Questions */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Perguntas Frequentes:</p>
          <div className="flex flex-col gap-1.5">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                className="text-left p-2 rounded-xl bg-slate-950 hover:bg-purple-900/20 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 text-xs font-medium transition-all"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin pt-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`p-1.5 rounded-xl shrink-0 ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-purple-300 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
              <span>Gerando resposta de ajuda com Inteligência Artificial...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex gap-2 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            placeholder="Dúvida sobre sua TV AOC..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
