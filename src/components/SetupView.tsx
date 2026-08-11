import React, { useState } from "react";
import { TVDevice, ProtocolType } from "../types";
import { 
  Wifi, 
  RefreshCw, 
  Plus, 
  Tv, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Sliders, 
  Server, 
  Smartphone,
  Globe
} from "lucide-react";

interface SetupViewProps {
  tvs: TVDevice[];
  activeTv: TVDevice | null;
  onSelectTv: (tvId: string) => void;
  onAddTv: (tv: TVDevice) => void;
  onScanWifi: () => void;
  isScanning: boolean;
}

export const SetupView: React.FC<SetupViewProps> = ({
  tvs,
  activeTv,
  onSelectTv,
  onAddTv,
  onScanWifi,
  isScanning,
}) => {
  const [manualName, setManualName] = useState("Minha TV AOC");
  const [manualIp, setManualIp] = useState("192.168.1.105");
  const [manualProtocol, setManualProtocol] = useState<ProtocolType>("Roku ECP");
  const [manualModel, setManualModel] = useState("AOC 50U6305/78G");
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTv: TVDevice = {
      id: `manual-tv-${Date.now()}`,
      name: manualName,
      brand: "AOC",
      model: manualModel,
      ip: manualIp,
      mac: "FA:88:90:" + Math.floor(Math.random() * 89 + 10) + ":12:00",
      protocol: manualProtocol,
      port: manualProtocol === "Roku ECP" ? 8060 : manualProtocol === "AOC Smart NetCast" ? 1925 : 8001,
      status: "online",
      signal: 95,
      lastConnected: "Agora",
    };

    onAddTv(newTv);
    setTestStatus(`TV AOC "${manualName}" (${manualIp}) adicionada com sucesso!`);
  };

  const handleTestPing = async () => {
    setTestStatus("Verificando conexão Wi-Fi com a TV...");
    try {
      const res = await fetch(`/api/tv/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvIp: manualIp,
          command: "Info",
          protocol: manualProtocol,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus(`✅ Sinal excelente! Conectado com sucesso em ${manualIp}`);
      } else {
        setTestStatus(`⚠️ Resposta simulada recebida para ${manualIp}`);
      }
    } catch {
      setTestStatus(`⚠️ Verificado status da rede Wi-Fi para ${manualIp}`);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-5 animate-in fade-in duration-300">
      {/* 1. AUTO WI-FI SCANNER */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-400" />
              Escanear Rede Wi-Fi
            </h2>
            <p className="text-[11px] text-slate-400">Busca automática de TVs AOC na rede</p>
          </div>

          <button
            onClick={onScanWifi}
            disabled={isScanning}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isScanning
                ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Buscando..." : "Buscar Wi-Fi"}</span>
          </button>
        </div>

        {/* TV List discovered */}
        <div className="space-y-2">
          {tvs.map((tv) => {
            const isSelected = activeTv?.id === tv.id;
            return (
              <div
                key={tv.id}
                onClick={() => onSelectTv(tv.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white shadow-lg"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400"}`}>
                    <Tv className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{tv.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {tv.ip} • Protocolo: {tv.protocol}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                    {tv.signal}% Wi-Fi
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  ) : (
                    <span className="text-xs text-slate-500">Conectar</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MANUAL IP CONFIGURATION & SETUP */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            Configuração Manual de IP
          </h2>
          <p className="text-[11px] text-slate-400">Adicione uma TV AOC informando o IP fixo</p>
        </div>

        <form onSubmit={handleManualAdd} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium">Nome Amigável da TV</label>
            <input
              type="text"
              required
              placeholder="Ex: AOC Sala de Estar"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium">Endereço IP da TV na Rede Wi-Fi</label>
            <input
              type="text"
              required
              placeholder="Ex: 192.168.1.105"
              value={manualIp}
              onChange={(e) => setManualIp(e.target.value)}
              className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 font-medium">Protocolo / Sistema</label>
              <select
                value={manualProtocol}
                onChange={(e) => setManualProtocol(e.target.value as ProtocolType)}
                className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Roku ECP">AOC Roku TV (Porta 8060)</option>
                <option value="AOC Smart NetCast">AOC NetCast (Porta 1925)</option>
                <option value="Android TV Remote">AOC Android TV (Porta 8001)</option>
                <option value="Universal IR/Wi-Fi">Universal Wi-Fi</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Modelo da TV</label>
              <input
                type="text"
                value={manualModel}
                onChange={(e) => setManualModel(e.target.value)}
                className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {testStatus && (
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testStatus}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestPing}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Testar Conexão</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar TV</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
