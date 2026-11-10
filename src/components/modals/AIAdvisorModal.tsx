import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, BrainCircuit, X, Send, Bot, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIAdviceItem {
  title: string;
  action: string;
  estimatedSavingsYearly: number;
  category: string;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose }) => {
  const { totalFixedProratedMonthly, totalVariableAmount, utilityContracts, savingsTarget, monthlySummary, formatAmount } = useFinance();
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<{
    summaryText: string;
    advice: AIAdviceItem[];
    source?: string;
  } | null>(null);

  if (!isOpen) return null;

  const totalUtilities = utilityContracts.reduce((a, b) => a + b.monthlyAmount, 0);

  const handleConsultAI = async (customText?: string) => {
    const textToSend = customText || promptInput || '¿Qué 3 acciones rápidas puedo hacer este mes para ahorrar?';
    setLoading(true);

    try {
      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: textToSend,
          budgetSummary: {
            income: monthlySummary.totalIncome,
            fixed: totalFixedProratedMonthly,
            utilities: totalUtilities,
            variable: totalVariableAmount,
            savings: savingsTarget.currentAmount,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAdvisorResult({
          summaryText: data.summaryText,
          advice: data.advice || [],
          source: data.source,
        });
      }
    } catch (e) {
      console.error('Failed to get AI advice', e);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    '¿Cómo podemos ahorrar 300€ más para el fondo de vacaciones?',
    '¿Qué hago para rebajar la factura de luz antes de diciembre?',
    '¿Estamos gastando demasiado en el supermercado para 4 personas?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <BrainCircuit className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Economista Doméstico IA
              </h3>
              <p className="text-xs text-slate-500">
                Asesor inteligente especializado en finanzas de hogar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="py-4 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">
              Preguntas frecuentes para tu hogar:
            </label>
            <div className="space-y-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(preset);
                    handleConsultAI(preset);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 text-xs font-medium text-slate-700 dark:text-slate-200 transition active:scale-[0.98] cursor-pointer flex items-center justify-between group"
                >
                  <span>"{preset}"</span>
                  <Sparkles className="w-3.5 h-3.5 text-sky-500 group-hover:scale-110 transition shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Output Section */}
          {loading ? (
            <div className="p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-sky-600 dark:text-sky-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-sky-900 dark:text-sky-200">
                Analizando tu presupuesto y tarifas familiares...
              </p>
            </div>
          ) : advisorResult ? (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-sky-900 dark:text-sky-200">
                  <Bot className="w-4 h-4 text-sky-600" />
                  <span>Diagnóstico Financiero:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {advisorResult.summaryText}
                </p>
              </div>

              {/* Actionable Advice List */}
              <div className="space-y-2.5">
                {advisorResult.advice.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.category}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 font-mono-num">
                        +{formatAmount(item.estimatedSavingsYearly)}/año
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {item.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Input Form Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConsultAI();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Escribe tu duda sobre gastos o ahorro..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold hover:from-sky-700 hover:to-indigo-700 transition active:scale-[0.97] disabled:opacity-50 cursor-pointer min-h-[44px] flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
