import React from "react";
import { Tv2, Monitor, Gamepad2, Usb, Radio, Sparkles, X } from "lucide-react";

interface SourceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (sourceKey: string, sourceName: string) => void;
}

export const SourceSelectorModal: React.FC<SourceSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectSource,
}) => {
  if (!isOpen) return null;

  const sources = [
    { key: "InputHDMI1", name: "HDMI 1 (Vídeo Game / Console)", icon: <Gamepad2 className="w-5 h-5 text-indigo-400" /> },
    { key: "InputHDMI2", name: "HDMI 2 (TV Box / Chromecast)", icon: <Monitor className="w-5 h-5 text-blue-400" /> },
    { key: "InputHDMI3", name: "HDMI 3 (Computador / PC)", icon: <Monitor className="w-5 h-5 text-cyan-400" /> },
    { key: "InputTuner", name: "TV Digital (Antena Aberta)", icon: <Tv2 className="w-5 h-5 text-emerald-400" /> },
    { key: "InputAV1", name: "AV / Vídeo Componente", icon: <Radio className="w-5 h-5 text-amber-400" /> },
    { key: "InputUSB", name: "USB Mídia (Fotos e Vídeos)", icon: <Usb className="w-5 h-5 text-purple-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Tv2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm text-slate-100">
              Selecionar Entrada de Vídeo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {sources.map((src) => (
            <button
              key={src.key}
              onClick={() => {
                onSelectSource(src.key, src.name);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-950 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/50 text-slate-200 font-semibold text-xs transition-all active:scale-98 shadow-md"
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                {src.icon}
              </div>
              <span className="truncate">{src.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
