import React, { useState } from "react";
import { StreamingApp } from "../types";
import { 
  Grid, 
  Search, 
  Plus, 
  Tv, 
  Trash2, 
  Play, 
  Youtube, 
  Film, 
  Sparkles, 
  Music, 
  MonitorPlay, 
  Radio, 
  Gamepad2, 
  Flame, 
  Star 
} from "lucide-react";

interface StreamingHubProps {
  apps: StreamingApp[];
  onLaunchApp: (appId: string, appName: string) => void;
  onAddCustomApp: (app: Omit<StreamingApp, "id">) => void;
  onRemoveCustomApp: (id: string) => void;
}

export const StreamingHub: React.FC<StreamingHubProps> = ({
  apps,
  onLaunchApp,
  onAddCustomApp,
  onRemoveCustomApp,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [appName, setAppName] = useState("");
  const [appId, setAppId] = useState("");

  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (appName && appId) {
      onAddCustomApp({
        name: appName,
        appId: appId,
        icon: "Tv",
        color: "from-blue-600 to-purple-600",
        isCustom: true,
      });
      setAppName("");
      setAppId("");
      setShowAddModal(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Youtube": return <Youtube className="w-6 h-6 text-red-500" />;
      case "Film": return <Film className="w-6 h-6 text-purple-400" />;
      case "Sparkles": return <Sparkles className="w-6 h-6 text-blue-400" />;
      case "Music": return <Music className="w-6 h-6 text-emerald-400" />;
      case "MonitorPlay": return <MonitorPlay className="w-6 h-6 text-slate-300" />;
      case "Radio": return <Radio className="w-6 h-6 text-amber-400" />;
      case "Gamepad2": return <Gamepad2 className="w-6 h-6 text-purple-400" />;
      case "Flame": return <Flame className="w-6 h-6 text-orange-400" />;
      case "Star": return <Star className="w-6 h-6 text-yellow-400" />;
      default: return <Tv className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-5 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-400" />
              Central de Streaming AOC
            </h2>
            <p className="text-[11px] text-slate-400">Abra apps de streaming com 1 toque</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add App
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar aplicativo de streaming..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="group relative bg-slate-950 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-lg"
            >
              <button
                onClick={() => onLaunchApp(app.appId, app.name)}
                className="w-full text-left space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {getIcon(app.icon)}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 font-mono">
                    ID: {app.appId}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Play className="w-3 h-3 text-emerald-400" />
                    Iniciar na TV
                  </p>
                </div>
              </button>

              {app.isCustom && (
                <button
                  onClick={() => onRemoveCustomApp(app.id)}
                  className="absolute top-2 right-2 text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover aplicativo customizado"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom App Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateApp}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Adicionar App Personalizado
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">Nome do Aplicativo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: HBO Max ou IPTV"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Roku App ID / Código de Pacote</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 61322 ou com.example.app"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Adicionar App
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
