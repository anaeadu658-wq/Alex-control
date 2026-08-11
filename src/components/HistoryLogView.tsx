import React from "react";
import { CommandLogItem } from "../types";
import { History, CheckCircle, AlertCircle, Radio, Trash2 } from "lucide-react";

interface HistoryLogViewProps {
  logs: CommandLogItem[];
  onClearLogs: () => void;
}

export const HistoryLogView: React.FC<HistoryLogViewProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-4 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              Histórico de Comandos Enviados
            </h2>
            <p className="text-[11px] text-slate-400">Log em tempo real de requisições enviadas à TV</p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 space-y-2 text-slate-500">
            <Radio className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
            <p className="text-xs">Nenhum comando enviado recentemente.</p>
            <p className="text-[10px]">Utilize os botões do controle para ver o histórico aqui.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-2"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-blue-300 truncate">{log.command}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {log.tvName} ({log.tvIp})
                  </p>
                  {log.details && (
                    <p className="text-[9px] font-mono text-slate-500 truncate">{log.details}</p>
                  )}
                </div>

                <div className="shrink-0 pt-0.5">
                  {log.status === "success" ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 200 OK
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1">
                      <Radio className="w-3 h-3" /> Wi-Fi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
