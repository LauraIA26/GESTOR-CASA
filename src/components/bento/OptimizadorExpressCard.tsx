import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Lightbulb, CheckCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OptimizadorExpressCardProps {
  onOpenAIModal?: () => void;
}

export const OptimizadorExpressCard: React.FC<OptimizadorExpressCardProps> = ({ onOpenAIModal }) => {
  const { tips, toggleTipApplied, formatAmount } = useFinance();

  const appliedTipsList = tips.filter((t) => t.isApplied);
  const totalImplementedSavings = appliedTipsList.reduce(
    (acc, curr) => acc + curr.potentialSavingsYearly,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-emerald-200/80 dark:border-emerald-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                🟢 Acciones Directas
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Optimizador Express — Checklist de Oportunidades
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {appliedTipsList.length} de {tips.length} Completadas
          </span>
        </div>

        {/* Implemented Savings Counter Banner */}
        <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-800 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-200 block">
                Ahorro Anual Conseguido por Checklist:
              </span>
              <p className="text-[10px] text-slate-300">
                Suma acumulada de acciones [Aplicadas ✅] en casa
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono-num text-emerald-400">
              +{formatAmount(totalImplementedSavings)}
            </span>
            <span className="text-[10px] text-slate-400 block">/ año</span>
          </div>
        </div>

        {/* Checklist Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip) => {
            const isApplied = !!tip.isApplied;

            return (
              <div
                key={tip.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between select-none ${
                  isApplied
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {tip.category}
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono-num">
                      +{formatAmount(tip.potentialSavingsYearly)}/año
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-3">
                    {tip.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    Impacto: <strong className="text-emerald-600">{tip.impact}</strong>
                  </span>

                  <button
                    onClick={() => toggleTipApplied(tip.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition active:scale-95 cursor-pointer flex items-center gap-1.5 min-h-[38px] ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Aplicado ✅</span>
                      </>
                    ) : (
                      <>
                        <span>Aplicar Acción</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] font-medium text-slate-400">
        Haz clic en [Aplicar Acción] al realizar cada ajuste en tu hogar para sumar ahorro real
      </div>
    </motion.div>
  );
};
