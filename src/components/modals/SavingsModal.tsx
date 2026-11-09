import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PiggyBank, X, PlusCircle, CheckCircle } from 'lucide-react';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({ isOpen, onClose }) => {
  const { savingsTarget, addToSavingsJar, formatAmount } = useFinance();
  const [amountInput, setAmountInput] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amountInput);
    if (!val || val <= 0) return;

    addToSavingsJar(val);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setAmountInput('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <PiggyBank className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Aportar a La Hucha Doméstica
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {savingsTarget.goalName} · Meta: {formatAmount(savingsTarget.targetAmount)}
        </p>

        {successNotice ? (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>¡Aportación guardada en La Hucha!</span>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 text-left">
                Cantidad a ingresar (€):
              </label>
              <input
                type="number"
                required
                placeholder="Ej. 150"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-lg font-extrabold text-slate-900 dark:text-white text-center focus:outline-none focus:border-emerald-500 font-mono-num"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAmountInput('25')}
                className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition"
              >
                +25 €
              </button>
              <button
                type="button"
                onClick={() => setAmountInput('50')}
                className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition"
              >
                +50 €
              </button>
              <button
                type="button"
                onClick={() => setAmountInput('100')}
                className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition"
              >
                +100 €
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition active:scale-[0.97] cursor-pointer min-h-[44px]"
            >
              Confirmar Ingreso a La Hucha
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
