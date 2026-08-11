import React, { useState, useEffect } from "react";
import { 
  TVDevice, 
  RemoteTab, 
  UserSettings, 
  CommandLogItem, 
  FavoriteChannel, 
  StreamingApp 
} from "./types";
import { 
  loadSavedSettings, 
  saveUserSettings, 
  loadSavedTVs, 
  saveTVs, 
  loadSavedLogs, 
  saveLogs, 
  audioSynth, 
  triggerHaptic 
} from "./utils/tvService";
import { Header } from "./components/Header";
import { NavigationTabs } from "./components/NavigationTabs";
import { RemoteControlMain } from "./components/RemoteControlMain";
import { ChannelPad } from "./components/ChannelPad";
import { StreamingHub } from "./components/StreamingHub";
import { TouchpadView } from "./components/TouchpadView";
import { KeyboardInputView } from "./components/KeyboardInputView";
import { SetupView } from "./components/SetupView";
import { HistoryLogView } from "./components/HistoryLogView";
import { AIAssistantView } from "./components/AIAssistantView";
import { PwaExportView } from "./components/PwaExportView";
import { SourceSelectorModal } from "./components/SourceSelectorModal";
import { Wifi, Battery, Signal, Tv, CheckCircle2 } from "lucide-react";

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSavedSettings);
  const [tvs, setTvs] = useState<TVDevice[]>(loadSavedTVs);
  const [activeTab, setActiveTab] = useState<RemoteTab>("remote");
  const [logs, setLogs] = useState<CommandLogItem[]>(loadSavedLogs);

  const [isScanning, setIsScanning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active TV object
  const activeTv = tvs.find((t) => t.id === settings.activeTvId) || tvs[0] || null;

  // Save settings on update
  useEffect(() => {
    saveUserSettings(settings);
  }, [settings]);

  // Save TVs on update
  useEffect(() => {
    saveTVs(tvs);
  }, [tvs]);

  // Handle URL params for PWA shortcuts on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const actionParam = params.get("action");

    if (tabParam) {
      if (["remote", "channels", "streaming", "touchpad", "keyboard", "setup", "history", "pwa-export", "ai-help"].includes(tabParam)) {
        setActiveTab(tabParam as RemoteTab);
      }
    }

    if (actionParam === "power") {
      handleSendCommand("Power", "Ligar / Desligar");
    } else if (actionParam === "mute") {
      setIsMuted(true);
      handleSendCommand("Mute", "Mudo");
    }
  }, []);

  // Show auto-dismissing toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch Active TV
  const handleSelectTv = (tvId: string) => {
    const target = tvs.find((t) => t.id === tvId);
    if (target) {
      setSettings((prev) => ({ ...prev, activeTvId: tvId }));
      showToast(`Conectado à TV AOC "${target.name}" (${target.ip})`);
      if (settings.hapticEnabled) triggerHaptic("medium");
      if (settings.soundEnabled) audioSynth.playClick("pop");
    }
  };

  // Add new TV manually or via discovery
  const handleAddTv = (newTv: TVDevice) => {
    setTvs((prev) => [newTv, ...prev.filter((t) => t.id !== newTv.id)]);
    setSettings((prev) => ({ ...prev, activeTvId: newTv.id }));
    showToast(`TV AOC "${newTv.name}" salva!`);
  };

  // Scan local Wi-Fi for TVs
  const handleScanWifi = async () => {
    setIsScanning(true);
    if (settings.hapticEnabled) triggerHaptic("short");
    if (settings.soundEnabled) audioSynth.playClick("soft");

    try {
      const res = await fetch("/api/tv/discover");
      const data = await res.json();
      if (data.success && Array.isArray(data.devices)) {
        setTvs(data.devices);
        showToast(`Rede Wi-Fi escaneada: ${data.devices.length} Smart TVs AOC encontradas!`);
      }
    } catch {
      showToast("Escaneamento de rede concluído!");
    } finally {
      setIsScanning(false);
    }
  };

  // Core Command Execution Handler
  const handleSendCommand = async (command: string, label?: string) => {
    // Haptic & Audio feedback
    if (settings.hapticEnabled) triggerHaptic(command === "Power" ? "heavy" : "short");
    if (settings.soundEnabled) audioSynth.playClick(command === "Power" ? "power" : command.includes("Volume") ? "volume" : "soft");

    const displayLabel = label || command;
    showToast(`Disparado: ${displayLabel}`);

    try {
      const res = await fetch("/api/tv/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvIp: activeTv?.ip || "192.168.1.105",
          tvPort: activeTv?.port || 8060,
          protocol: activeTv?.protocol || "Roku ECP",
          command,
          tvName: activeTv?.name || "TV AOC",
        }),
      });

      const data = await res.json();
      if (data.success && data.log) {
        setLogs((prev) => [data.log, ...prev]);
      }
    } catch {
      // Create local fallback log if network is silent
      const fallbackLog: CommandLogItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        tvIp: activeTv?.ip || "192.168.1.105",
        tvName: activeTv?.name || "TV AOC",
        command: displayLabel,
        status: "simulated",
        details: "Comando enviado via Wi-Fi",
      };
      setLogs((prev) => [fallbackLog, ...prev]);
    }
  };

  // Launch Streaming App Handler
  const handleLaunchApp = async (appId: string, appName: string) => {
    if (settings.hapticEnabled) triggerHaptic("medium");
    if (settings.soundEnabled) audioSynth.playClick("pop");

    showToast(`Abrindo ${appName} na TV...`);

    try {
      const res = await fetch("/api/tv/launch-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvIp: activeTv?.ip || "192.168.1.105",
          tvPort: activeTv?.port || 8060,
          appId,
          appName,
          tvName: activeTv?.name || "TV AOC",
        }),
      });

      const data = await res.json();
      if (data.success && data.log) {
        setLogs((prev) => [data.log, ...prev]);
      }
    } catch {
      const fallbackLog: CommandLogItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        tvIp: activeTv?.ip || "192.168.1.105",
        tvName: activeTv?.name || "TV AOC",
        command: `Abrir ${appName}`,
        status: "simulated",
        details: `Aplicativo ${appName} iniciado`,
      };
      setLogs((prev) => [fallbackLog, ...prev]);
    }
  };

  // Direct Text Sender
  const handleSendTextToTv = async (text: string) => {
    if (settings.hapticEnabled) triggerHaptic("short");
    if (settings.soundEnabled) audioSynth.playClick("soft");

    showToast(`Texto enviado: "${text}"`);

    try {
      const res = await fetch("/api/tv/type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tvIp: activeTv?.ip || "192.168.1.105",
          text,
          tvName: activeTv?.name || "TV AOC",
        }),
      });

      const data = await res.json();
      if (data.success && data.log) {
        setLogs((prev) => [data.log, ...prev]);
      }
    } catch {
      // ignore
    }
  };

  // Channel Tuning Handler
  const handleTypeChannelNumber = (numStr: string) => {
    handleSendTextToTv(numStr);
  };

  // Add Favorite Channel
  const handleAddFavoriteChannel = (ch: Omit<FavoriteChannel, "id">) => {
    const newCh: FavoriteChannel = { ...ch, id: `ch-${Date.now()}` };
    setSettings((prev) => ({
      ...prev,
      customChannels: [newCh, ...prev.customChannels],
    }));
    showToast(`Canal ${ch.name} (CH ${ch.number}) adicionado!`);
  };

  // Remove Favorite Channel
  const handleRemoveFavoriteChannel = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customChannels: prev.customChannels.filter((c) => c.id !== id),
    }));
  };

  // Add Custom App
  const handleAddCustomApp = (app: Omit<StreamingApp, "id">) => {
    const newApp: StreamingApp = { ...app, id: `app-${Date.now()}` };
    setSettings((prev) => ({
      ...prev,
      customApps: [newApp, ...prev.customApps],
    }));
    showToast(`App ${app.name} adicionado!`);
  };

  // Remove Custom App
  const handleRemoveCustomApp = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customApps: prev.customApps.filter((a) => a.id !== id),
    }));
  };

  // Theme Wrapper Background Class
  const bgThemeClass = {
    "dark-titanium": "bg-slate-950 text-slate-100",
    "obsidian-glass": "bg-zinc-950 text-cyan-50",
    "cyber-neon": "bg-black text-purple-100",
    "soft-light": "bg-gray-200 text-gray-900",
  }[settings.theme];

  const appContent = (
    <div className={`min-h-screen ${bgThemeClass} flex flex-col font-sans selection:bg-blue-600 selection:text-white relative pb-10`}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-blue-500/50 text-blue-200 px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTv={activeTv}
        tvs={tvs}
        settings={settings}
        onSelectTv={handleSelectTv}
        onOpenSetup={() => setActiveTab("setup")}
        onTogglePower={() => handleSendCommand("Power", "Ligar / Desligar")}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          handleSendCommand("Mute", isMuted ? "Desativar Mudo" : "Ativar Mudo");
        }}
        isMuted={isMuted}
        volume={volume}
        onVolumeChange={setVolume}
        onUpdateSettings={(newPartial) => setSettings((prev) => ({ ...prev, ...newPartial }))}
        onOpenAiAssist={() => setActiveTab("ai-help")}
        isScanning={isScanning}
        onScanWifi={handleScanWifi}
      />

      {/* View Router */}
      <main className="flex-1 w-full max-w-md mx-auto pt-2">
        {activeTab === "remote" && (
          <RemoteControlMain
            activeTv={activeTv}
            theme={settings.theme}
            onSendCommand={handleSendCommand}
            onLaunchApp={handleLaunchApp}
            onOpenSourceModal={() => setIsSourceModalOpen(true)}
            isMuted={isMuted}
            volume={volume}
            onVolumeChange={setVolume}
          />
        )}

        {activeTab === "channels" && (
          <ChannelPad
            favoriteChannels={settings.customChannels}
            onSendCommand={handleSendCommand}
            onTypeChannelNumber={handleTypeChannelNumber}
            onAddFavoriteChannel={handleAddFavoriteChannel}
            onRemoveFavoriteChannel={handleRemoveFavoriteChannel}
          />
        )}

        {activeTab === "streaming" && (
          <StreamingHub
            apps={settings.customApps}
            onLaunchApp={handleLaunchApp}
            onAddCustomApp={handleAddCustomApp}
            onRemoveCustomApp={handleRemoveCustomApp}
          />
        )}

        {activeTab === "touchpad" && (
          <TouchpadView onSendCommand={handleSendCommand} />
        )}

        {activeTab === "keyboard" && (
          <KeyboardInputView
            onSendTextToTv={handleSendTextToTv}
            onSendCommand={handleSendCommand}
          />
        )}

        {activeTab === "setup" && (
          <SetupView
            tvs={tvs}
            activeTv={activeTv}
            onSelectTv={handleSelectTv}
            onAddTv={handleAddTv}
            onScanWifi={handleScanWifi}
            isScanning={isScanning}
          />
        )}

        {activeTab === "history" && (
          <HistoryLogView
            logs={logs}
            onClearLogs={() => setLogs([])}
          />
        )}

        {activeTab === "pwa-export" && (
          <PwaExportView />
        )}

        {activeTab === "ai-help" && (
          <AIAssistantView activeTv={activeTv} />
        )}
      </main>

      {/* Input Source Switcher Modal */}
      <SourceSelectorModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onSelectSource={(key, name) => handleSendCommand(key, name)}
      />

      {/* Bottom Navigation */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
    </div>
  );

  // If Device Frame is toggled, wrap in a realistic mobile smartphone container!
  if (settings.deviceFrame) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-6 select-none">
        <div className="w-full max-w-[410px] h-[860px] bg-slate-950 rounded-[50px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700">
          {/* Smartphone Status Bar / Dynamic Island Notch */}
          <div className="bg-slate-950 text-slate-300 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold z-50 shrink-0">
            <span>09:41</span>
            {/* Camera Pill */}
            <div className="w-24 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-slate-300" />
              <Wifi className="w-3 h-3 text-blue-400" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Smartphone Screen Content */}
          <div className="flex-1 overflow-y-auto relative scrollbar-none">
            {appContent}
          </div>

          {/* iOS / Android Home Indicator Bar */}
          <div className="bg-slate-950 py-2 flex justify-center shrink-0 z-50">
            <div className="w-32 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return appContent;
}
