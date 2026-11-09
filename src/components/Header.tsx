import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Eye, EyeOff, Home, Users, Calendar, QrCode } from 'lucide-react';

interface HeaderProps {
  onOpenQRModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQRModal }) => {
  const { isIncognito, toggleIncognito, activeFamily, setActiveFamily, monthlySummary } = useFinance();

  const familyOptions = ['Familia García', 'Piso Compartido Madrid', 'Casa de Campo'];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Brand & Month */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white leading-tight">
                  Gestor Casa Pro
                </h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  PWA Local
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{monthlySummary.monthName}</span>
              </p>
            </div>
          </div>

          {/* Mobile Right Controls: QR & Incognito */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenQRModal}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-2xl border border-slate-800 bg-slate-900 text-emerald-400 hover:bg-slate-800 active:scale-95 transition cursor-pointer"
              title="Código QR y Seguridad"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={toggleIncognito}
              className={`flex items-center justify-center min-h-[44px] min-w-[44px] rounded-2xl border transition active:scale-95 cursor-pointer ${
                isIncognito
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
              title={isIncognito ? 'Desactivar Modo Incógnito' : 'Activar Modo Incógnito'}
            >
              {isIncognito ? <EyeOff className="w-5 h-5 text-amber-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end">
          {/* Family Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 shadow-sm">
            <Users className="w-4 h-4 text-slate-400" />
            <select
              value={activeFamily}
              onChange={(e) => setActiveFamily(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {familyOptions.map((fam) => (
                <option key={fam} value={fam} className="bg-slate-900 text-white">
                  {fam}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop QR & Sync Button */}
          <button
            onClick={onOpenQRModal}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 px-3.5 py-2.5 rounded-2xl text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer min-h-[44px]"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Código QR y Seguridad</span>
          </button>

          {/* Desktop Incognito Toggle */}
          <button
            onClick={toggleIncognito}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition active:scale-95 cursor-pointer min-h-[44px] ${
              isIncognito
                ? 'bg-amber-950/80 text-amber-200 border-amber-700 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isIncognito ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Cifras Ocultas</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-slate-400" />
                <span>Ocultar Cifras</span>
              </>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
