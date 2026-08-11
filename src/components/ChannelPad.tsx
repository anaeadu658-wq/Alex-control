import React, { useState } from "react";
import { FavoriteChannel } from "../types";
import { 
  Hash, 
  Tv2, 
  Plus, 
  Trash2, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  Delete, 
  CornerDownLeft, 
  Star,
  Tv
} from "lucide-react";

interface ChannelPadProps {
  favoriteChannels: FavoriteChannel[];
  onSendCommand: (cmd: string, label?: string) => void;
  onTypeChannelNumber: (numStr: string) => void;
  onAddFavoriteChannel: (ch: Omit<FavoriteChannel, "id">) => void;
  onRemoveFavoriteChannel: (id: string) => void;
}

export const ChannelPad: React.FC<ChannelPadProps> = ({
  favoriteChannels,
  onSendCommand,
  onTypeChannelNumber,
  onAddFavoriteChannel,
  onRemoveFavoriteChannel,
}) => {
  const [inputDigits, setInputDigits] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [showAddModal, setShowAddModal] = useState(false);

  // New channel form state
  const [newNum, setNewNum] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Aberta");

  const handleNumClick = (digit: string) => {
    if (inputDigits.length < 4) {
      const updated = inputDigits + digit;
      setInputDigits(updated);
      onSendCommand(`Lit_${digit}`, `Dígito ${digit}`);
    }
  };

  const handleBackspace = () => {
    if (inputDigits.length > 0) {
      setInputDigits(inputDigits.slice(0, -1));
      onSendCommand("Backspace", "Apagar Dígito");
    }
  };

  const handleTuneCurrentDigits = () => {
    if (inputDigits) {
      onTypeChannelNumber(inputDigits);
      onSendCommand("Enter", `Sintonizar Canal ${inputDigits}`);
      setInputDigits("");
    }
  };

  const categories = ["Todos", "Aberta", "Esportes", "Filmes", "Variedades", "Documentários", "Notícias"];

  const filteredChannels = favoriteChannels.filter((ch) => {
    const matchesCat = selectedCategory === "Todos" || ch.category === selectedCategory;
    const matchesSearch = ch.name.toLowerCase().includes(searchFilter.toLowerCase()) || ch.number.includes(searchFilter);
    return matchesCat && matchesSearch;
  });

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNum && newName) {
      onAddFavoriteChannel({
        number: newNum,
        name: newName,
        category: newCategory,
        color: "from-blue-600 to-indigo-600",
      });
      setNewNum("");
      setNewName("");
      setShowAddModal(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-5 animate-in fade-in duration-300">
      {/* 1. DIRECT NUMERIC KEYPAD */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            Teclado Numérico de Canais
          </h2>
          <span className="text-[10px] text-blue-400 font-mono">Sintonização Direta</span>
        </div>

        {/* Display Screen */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between min-h-[52px]">
          <span className="text-xs text-slate-500 font-medium">Canal:</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black font-mono text-blue-400 tracking-wider">
              {inputDigits || "---"}
            </span>
            {inputDigits && (
              <button
                onClick={handleBackspace}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Delete className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3x4 Number Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-100 font-black text-xl active:scale-95 transition-all shadow-md"
            >
              {num}
            </button>
          ))}

          {/* Dash / Hyphen */}
          <button
            onClick={() => handleNumClick("-")}
            className="py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 text-slate-300 font-bold text-lg active:scale-95 transition-all"
          >
            -
          </button>

          {/* Zero */}
          <button
            onClick={() => handleNumClick("0")}
            className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-100 font-black text-xl active:scale-95 transition-all shadow-md"
          >
            0
          </button>

          {/* Tune / Enter */}
          <button
            onClick={handleTuneCurrentDigits}
            disabled={!inputDigits}
            className={`py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-1 active:scale-95 transition-all shadow-lg ${
              inputDigits
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400/40"
                : "bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800"
            }`}
          >
            <CornerDownLeft className="w-4 h-4" />
            <span>Ir</span>
          </button>
        </div>

        {/* Fast Channel Up / Down Bar */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onSendCommand("ChannelUp", "Próximo Canal")}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1"
          >
            <ChevronUp className="w-4 h-4 text-blue-400" />
            <span>Canal +</span>
          </button>
          <button
            onClick={() => onSendCommand("ChannelDown", "Canal Anterior")}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1"
          >
            <ChevronDown className="w-4 h-4 text-blue-400" />
            <span>Canal -</span>
          </button>
        </div>
      </div>

      {/* 2. FAVORITE CHANNELS HUB */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Canais Favoritos do Leleco
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Canal
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar canal por nome ou número..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Channel Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
          {filteredChannels.map((ch) => (
            <div
              key={ch.id}
              className="group relative bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-3 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-md"
            >
              <button
                onClick={() => {
                  onTypeChannelNumber(ch.number);
                  onSendCommand("Enter", `Sintonizar ${ch.name} (${ch.number})`);
                }}
                className="w-full text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/30">
                    CH {ch.number}
                  </span>
                  <span className="text-[10px] text-slate-500">{ch.category}</span>
                </div>
                <p className="font-bold text-sm text-slate-100 truncate group-hover:text-blue-300 transition-colors">
                  {ch.name}
                </p>
              </button>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Tv className="w-3 h-3 text-emerald-400" />
                  1-Toque
                </span>
                <button
                  onClick={() => onRemoveFavoriteChannel(ch.id)}
                  className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Channel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateChannel}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Adicionar Canal Favorito
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
                <label className="text-xs text-slate-400 font-medium">Número do Canal</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 501"
                  value={newNum}
                  onChange={(e) => setNewNum(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Nome do Canal</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CNN Brasil HD"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Aberta">Aberta</option>
                  <option value="Esportes">Esportes</option>
                  <option value="Filmes">Filmes</option>
                  <option value="Variedades">Variedades</option>
                  <option value="Documentários">Documentários</option>
                  <option value="Notícias">Notícias</option>
                </select>
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
                Salvar Canal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
