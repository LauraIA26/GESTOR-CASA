import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
        <Check className="w-3.5 h-3.5" /> App Instalada
      </span>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition active:scale-[0.97] cursor-pointer min-h-[44px]"
      >
        <Download className="w-4 h-4" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-semibold shadow-sm hover:bg-slate-50 transition active:scale-[0.97] min-h-[44px]"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-300">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Instalar en iPhone / iPad</h3>
                  <p className="text-xs text-slate-500">Gestor Casa Pro PWA</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <p className="flex items-start gap-2">
                  <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">1</span>
                  <span>Toca el botón <strong>Compartir</strong> <span className="inline-block px-1">Square-Arrow-Up</span> en la barra inferior de Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">2</span>
                  <span>Desliza hacia abajo y pulsa <strong>Añadir a la pantalla de inicio</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">3</span>
                  <span>Disfruta de la app rápida, con icono en tu móvil y sin conexión a internet.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-emerald-600 text-white py-3 text-xs font-bold hover:bg-emerald-700 active:scale-[0.97] transition shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
