import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import QRCode from 'qrcode';
import { X, QrCode, Download, Upload, ShieldCheck, Copy, Check, RefreshCw, Smartphone } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJSON, importDataJSON, resetAllData } = useFinance();
  const [activeTab, setActiveTab] = useState<'generar' | 'importar' | 'backup'>('generar');

  const [qrCanvasUrl, setQrCanvasUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [importString, setImportString] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen && activeTab === 'generar') {
      try {
        const jsonPayload = exportDataJSON();
        // Generate QR code data URL using qrcode library
        QRCode.toDataURL(jsonPayload, { margin: 2, width: 320, color: { dark: '#020617', light: '#ffffff' } })
          .then((url) => setQrCanvasUrl(url))
          .catch((err) => {
            console.error('QR code render error:', err);
          });
      } catch (e) {
        console.error('Failed to encode QR payload:', e);
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleCopyJSON = () => {
    const payload = exportDataJSON();
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    const payload = exportDataJSON();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestor_casa_pro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importString) return;
    const ok = importDataJSON(importString);
    if (ok) {
      setImportStatus('success');
      setTimeout(() => {
        setImportStatus('idle');
        setImportString('');
        onClose();
      }, 1500);
    } else {
      setImportStatus('error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const ok = importDataJSON(content);
        if (ok) {
          setImportStatus('success');
          setTimeout(() => {
            setImportStatus('idle');
            onClose();
          }, 1500);
        } else {
          setImportStatus('error');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-[32px] bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Código QR y Sincronización Local
              </h3>
              <p className="text-xs text-slate-400">
                Transfiere y respalda tus datos 100% offline y privados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 rounded-2xl my-4 shrink-0">
          <button
            onClick={() => setActiveTab('generar')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'generar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generar QR</span>
          </button>
          <button
            onClick={() => setActiveTab('importar')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'importar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Importar QR</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Respaldo JSON</span>
          </button>
        </div>

        {/* TAB 1: Generar QR Dinámico */}
        {activeTab === 'generar' && (
          <div className="text-center space-y-4 py-2">
            <p className="text-xs text-slate-300">
              Muestra este código QR a otro móvil de la familia para sincronizar los datos al instante en 1 segundo:
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-emerald-500/50">
              {qrCanvasUrl ? (
                <img src={qrCanvasUrl} alt="Código QR Familiar" className="w-52 h-52 mx-auto rounded-lg" />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-800">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopyJSON}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition active:scale-95 cursor-pointer flex items-center gap-2 min-h-[44px]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto QR'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Escanear / Importar QR Familiar */}
        {activeTab === 'importar' && (
          <form onSubmit={handleImportSubmit} className="space-y-4 py-2">
            <p className="text-xs text-slate-300">
              Pega aquí la cadena de texto del Código QR o escáner del otro móvil familiar:
            </p>

            <textarea
              rows={5}
              required
              placeholder="Pega aquí el código o texto escaneado..."
              value={importString}
              onChange={(e) => setImportString(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />

            {importStatus === 'success' && (
              <div className="p-3 bg-emerald-950 text-emerald-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>¡Sincronización completada con éxito!</span>
              </div>
            )}

            {importStatus === 'error' && (
              <div className="p-3 bg-rose-950 text-rose-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                <span>⚠️ Error: El código ingresado no es válido.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer min-h-[44px]"
            >
              Confirmar e Importar Datos
            </button>
          </form>
        )}

        {/* TAB 3: Copia de Seguridad JSON */}
        {activeTab === 'backup' && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" /> Exportar Copia Local
              </h4>
              <p className="text-[11px] text-slate-400">
                Descarga un archivo `.json` con la copia completa de la casa para guardar en tu móvil.
              </p>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Backup JSON</span>
              </button>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" /> Restaurar Copia JSON
              </h4>
              <p className="text-[11px] text-slate-400">
                Selecciona un archivo de copia `.json` de tu teléfono para restaurar la aplicación.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-300 bg-slate-900 border border-slate-700 rounded-xl p-2 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
