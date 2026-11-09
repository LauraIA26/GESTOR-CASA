import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calculator, Sliders, TrendingUp, DollarSign, Wallet, PiggyBank, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const CalculadoraAhorroCard: React.FC = () => {
  const {
    monthlySummary,
    savingsTarget,
    totalFixedProratedMonthly,
    utilityContracts,
    formatAmount,
  } = useFinance();

  const [leisureCutPct, setLeisureCutPct] = useState(25); // 25%
  const [supermarketCutPct, setSupermarketCutPct] = useState(15); // 15%

  // Calculations
  const leisureBase = 190;
  const superBase = 410;
  const totalUtilityBase = utilityContracts.reduce((acc, curr) => acc + curr.monthlyAmount, 0);

  const monthlyLeisureSavings = Math.round((leisureBase * leisureCutPct) / 100);
  const monthlySuperSavings = Math.round((superBase * supermarketCutPct) / 100);
  
  const extraMonthlySavings = monthlyLeisureSavings + monthlySuperSavings;
  const extraYearlySavings = extraMonthlySavings * 12;

  // Final Free Balance Calculation
  const mandatorySavings = savingsTarget.mandatoryMonthly || 350;
  const baseVariableSpent = 745 - extraMonthlySavings;
  const finalFreeBalance = monthlySummary.totalIncome - totalFixedProratedMonthly - totalUtilityBase - baseVariableSpent - mandatorySavings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-sky-100 dark:border-sky-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                🩵 Simulador de Gastos y Ahorro
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Simulador Vertical en Columna
              </h2>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Interactivo
          </span>
        </div>

        {/* Vertical Column Flow */}
        <div className="space-y-3">
          {/* BLOQUE 1: Ingresos Totales del Mes */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  Bloque 1: Ingresos Totales
                </span>
                <span className="text-[10px] text-slate-500">Nómina & Extras del mes</span>
              </div>
            </div>
            <span className="text-xl font-black font-mono-num text-emerald-600 dark:text-emerald-400">
              {formatAmount(monthlySummary.totalIncome)}
            </span>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* BLOQUE 2: Hucha de Ahorro Obligatoria */}
          <div className="p-3.5 bg-emerald-950/80 text-white rounded-2xl border border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-200 block">
                  Bloque 2: Ahorro Obligatorio Mes
                </span>
                <span className="text-[10px] text-emerald-300">Reserva automática para La Hucha</span>
              </div>
            </div>
            <span className="text-xl font-black font-mono-num text-emerald-300">
              -{formatAmount(mandatorySavings)}
            </span>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* BLOQUE 3: Sliders de Recortes en Gastos Variables */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
              Bloque 3: Ajuste de Recortes Variables
            </span>

            {/* Slider 1: Ocio */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Ocio & Restauración ({leisureCutPct}%)</span>
                <span className="text-sky-600 font-mono-num">+{monthlyLeisureSavings} €/mes</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={leisureCutPct}
                onChange={(e) => setLeisureCutPct(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Slider 2: Supermercado */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Supermercado Inteligente ({supermarketCutPct}%)</span>
                <span className="text-sky-600 font-mono-num">+{monthlySuperSavings} €/mes</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={supermarketCutPct}
                onChange={(e) => setSupermarketCutPct(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Extra Annual Savings Output in Bright Glowing Green */}
            <div className="p-3 bg-emerald-950 text-emerald-300 rounded-xl border border-emerald-500/50 flex items-center justify-between shadow-lg shadow-emerald-950/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-xs font-extrabold text-white">
                  Ahorro Anual Extra Generado:
                </span>
              </div>
              <span className="text-2xl font-black font-mono-num text-emerald-400 animate-pulse">
                +{formatAmount(extraYearlySavings)}/año
              </span>
            </div>
          </div>

          <div className="flex justify-center text-slate-300 dark:text-slate-600">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* BLOQUE 4: Resumen Final de Saldo Libre */}
          <div className="p-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sky-100 block">
                Bloque 4: Saldo Libre Tras Todo
              </span>
              <span className="text-[10px] text-sky-200">Disponible libre para disfrutar</span>
            </div>
            <span className="text-2xl sm:text-3xl font-black font-mono-num text-white">
              {formatAmount(finalFreeBalance)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] font-medium text-slate-400">
        Simulación vertical en cascada para calcular exactamente tu saldo libre mensual
      </div>
    </motion.div>
  );
};
