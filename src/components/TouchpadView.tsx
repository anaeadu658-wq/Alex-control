import React, { useState, useRef } from "react";
import { MousePointer, Move, Volume2, ChevronUp, ChevronDown, MousePointerClick } from "lucide-react";

interface TouchpadViewProps {
  onSendCommand: (cmd: string, label?: string) => void;
}

export const TouchpadView: React.FC<TouchpadViewProps> = ({ onSendCommand }) => {
  const [touchStatus, setTouchStatus] = useState("Deslize no pad para mover o ponteiro na TV");
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    setTouchStatus("Movendo cursor na TV AOC...");
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStartRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;

    // Update internal pointer position visually
    setCursorPos((prev) => ({
      x: Math.max(10, Math.min(90, prev.x + dx * 0.15)),
      y: Math.max(10, Math.min(90, prev.y + dy * 0.15)),
    }));

    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const duration = Date.now() - touchStartRef.current.time;

    if (duration < 250) {
      // Tap considered as SELECT / CLICK
      onSendCommand("Select", "Clique com o Touchpad");
      setTouchStatus("Clique (OK) registrado na TV!");
    } else {
      setTouchStatus("Aguardando novo gesto...");
    }
    touchStartRef.current = null;
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-4 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-400" />
            Mouse Virtual & Trackpad
          </h2>
          <span className="text-[10px] text-blue-400 font-mono">Gestos de Navegação</span>
        </div>

        {/* Touchpad Canvas Box */}
        <div
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800/90 rounded-3xl cursor-crosshair overflow-hidden shadow-inner flex flex-col items-center justify-center p-4 touch-none select-none group"
        >
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

          {/* Simulated Cursor Target Indicator */}
          <div
            className="absolute w-8 h-8 rounded-full border-2 border-blue-400/80 bg-blue-500/20 backdrop-blur-xs flex items-center justify-center transition-all duration-75 pointer-events-none shadow-lg shadow-blue-500/30"
            style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
          </div>

          <div className="text-center space-y-1 z-10 pointer-events-none">
            <Move className="w-8 h-8 text-blue-400/60 mx-auto animate-bounce" />
            <p className="text-xs font-semibold text-slate-300">{touchStatus}</p>
            <p className="text-[10px] text-slate-500">Toque 1x para Clicar • Arraste para Mover</p>
          </div>
        </div>

        {/* Mouse Click Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSendCommand("Select", "Clique Esquerdo")}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <MousePointerClick className="w-4 h-4 text-blue-400" />
            <span>Clique OK</span>
          </button>

          <button
            onClick={() => onSendCommand("Back", "Voltar")}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <span>Botão Voltar</span>
          </button>
        </div>

        {/* Quick Scroll / Page Up & Down */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onSendCommand("Up", "Rolar Para Cima")}
            className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1"
          >
            <ChevronUp className="w-4 h-4 text-blue-400" />
            <span>Rolar Cima</span>
          </button>
          <button
            onClick={() => onSendCommand("Down", "Rolar Para Baixo")}
            className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1"
          >
            <ChevronDown className="w-4 h-4 text-blue-400" />
            <span>Rolar Baixo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
