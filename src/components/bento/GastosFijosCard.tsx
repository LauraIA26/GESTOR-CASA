import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShieldAlert, CheckCircle2, Clock, Plus, Building2, ShieldCheck, FileSpreadsheet, Tv, PiggyBank } from 'lucide-react';
import { motion } from 'motion/react';

interface GastosFijosCardProps {
  onOpenAddModal: () => void;
}

export const GastosFijosCard: React.FC<GastosFijosCardProps> = ({ onOpenAddModal }) => {
  const { fixedExpenses, toggleFixedPaid, formatAmount, totalFixedProratedMonthly } = useFinance();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hipoteca':
        return <Building2 className="w-4 h-4 text-rose-600" />;
      case 'seguro':
        return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      case 'impuesto':
        return <FileSpreadsheet className="w-4 h-4 text-rose-600" />;
      default:
        return <Tv className="w-4 h-4 text-rose-600" />;
    }
  };

  const pendingCount = fixedExpenses.filter((e) => !e.isPaid).length;

  // Prorated tax reserve calculation for non-monthly expenses
  const nonMonthlyProratedTotal = fixedExpenses
    .filter((e) => e.periodicity !== 'mensual')
    .reduce((acc, curr) => acc + curr.proratedMonthly, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-rose-100 dark:border-rose-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                🔴 Gastos Fijos e Impuestos
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Alquiler, Hipoteca, IBI & Prorrateo
              </h2>
            </div>
          </div>
          <button
            onClick={onOpenAddModal}
            className="p-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition active:scale-[0.97] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Añadir gasto fijo con prorrateo"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Total & Tax Reserve Prorated Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div className="bg-rose-50/80 dark:bg-rose-950/40 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/40">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-300 block">
              Impacto Prorrateado Mes:
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-num">
              {formatAmount(totalFixedProratedMonthly)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">incluye gastos no mensuales</span>
          </div>

          <div className="bg-gradient-to-br from-rose-900 to-slate-900 text-white p-3.5 rounded-2xl border border-rose-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-200">
              <PiggyBank className="w-3.5 h-3.5 text-rose-400" />
              <span>Hucha de Impuestos</span>
            </div>
            <div className="text-xl font-extrabold font-mono-num text-rose-300">
              +{formatAmount(nonMonthlyProratedTotal)}/mes
            </div>
            <span className="text-[10px] text-slate-300">Reserva IBI, seguros y tasas anuales</span>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
          {fixedExpenses.map((expense) => (
            <div
              key={expense.id}
              onClick={() => toggleFixedPaid(expense.id)}
              className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer select-none ${
                expense.isPaid
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-80 hover:opacity-100'
                  : 'bg-white dark:bg-slate-800 border-rose-200 dark:border-rose-900/60 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/70 flex items-center justify-center shrink-0">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {expense.name}
                    </h4>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {expense.periodicity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{expense.dueDate}</span>
                    {expense.periodicity !== 'mensual' && (
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        · Prorrateo: {formatAmount(expense.proratedMonthly)}/mes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono-num block">
                    {formatAmount(expense.amount)}
                  </span>
                  <span className="text-[9px] text-slate-400 capitalize">
                    {expense.periodicity}
                  </span>
                </div>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    expense.isPaid
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-rose-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] font-medium text-slate-400">
        El prorrateo calcula la cuota mensual reservada para evitar impagados al vencer seguros o IBI
      </div>
    </motion.div>
  );
};
