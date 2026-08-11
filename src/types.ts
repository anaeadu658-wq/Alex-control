export type ProtocolType = "Roku ECP" | "AOC Smart NetCast" | "Android TV Remote" | "Universal IR/Wi-Fi";

export interface StreamingApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  appId: string;
  isCustom?: boolean;
}

export interface TVDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  ip: string;
  mac: string;
  protocol: ProtocolType;
  port: number;
  status: "online" | "offline" | "connecting";
  signal: number;
  isFavorite?: boolean;
  apps?: StreamingApp[];
  lastConnected?: string;
}

export interface FavoriteChannel {
  id: string;
  number: string;
  name: string;
  category: string;
  color: string;
}

export interface CommandLogItem {
  id: string;
  timestamp: string;
  tvIp: string;
  tvName: string;
  command: string;
  status: "success" | "failed" | "simulated";
  details?: string;
}

export type RemoteTheme = "dark-titanium" | "obsidian-glass" | "cyber-neon" | "soft-light";

export type RemoteTab = 
  | "remote" 
  | "channels" 
  | "streaming" 
  | "touchpad" 
  | "keyboard" 
  | "setup" 
  | "history" 
  | "pwa-export"
  | "ai-help";

export interface UserSettings {
  hapticEnabled: boolean;
  soundEnabled: boolean;
  theme: RemoteTheme;
  deviceFrame: boolean;
  activeTvId: string | null;
  volumeStep: number;
  customChannels: FavoriteChannel[];
  customApps: StreamingApp[];
}
