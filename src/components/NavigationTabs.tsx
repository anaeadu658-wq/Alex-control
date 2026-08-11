import React from "react";
import { RemoteTab } from "../types";
import { 
  Tv, 
  Hash, 
  Grid, 
  MousePointer, 
  Keyboard, 
  Settings, 
  History, 
  Sparkles,
  Smartphone
} from "lucide-react";

interface NavigationTabsProps {
  activeTab: RemoteTab;
  onSelectTab: (tab: RemoteTab) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: RemoteTab; label: string; icon: React.ReactNode }[] = [
    { id: "remote", label: "Controle", icon: <Tv className="w-5 h-5" /> },
    { id: "setup", label: "IP Wi-Fi", icon: <Settings className="w-5 h-5 text-blue-400" /> },
    { id: "channels", label: "Canais", icon: <Hash className="w-5 h-5" /> },
    { id: "streaming", label: "Apps", icon: <Grid className="w-5 h-5" /> },
    { id: "touchpad", label: "Mouse", icon: <MousePointer className="w-5 h-5" /> },
    { id: "pwa-export", label: "Baixar APK", icon: <Smartphone className="w-5 h-5 text-emerald-400 animate-pulse" /> },
    { id: "history", label: "Logs", icon: <History className="w-5 h-5" /> },
    { id: "ai-help", label: "IA Ajuda", icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 text-slate-400">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1 overflow-x-auto scrollbar-none py-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1 rounded-2xl transition-all duration-200 focus:outline-none ${
                isActive
                  ? "text-blue-400 bg-blue-600/15 border border-blue-500/30 scale-105 shadow-md shadow-blue-500/10 font-bold"
                  : "hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className={`p-1 rounded-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] font-medium tracking-tight whitespace-nowrap mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
