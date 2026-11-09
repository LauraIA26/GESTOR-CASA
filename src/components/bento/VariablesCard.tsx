import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ShoppingCart, Fuel, Utensils, ShoppingBag, Plus, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface VariablesCardProps {
  onOpenAddModal: () => void;
}

export const VariablesCard: React.FC<VariablesCardProps> = ({ onOpenAddModal }) => {
  const { variableExpenses, addVariableAmount, formatAmount, totalVariableAmount } = useFinance();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supermercado':
        return <ShoppingCart className="w-4 h-4 text-orange-600" />;
      case 'gasolina':
        return <Fuel className="w-4 h-4 text-orange-600" />;
      case 'ocio':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-orange-100 dark:border-orange-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 shadow-inner">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                🟠 Variables / Día a Día
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Supermercado, Gasolina y Ocio
              </h2>
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="p-2 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition active:scale-[0.97] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Añadir gasto del día a día"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Total Variable Banner */}
        <div className="bg-orange-50/80 dark:bg-orange-950/40 p-3.5 rounded-2xl border border-orange-100 dark:border-orange-900/40 mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-orange-900 dark:text-orange-300 block">
              Gasto Acumulado en Variables:
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-num">
              {formatAmount(totalVariableAmount)}
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500 font-medium">
            Control de tope mensual
          </div>
        </div>

        {/* Variable Categories List */}
        <div className="space-y-3">
          {variableExpenses.map((expense) => {
            const pct = Math.min(100, Math.round((expense.amount / expense.maxBudget) * 100));
            const isOver = expense.amount > expense.maxBudget;

            return (
              <div
                key={expense.id}
                className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950/70 flex items-center justify-center">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {expense.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono-num">
                      {formatAmount(expense.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-num ml-1">
                      / {formatAmount(expense.maxBudget)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Quick Add Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Sumar rápido:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => addVariableAmount(expense.id, 10)}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:bg-orange-50 transition active:scale-[0.97] min-h-[32px]"
                    >
                      +10 €
                    </button>
                    <button
                      onClick={() => addVariableAmount(expense.id, 25)}
                      className="px-2.5 py-1 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 text-[10px] font-bold hover:bg-orange-200 transition active:scale-[0.97] min-h-[32px]"
                    >
                      +25 €
                    </button>
                    <button
                      onClick={() => addVariableAmount(expense.id, 50)}
                      className="px-2 py-1 rounded-xl bg-orange-600 text-white text-[10px] font-bold hover:bg-orange-700 transition active:scale-[0.97] min-h-[32px]"
                    >
                      +50 €
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] font-medium text-slate-400">
        Usa los botones rápidos para apuntar compras al instante desde el móvil
      </div>
    </motion.div>
  );
};
