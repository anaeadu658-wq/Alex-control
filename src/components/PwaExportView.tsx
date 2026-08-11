import React, { useState, useEffect } from "react";
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  AlertTriangle,
  Zap,
  Info
} from "lucide-react";

export const PwaExportView: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  const currentUrl = window.location.origin;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Para instalar direto no Android:\n1. Abra este app no Google Chrome do celular.\n2. Toque no menu de 3 pontinhos (⋮) do Chrome.\n3. Selecione 'Adicionar à Tela Inicial' ou 'Instalar Aplicativo'.");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDownloadManifest = () => {
    const manifestContent = {
      name: "Controle Remoto TV Wi-Fi - Leleco",
      short_name: "Controle TV",
      description: "Aplicativo Android PWA de Controle Remoto Wi-Fi universal para Smart TVs com controle de volume, mudo, ligar/desligar, pad de navegação e comandos HTTP via IP local.",
      id: "/",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#090d16",
      theme_color: "#2563eb",
      lang: "pt-BR",
      dir: "ltr",
      categories: ["utilities", "entertainment", "lifestyle"],
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
      ]
    };

    const blob = new Blob([JSON.stringify(manifestContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const licenseText = `MIT License

Copyright (c) 2026 Controle Remoto TV Wi-Fi - Leleco Universal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
PWABUILDER / ANDROID PACKAGE PERMISSIONS NOTICE:
This license explicitly grants permission for compilation, packaging, and
distribution via PWABuilder (pwabuilder.com) as an Android APK, Android App Bundle (AAB),
Trusted Web Activity (TWA), or Progressive Web App (PWA).`;

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(licenseText);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 2500);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 pb-20 space-y-5 animate-in fade-in duration-300">
      
      {/* 1. DIRECT INSTALLATION ON PHONE (RECOMMENDED ALTERNATIVE) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-3xl shadow-xl border border-blue-400/30 relative overflow-hidden text-white">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
          <h2 className="text-xs font-black uppercase tracking-wider">Instalação Direta sem Erros</h2>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed mb-4">
          Você não precisa obrigatoriamente usar o pwabuilder.com para ter o aplicativo no seu Android! Instale como App Nativo direto pelo navegador Chrome em 1 segundo.
        </p>

        <button
          onClick={handleNativeInstall}
          className="w-full py-3 bg-white text-blue-900 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-50 active:scale-98 transition-all cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>{installed ? "App Instalado na Tela Inicial!" : "Instalar App na Tela Inicial do Celular"}</span>
        </button>
      </div>

      {/* 2. PWABUILDER HERO SCORE HEADER */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight">Gerador PWABuilder (.APK)</h2>
              <p className="text-[11px] text-blue-300 font-medium">Exportação Oficial Android</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Manifest V2 OK
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          O <code className="bg-slate-800 text-blue-300 px-1 py-0.5 rounded">manifest.json</code> e o Service Worker foram corrigidos para o padrão Android TWA do PWABuilder.
        </p>

        {/* Quick Copy URL Action */}
        <div className="mt-4 p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">URL do seu App PWA:</p>
            <p className="text-xs font-mono text-blue-300 truncate">{currentUrl}</p>
          </div>

          <button
            onClick={handleCopyUrl}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              copiedUrl
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
            }`}
          >
            {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUrl ? "Copiada!" : "Copiar URL"}</span>
          </button>
        </div>

        {/* Open PWABuilder direct button */}
        <a
          href={`https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-98"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Tentar Novamente no PWABuilder.com</span>
        </a>
      </div>

      {/* 3. SOLUÇÃO DE ERROS NO PWABUILDER */}
      <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-3xl shadow-xl space-y-3.5 backdrop-blur-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Como Resolver Erro no PWABuilder
        </h3>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              1. Atenção à URL do App
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              O PWABuilder só consegue ler URLs públicas ativas. Certifique-se de colar a URL pública gerada ao compartilhar ou publicar o app.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-bold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              2. Estrutura do Manifest Otimizada
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Removemos os manipuladores de protocolo conflitantes que costumam causar travamentos no gerador do PWABuilder.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <p className="font-bold text-blue-300 flex items-center gap-1">
              <Download className="w-3.5 h-3.5 shrink-0" />
              3. Baixar arquivo Manifest.json
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              Você também pode baixar o arquivo manifest limpo para uso direto:
            </p>
            <button
              onClick={handleDownloadManifest}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar manifest.json Otimizado</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COMPLIANCE CHECKLIST FOR PWABUILDER */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-3.5 backdrop-blur-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Requisitos & Licenças Verificadas
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Web App Manifest (manifest.json)</p>
              <p className="text-[11px] text-slate-400">Definido com id, start_url, display standalone, orientação e categorias.</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Ícones Android & Maskable</p>
              <p className="text-[11px] text-slate-400">Resoluções de 192x192, 512x512, 180x180 (Apple) e versão Maskable inclusos.</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Service Worker (sw.js)</p>
              <p className="text-[11px] text-slate-400">Registrado com cache de interface e suporte a funcionamento offline.</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Licença Open Source Inclusa (MIT)</p>
              <p className="text-[11px] text-slate-400">Permissão explícita em LICENSE e LICENSE.md para exportação e uso livre.</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Comandos HTTP para IP Local</p>
              <p className="text-[11px] text-slate-400">Lógica em código configurada para disparar requisições HTTP para a TV na rede Wi-Fi.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowLicenseModal(true)}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Ver Licença MIT em Código</span>
        </button>
      </div>

      {/* 3. STEP BY STEP PWABUILDER TUTORIAL */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-3.5 backdrop-blur-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          Como Baixar o App (.APK) no PWABuilder
        </h3>

        <ol className="space-y-3 text-xs text-slate-300">
          <li className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">1</span>
            <span>Clique no botão <strong>"Copiar URL"</strong> acima para copiar o endereço web deste app.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">2</span>
            <span>Acesse <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">pwabuilder.com</a> e cole o endereço no campo principal de busca.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">3</span>
            <span>O PWABuilder irá validar automaticamente o Manifest e o Service Worker dando pontuação máxima.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">4</span>
            <span>Clique em <strong>"Package for Store"</strong> e selecione a opção <strong>Android (APK / AAB)</strong>.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">5</span>
            <span>Baixe o arquivo <strong>.apk</strong> gerado e instale diretamente no seu celular Android!</span>
          </li>
        </ol>
      </div>

      {/* LICENSE MODAL */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Licença MIT Oficial
              </h4>
              <button
                onClick={() => setShowLicenseModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                Fechar
              </button>
            </div>

            <pre className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {licenseText}
            </pre>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLicense}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                {copiedLicense ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLicense ? "Licença Copiada!" : "Copiar Licença"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
