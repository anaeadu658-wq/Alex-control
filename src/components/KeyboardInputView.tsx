import React, { useState } from "react";
import { Keyboard, Send, Search, Mic, Delete, Sparkles, Tv2 } from "lucide-react";

interface KeyboardInputViewProps {
  onSendTextToTv: (text: string) => void;
  onSendCommand: (cmd: string, label?: string) => void;
}

export const KeyboardInputView: React.FC<KeyboardInputViewProps> = ({
  onSendTextToTv,
  onSendCommand,
}) => {
  const [textInput, setTextInput] = useState("");
  const [isDictating, setIsDictating] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onSendTextToTv(textInput.trim());
      setTextInput("");
    }
  };

  const handleVoiceInput = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";

        recognition.onstart = () => setIsDictating(true);
        recognition.onend = () => setIsDictating(false);
        recognition.onerror = () => setIsDictating(false);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setTextInput(transcript);
            onSendTextToTv(transcript);
          }
        };

        recognition.start();
      } catch {
        setIsDictating(false);
      }
    } else {
      alert("Comando de voz não suportado diretamente neste navegador. Digite no campo abaixo.");
    }
  };

  const quickSearchPresets = [
    "YouTube Notícias ao vivo",
    "Netflix Filmes em 4K",
    "Globo Esporte hoje",
    "Sertanejo 2026",
    "Desenhos animados",
    "Podcasts mais ouvidos",
  ];

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-4 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-400" />
            Teclado & Digitação Remota
          </h2>
          <span className="text-[10px] text-blue-400 font-mono">Digitação Direta na TV</span>
        </div>

        {/* Text Input Form */}
        <form onSubmit={handleSend} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Digite o texto ou busca para a TV AOC..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3.5 pr-12 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
            {textInput && (
              <button
                type="button"
                onClick={() => setTextInput("")}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                <Delete className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                isDictating
                  ? "bg-red-600 border-red-500 text-white animate-pulse"
                  : "bg-slate-800 border-slate-700/60 text-slate-200 hover:bg-slate-700"
              }`}
              title="Falar busca por voz"
            >
              <Mic className={`w-4 h-4 ${isDictating ? "text-white" : "text-purple-400"}`} />
              <span>{isDictating ? "Ouvindo..." : "Voz"}</span>
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!textInput.trim()}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
                textInput.trim()
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400/40"
                  : "bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Enviar para a TV</span>
            </button>
          </div>
        </form>

        {/* Quick Search Preset Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Atalhos de Busca Rápida
          </p>

          <div className="flex flex-wrap gap-1.5">
            {quickSearchPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setTextInput(preset);
                  onSendTextToTv(preset);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-xs font-medium transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Essential Navigation Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onSendCommand("Search", "Abrir Busca na TV")}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Abrir Pesquisa TV</span>
          </button>
          <button
            onClick={() => onSendCommand("Enter", "Confirmar / Enter")}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Tv2 className="w-4 h-4 text-emerald-400" />
            <span>Apertar Enter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
