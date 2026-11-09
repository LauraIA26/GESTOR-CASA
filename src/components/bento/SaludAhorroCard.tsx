import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PiggyBank, TrendingUp, Wallet, ArrowUpRight, ShieldCheck, CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface SaludAhorroCardProps {
  onOpenSavingsModal: () => void;
}

export const SaludAhorroCard: React.FC<SaludAhorroCardProps> = ({ onOpenSavingsModal }) => {
  const {
    formatAmount,
    monthlySummary,
    totalSpent,
    availableCash,
    savingsTarget,
    addToSavingsJar,
    monthsOfPeace,
  } = useFinance();

  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const spentPercentage = Math.min(100, Math.round((totalSpent / monthlySummary.totalIncome) * 100));
  const savingsProgress = Math.min(
    100,
    Math.round((savingsTarget.currentAmount / savingsTarget.targetAmount) * 100)
  );

  const handleQuickAddSavings = (amount: number) => {
    addToSavingsJar(amount);
    setAddedNotice(`+${amount}€ a La Hucha`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-emerald-100 dark:border-emerald-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                🟢 Salud Financiera & Ahorro
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Salud del Mes & La Hucha
              </h2>
            </div>
          </div>
          <button
            onClick={onOpenSavingsModal}
            className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition active:scale-[0.97] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Gestionar objetivo de ahorro"
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick notification banner */}
        {addedNotice && (
          <div className="mb-3 px-3 py-1.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{addedNotice}</span>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {/* Saldo Libre / Disponible */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-100/80 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saldo Libre</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono-num">
              {formatAmount(availableCash)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">tras gastos fijos y reserva</span>
          </div>

          {/* Dinero Ahorrado (La Hucha) */}
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-md shadow-emerald-600/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100 mb-1">
              <PiggyBank className="w-3.5 h-3.5 text-emerald-200" />
              <span>La Hucha Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono-num text-white">
              {formatAmount(savingsTarget.currentAmount)}
            </div>
            <span className="text-[10px] text-emerald-100 font-medium">Meta: {formatAmount(savingsTarget.targetAmount)}</span>
          </div>

          {/* Meses de Tranquilidad */}
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-3.5 rounded-2xl border border-emerald-800 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tranquilidad</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono-num text-emerald-300">
              {monthsOfPeace} Meses
            </div>
            <span className="text-[9px] text-slate-300">Colchón de colchón de emergencia</span>
          </div>
        </div>

        {/* Savings Goal Progress Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Meta: {savingsTarget.goalName}
            </span>
            <span className="text-xs font-mono-num font-extrabold text-emerald-600 dark:text-emerald-400">
              {savingsProgress}% completado
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${savingsProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Aportar rápido:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleQuickAddSavings(20)}
            className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-200 transition active:scale-[0.97] min-h-[38px] cursor-pointer whitespace-nowrap"
          >
            +20 €
          </button>
          <button
            onClick={() => handleQuickAddSavings(50)}
            className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-200 transition active:scale-[0.97] min-h-[38px] cursor-pointer whitespace-nowrap"
          >
            +50 €
          </button>
          <button
            onClick={() => handleQuickAddSavings(100)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition active:scale-[0.97] min-h-[38px] cursor-pointer whitespace-nowrap shadow-sm"
          >
            +100 €
          </button>
        </div>
      </div>
    </motion.div>
  );
};
