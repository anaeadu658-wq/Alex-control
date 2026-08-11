import { TVDevice, FavoriteChannel, StreamingApp, UserSettings, CommandLogItem } from "../types";

export const DEFAULT_TVS: TVDevice[] = [
  {
    id: "aoc-roku-50-sala",
    name: "TV AOC 50\" Roku 4K (Sala)",
    brand: "AOC",
    model: "AOC 50U6305/78G",
    ip: "192.168.1.105",
    mac: "B4:E6:2D:88:41:09",
    protocol: "Roku ECP",
    port: 8060,
    status: "online",
    signal: 94,
    isFavorite: true,
    lastConnected: "Agora",
  },
  {
    id: "aoc-smart-43-quarto",
    name: "TV AOC 43\" Smart Full HD (Quarto)",
    brand: "AOC",
    model: "AOC 43S5195/78G",
    ip: "192.168.1.112",
    mac: "A0:13:B5:12:F4:99",
    protocol: "AOC Smart NetCast",
    port: 1925,
    status: "online",
    signal: 88,
    isFavorite: false,
    lastConnected: "Hoje 08:30",
  },
  {
    id: "aoc-android-55-leleco",
    name: "AOC Leleco Master 55\" Android TV",
    brand: "AOC",
    model: "AOC 55U6295",
    ip: "192.168.1.120",
    mac: "00:1A:79:8F:33:10",
    protocol: "Android TV Remote",
    port: 8001,
    status: "online",
    signal: 98,
    isFavorite: false,
    lastConnected: "Ontem",
  },
];

export const DEFAULT_FAVORITE_CHANNELS: FavoriteChannel[] = [
  { id: "1", number: "5", name: "Globo HD", category: "Aberta", color: "from-blue-600 to-indigo-600" },
  { id: "2", number: "4", name: "SBT HD", category: "Aberta", color: "from-amber-500 to-red-600" },
  { id: "3", number: "7", name: "Record TV", category: "Aberta", color: "from-emerald-600 to-teal-600" },
  { id: "4", number: "13", name: "Band", category: "Aberta", color: "from-yellow-500 to-orange-600" },
  { id: "5", number: "39", name: "SporTV 1", category: "Esportes", color: "from-cyan-600 to-blue-700" },
  { id: "6", number: "70", name: "ESPN Brasil", category: "Esportes", color: "from-red-600 to-rose-700" },
  { id: "7", number: "101", name: "Telecine Pipoca", category: "Filmes", color: "from-purple-600 to-pink-600" },
  { id: "8", number: "120", name: "HBO HD", category: "Filmes", color: "from-indigo-700 to-slate-900" },
  { id: "9", number: "42", name: "Multishow", category: "Variedades", color: "from-pink-500 to-rose-500" },
  { id: "10", number: "80", name: "Discovery Channel", category: "Documentários", color: "from-teal-500 to-emerald-700" },
  { id: "11", number: "10", name: "TV Cultura", category: "Educativa", color: "from-emerald-500 to-lime-600" },
  { id: "12", number: "501", name: "CNN Brasil", category: "Notícias", color: "from-red-700 to-red-900" },
];

export const DEFAULT_STREAMING_APPS: StreamingApp[] = [
  { id: "netflix", name: "Netflix", icon: "Tv", color: "from-red-600 to-red-800", appId: "12" },
  { id: "youtube", name: "YouTube", icon: "Youtube", color: "from-red-500 to-rose-600", appId: "13" },
  { id: "prime", name: "Prime Video", icon: "Play", color: "from-sky-500 to-blue-600", appId: "2285" },
  { id: "disney", name: "Disney+", icon: "Sparkles", color: "from-blue-600 to-indigo-900", appId: "13842" },
  { id: "max", name: "Max (HBO)", icon: "Film", color: "from-purple-600 to-indigo-700", appId: "61322" },
  { id: "globoplay", name: "Globoplay", icon: "Tv2", color: "from-pink-600 to-rose-600", appId: "18444" },
  { id: "spotify", name: "Spotify", icon: "Music", color: "from-emerald-500 to-green-600", appId: "1988" },
  { id: "appletv", name: "Apple TV+", icon: "MonitorPlay", color: "from-slate-700 to-slate-900", appId: "55101" },
  { id: "pluto", name: "Pluto TV", icon: "Radio", color: "from-amber-500 to-yellow-600", appId: "5000" },
  { id: "twitch", name: "Twitch", icon: "Gamepad2", color: "from-purple-500 to-violet-700", appId: "2600" },
  { id: "starplus", name: "Star+", icon: "Star", color: "from-orange-500 to-amber-700", appId: "14000" },
  { id: "crunchyroll", name: "Crunchyroll", icon: "Flame", color: "from-orange-500 to-red-600", appId: "15000" },
];

export const DEFAULT_SETTINGS: UserSettings = {
  hapticEnabled: true,
  soundEnabled: true,
  theme: "dark-titanium",
  deviceFrame: false,
  activeTvId: "aoc-roku-50-sala",
  volumeStep: 5,
  customChannels: DEFAULT_FAVORITE_CHANNELS,
  customApps: DEFAULT_STREAMING_APPS,
};

// Web Audio API Sound Synthesizer for tactile Remote Clicks
class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playClick(type: "soft" | "pop" | "power" | "volume" = "soft") {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === "power") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "volume") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "pop") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else {
        // Soft click
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch {
      // Ignore web audio block if user hasn't interacted
    }
  }
}

export const audioSynth = new AudioSynthesizer();

export function triggerHaptic(type: "short" | "medium" | "heavy" = "short") {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      if (type === "short") navigator.vibrate(15);
      else if (type === "medium") navigator.vibrate(35);
      else if (type === "heavy") navigator.vibrate([40, 20, 40]);
    } catch {
      // ignore
    }
  }
}

// Local Storage helpers
const SETTINGS_KEY = "controle_leleco_settings_v1";
const TVS_KEY = "controle_leleco_tvs_v1";
const LOGS_KEY = "controle_leleco_logs_v1";

export function loadSavedSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveUserSettings(settings: UserSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadSavedTVs(): TVDevice[] {
  try {
    const raw = localStorage.getItem(TVS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_TVS;
}

export function saveTVs(tvs: TVDevice[]) {
  try {
    localStorage.setItem(TVS_KEY, JSON.stringify(tvs));
  } catch {}
}

export function loadSavedLogs(): CommandLogItem[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveLogs(logs: CommandLogItem[]) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch {}
}
