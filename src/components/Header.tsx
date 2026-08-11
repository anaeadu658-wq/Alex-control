import React, { useState } from "react";
import { TVDevice, RemoteTheme, UserSettings } from "../types";
import { 
  Tv, 
  Wifi, 
  WifiOff, 
  ChevronDown, 
  Plus, 
  Sliders, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Sun, 
  Moon, 
  Palette,
  Check,
  RefreshCw,
  Info
} from "lucide-react";

interface HeaderProps {
  activeTv: TVDevice | null;
  tvs: TVDevice[];
  settings: UserSettings;
  onSelectTv: (tvId: string) => void;
  onOpenSetup: () => void;
  onTogglePower: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  volume: number;
  onVolumeChange: (val: number) => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenAiAssist: () => void;
  isScanning: boolean;
  onScanWifi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTv,
  tvs,
  settings,
  onSelectTv,
  onOpenSetup,
  onTogglePower,
  onToggleMute,
  isMuted,
  volume,
  onVolumeChange,
  onUpdateSettings,
  onOpenAiAssist,
  isScanning,
  onScanWifi,
}) => {
  const [showTvDropdown, setShowTvDropdown] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const themeOptions: { id: RemoteTheme; name: string; color: string; desc: string }[] = [
    { id: "dark-titanium", name: "Titânio Escuro", color: "bg-slate-900 border-slate-700", desc: "Design minimalista e sofisticado" },
    { id: "obsidian-glass", name: "Obsidian Glass", color: "bg-zinc-950 border-cyan-500/50", desc: "Brilho suave com efeito neon acianado" },
    { id: "cyber-neon", name: "Cyber Neon", color: "bg-black border-purple-500", desc: "Estilo esportivo de alta visibilidade" },
    { id: "soft-light", name: "Minimalista Claro", color: "bg-gray-100 border-gray-300 text-gray-900", desc: "Ideal para ambientes bem iluminados" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 text-slate-100 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Logo & TV Dropdown */}
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-lg tracking-tight">
                L
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${activeTv?.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>

            <button
              onClick={() => setShowTvDropdown(!showTvDropdown)}
              className="flex flex-col text-left min-w-0 group focus:outline-none"
            >
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold tracking-wider uppercase">
                <span>Controle Leleco</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTvDropdown ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-sm font-bold truncate text-slate-100 group-hover:text-blue-300 transition-colors">
                {activeTv ? activeTv.name : "Nenhuma TV Selecionada"}
              </div>
            </button>
          </div>

          {/* TV Switcher Dropdown */}
          {showTvDropdown && (
            <div className="absolute top-12 left-0 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                <span>Dispositivos Conectados</span>
                <button
                  onClick={onScanWifi}
                  disabled={isScanning}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? "Procurando..." : "Escanear Wi-Fi"}
                </button>
              </div>

              <div className="py-1 max-h-56 overflow-y-auto space-y-1">
                {tvs.map((tv) => (
                  <button
                    key={tv.id}
                    onClick={() => {
                      onSelectTv(tv.id);
                      setShowTvDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                      activeTv?.id === tv.id
                        ? "bg-blue-600/20 border border-blue-500/40 text-blue-200"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Tv className={`w-4 h-4 shrink-0 ${activeTv?.id === tv.id ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{tv.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{tv.ip} • {tv.protocol}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tv.signal}% Wi-Fi
                      </span>
                      {activeTv?.id === tv.id && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-1 border-t border-slate-800 mt-1">
                <button
                  onClick={() => {
                    setShowTvDropdown(false);
                    onOpenSetup();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Nova TV AOC
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Help Assistant Button */}
          <button
            onClick={onOpenAiAssist}
            title="Assistente Leleco AI"
            className="p-2 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-purple-300 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-xs font-medium"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">IA Assist</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => setShowThemeModal(!showThemeModal)}
            title="Mudar Tema do Controle"
            className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
          >
            <Palette className="w-4 h-4 text-amber-400" />
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => onUpdateSettings({ deviceFrame: !settings.deviceFrame })}
            title={settings.deviceFrame ? "Modo Tela Cheia" : "Modo Dispositivo Celular"}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              settings.deviceFrame
                ? "bg-blue-600/30 border-blue-500 text-blue-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-slate-100">
                <Palette className="w-5 h-5 text-amber-400" />
                Estilo do Controle Remoto
              </h3>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {themeOptions.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    onUpdateSettings({ theme: th.id });
                    setShowThemeModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    settings.theme === th.id
                      ? "border-blue-500 bg-blue-600/20 text-white shadow-lg"
                      : "border-slate-800 hover:border-slate-700 bg-slate-800/60 text-slate-300"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm">{th.name}</p>
                    <p className="text-xs text-slate-400">{th.desc}</p>
                  </div>
                  {settings.theme === th.id && <Check className="w-5 h-5 text-blue-400" />}
                </button>
              ))}
            </div>

            {/* Sound & Haptics Toggles */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Vibração Háptica ao Tocar</span>
                <input
                  type="checkbox"
                  checked={settings.hapticEnabled}
                  onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Efeito Sonoro de Clique</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
