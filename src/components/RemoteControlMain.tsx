import React, { useState } from "react";
import { TVDevice, RemoteTheme } from "../types";
import { 
  Power, 
  Volume2, 
  VolumeX, 
  Volume1, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  ArrowLeft, 
  Menu, 
  Info, 
  Tv2, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Square, 
  SlidersHorizontal,
  MonitorPlay,
  Sparkles,
  Search,
  Captions,
  Radio
} from "lucide-react";

interface RemoteControlMainProps {
  activeTv: TVDevice | null;
  theme: RemoteTheme;
  onSendCommand: (command: string, label?: string) => void;
  onLaunchApp: (appId: string, appName: string) => void;
  onOpenSourceModal: () => void;
  isMuted: boolean;
  volume: number;
  onVolumeChange: (newVol: number) => void;
}

export const RemoteControlMain: React.FC<RemoteControlMainProps> = ({
  activeTv,
  theme,
  onSendCommand,
  onLaunchApp,
  onOpenSourceModal,
  isMuted,
  volume,
  onVolumeChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Theme-dependent button container styling
  const themeStyles = {
    "dark-titanium": "bg-slate-900/90 border-slate-800 text-slate-100 shadow-2xl",
    "obsidian-glass": "bg-zinc-950/95 border-cyan-900/50 text-cyan-50 shadow-cyan-950/40",
    "cyber-neon": "bg-black border-purple-900/80 text-purple-100 shadow-purple-950/50",
    "soft-light": "bg-gray-100 border-gray-300 text-gray-900 shadow-xl",
  }[theme];

  const buttonBase = "relative flex items-center justify-center font-bold transition-all duration-150 active:scale-95 focus:outline-none select-none";

  const btnSecondary = theme === "soft-light"
    ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 shadow-sm"
    : "bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:bg-slate-700 hover:text-white shadow-md shadow-black/20";

  const btnAccent = "bg-gradient-to-b from-blue-600 to-indigo-700 text-white border border-blue-400/40 shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-600";

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-5 animate-in fade-in duration-300">
      {/* Remote Outer Body Container */}
      <div className={`p-5 rounded-[2.5rem] border ${themeStyles} space-y-6 relative overflow-hidden backdrop-blur-2xl`}>
        {/* Subtle Decorative Remote Gloss Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-full" />

        {/* Brand & Model Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              AOC SMART REMOTE
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeTv ? activeTv.ip : "192.168.1.105"}</span>
          </div>
        </div>

        {/* 1. TOP POWER & SOURCE CONTROLS */}
        <div className="flex items-center justify-between gap-3">
          {/* Mute Button */}
          <button
            onClick={() => {
              onSendCommand("Mute", "Mudo");
            }}
            className={`${buttonBase} w-13 h-13 rounded-2xl ${
              isMuted ? "bg-amber-600/30 border border-amber-500 text-amber-400" : btnSecondary
            }`}
            title="Mudo"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-amber-400" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Source / Entrada Input Selector */}
          <button
            onClick={onOpenSourceModal}
            className={`${buttonBase} px-4 h-13 rounded-2xl ${btnSecondary} flex items-center gap-2 text-xs font-semibold`}
            title="Mudar Entrada / HDMI"
          >
            <Tv2 className="w-4 h-4 text-blue-400" />
            <span>Entrada / HDMI</span>
          </button>

          {/* Red Power Button */}
          <button
            onClick={() => onSendCommand("Power", "Ligar / Desligar")}
            className={`${buttonBase} w-13 h-13 rounded-2xl bg-gradient-to-b from-red-600 to-rose-700 text-white border border-red-400/50 shadow-lg shadow-red-600/40 hover:from-red-500 hover:to-rose-600`}
            title="Ligar / Desligar TV AOC"
          >
            <Power className="w-6 h-6" />
          </button>
        </div>

        {/* 2. VOLUME & CHANNEL ROCKER CONTROLS */}
        <div className="grid grid-cols-2 gap-4">
          {/* Volume Control Rocker */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <button
              onClick={() => {
                onSendCommand("VolumeUp", "Volume +");
                onVolumeChange(Math.min(100, volume + 5));
              }}
              className={`${buttonBase} w-full py-2.5 rounded-xl ${btnSecondary}`}
              title="Aumentar Volume"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="text-center py-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">VOL</span>
              <p className="text-sm font-black text-blue-400">{volume}%</p>
            </div>
            <button
              onClick={() => {
                onSendCommand("VolumeDown", "Volume -");
                onVolumeChange(Math.max(0, volume - 5));
              }}
              className={`${buttonBase} w-full py-2.5 rounded-xl ${btnSecondary}`}
              title="Diminuir Volume"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Channel Control Rocker */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <button
              onClick={() => onSendCommand("ChannelUp", "Canal +")}
              className={`${buttonBase} w-full py-2.5 rounded-xl ${btnSecondary}`}
              title="Canal Anterio / Próximo"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="text-center py-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CANAL</span>
              <p className="text-xs font-bold text-slate-300">CH +/-</p>
            </div>
            <button
              onClick={() => onSendCommand("ChannelDown", "Canal -")}
              className={`${buttonBase} w-full py-2.5 rounded-xl ${btnSecondary}`}
              title="Canal Anterior"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. D-PAD DIRECTIONAL WHEEL */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="relative w-56 h-56 rounded-full bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center p-2">
            {/* D-Pad Up */}
            <button
              onClick={() => onSendCommand("Up", "Seta Cima")}
              className={`${buttonBase} absolute top-2 w-16 h-14 rounded-t-full hover:bg-slate-800/80 text-slate-200 active:text-blue-400 flex items-center justify-center`}
              title="Cima"
            >
              <ChevronUp className="w-7 h-7" />
            </button>

            {/* D-Pad Left */}
            <button
              onClick={() => onSendCommand("Left", "Seta Esquerda")}
              className={`${buttonBase} absolute left-2 w-14 h-16 rounded-l-full hover:bg-slate-800/80 text-slate-200 active:text-blue-400 flex items-center justify-center`}
              title="Esquerda"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Center OK / Select Button */}
            <button
              onClick={() => onSendCommand("Select", "OK / Selecionar")}
              className={`${buttonBase} w-20 h-20 rounded-full ${btnAccent} font-black text-sm tracking-wider shadow-inner flex items-center justify-center`}
              title="OK / Selecionar"
            >
              OK
            </button>

            {/* D-Pad Right */}
            <button
              onClick={() => onSendCommand("Right", "Seta Direita")}
              className={`${buttonBase} absolute right-2 w-14 h-16 rounded-r-full hover:bg-slate-800/80 text-slate-200 active:text-blue-400 flex items-center justify-center`}
              title="Direita"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* D-Pad Down */}
            <button
              onClick={() => onSendCommand("Down", "Seta Baixo")}
              className={`${buttonBase} absolute bottom-2 w-16 h-14 rounded-b-full hover:bg-slate-800/80 text-slate-200 active:text-blue-400 flex items-center justify-center`}
              title="Baixo"
            >
              <ChevronDown className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* 4. AOC SYSTEM NAVIGATION ROW (Back, Home, Options, Info) */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onSendCommand("Back", "Voltar")}
            className={`${buttonBase} py-3 rounded-2xl ${btnSecondary} flex flex-col items-center gap-1 text-[10px]`}
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
            <span>Voltar</span>
          </button>

          <button
            onClick={() => onSendCommand("Home", "Início / Home")}
            className={`${buttonBase} py-3 rounded-2xl ${btnAccent} flex flex-col items-center gap-1 text-[10px]`}
            title="Início / Home"
          >
            <Home className="w-5 h-5 text-white" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSendCommand("Option", "Opções / Menu")}
            className={`${buttonBase} py-3 rounded-2xl ${btnSecondary} flex flex-col items-center gap-1 text-[10px]`}
            title="Opções"
          >
            <Menu className="w-5 h-5 text-slate-300" />
            <span>Opções</span>
          </button>

          <button
            onClick={() => onSendCommand("Info", "Informações / Guia")}
            className={`${buttonBase} py-3 rounded-2xl ${btnSecondary} flex flex-col items-center gap-1 text-[10px]`}
            title="Info / Guia TV"
          >
            <Info className="w-5 h-5 text-slate-300" />
            <span>Info</span>
          </button>
        </div>

        {/* 5. DIRECT STREAMING QUICK HOTKEYS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Atalhos Rápidos de Streaming</span>
            <span className="text-blue-400 text-[10px]">1-Toque</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onLaunchApp("12", "Netflix")}
              className={`${buttonBase} p-2.5 rounded-xl bg-red-950/80 border border-red-700/60 text-red-100 hover:bg-red-900 transition-all shadow-md flex flex-col items-center justify-center`}
              title="Abrir Netflix"
            >
              <span className="font-black text-xs tracking-tight text-red-500">NETFLIX</span>
            </button>

            <button
              onClick={() => onLaunchApp("13", "YouTube")}
              className={`${buttonBase} p-2.5 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-100 hover:bg-rose-900 transition-all shadow-md flex flex-col items-center justify-center`}
              title="Abrir YouTube"
            >
              <span className="font-black text-xs tracking-tight text-rose-400">YouTube</span>
            </button>

            <button
              onClick={() => onLaunchApp("2285", "Prime Video")}
              className={`${buttonBase} p-2.5 rounded-xl bg-sky-950/80 border border-sky-700/60 text-sky-100 hover:bg-sky-900 transition-all shadow-md flex flex-col items-center justify-center`}
              title="Abrir Prime Video"
            >
              <span className="font-black text-xs tracking-tight text-sky-400">prime</span>
            </button>

            <button
              onClick={() => onLaunchApp("18444", "Globoplay")}
              className={`${buttonBase} p-2.5 rounded-xl bg-pink-950/80 border border-pink-700/60 text-pink-100 hover:bg-pink-900 transition-all shadow-md flex flex-col items-center justify-center`}
              title="Abrir Globoplay"
            >
              <span className="font-bold text-[11px] tracking-tight text-pink-400">globoplay</span>
            </button>
          </div>
        </div>

        {/* 6. MEDIA PLAYBACK CONTROLS */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onSendCommand("Rew", "Retroceder")}
              className={`${buttonBase} py-2.5 rounded-xl ${btnSecondary}`}
              title="Voltar 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                onSendCommand("Play", isPlaying ? "Pausar" : "Reproduzir");
              }}
              className={`${buttonBase} py-2.5 rounded-xl ${btnAccent}`}
              title="Play / Pause"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onSendCommand("Fwd", "Avançar")}
              className={`${buttonBase} py-2.5 rounded-xl ${btnSecondary}`}
              title="Avançar 10s"
            >
              <FastForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSendCommand("ClosedCaptions", "Legendas / CC")}
              className={`${buttonBase} py-2.5 rounded-xl ${btnSecondary}`}
              title="Legendas"
            >
              <Captions className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* 7. COLOR BUTTONS (R/G/Y/B) */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => onSendCommand("Red", "Botão Vermelho")}
            className="h-3 rounded-full bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 active:scale-95 transition-transform"
            title="Ação Vermelho"
          />
          <button
            onClick={() => onSendCommand("Green", "Botão Verde")}
            className="h-3 rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 active:scale-95 transition-transform"
            title="Ação Verde"
          />
          <button
            onClick={() => onSendCommand("Yellow", "Botão Amarelo")}
            className="h-3 rounded-full bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/30 active:scale-95 transition-transform"
            title="Ação Amarelo"
          />
          <button
            onClick={() => onSendCommand("Blue", "Botão Azul")}
            className="h-3 rounded-full bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 active:scale-95 transition-transform"
            title="Ação Azul"
          />
        </div>
      </div>
    </div>
  );
};
