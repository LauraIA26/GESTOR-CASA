import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { UtilityContract } from '../../types/finance';
import { X, Zap, Droplets, Wifi, Flame, Calendar, Check, AlertTriangle } from 'lucide-react';

interface ContractDetailModalProps {
  contract: UtilityContract | null;
  onClose: () => void;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({ contract, onClose }) => {
  const { updateContract, formatAmount } = useFinance();

  if (!contract) return null;

  const [provider, setProvider] = useState(contract.provider);
  const [monthlyAmount, setMonthlyAmount] = useState(contract.monthlyAmount.toString());
  const [renewalDate, setRenewalDate] = useState(contract.renewalDate);
  const [notes, setNotes] = useState(contract.notes || '');
  const [isAlertNeeded, setIsAlertNeeded] = useState(contract.isAlertNeeded || false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContract(contract.id, {
      provider,
      monthlyAmount: Number(monthlyAmount),
      renewalDate,
      notes: notes || undefined,
      isAlertNeeded,
    });
    onClose();
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Luz':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'Agua':
        return <Droplets className="w-6 h-6 text-sky-600" />;
      case 'Internet':
        return <Wifi className="w-6 h-6 text-indigo-600" />;
      default:
        return <Flame className="w-6 h-6 text-orange-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              {getServiceIcon(contract.service)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contrato de {contract.service}
              </h3>
              <p className="text-xs text-slate-500">Suministro Doméstico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 my-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Compañía / Proveedor:
            </label>
            <input
              type="text"
              required
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Cuota mensual (€):
              </label>
              <input
                type="number"
                required
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono-num"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Fecha Renovación:
              </label>
              <input
                type="text"
                required
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Notas & Cláusulas del contrato:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Revisar descuento del 20% antes del 15 de Noviembre..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/50">
            <input
              type="checkbox"
              id="alertNeeded"
              checked={isAlertNeeded}
              onChange={(e) => setIsAlertNeeded(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="alertNeeded" className="text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
              Activar alerta de revisión / cambio de proveedor
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition active:scale-[0.97] cursor-pointer min-h-[44px]"
            >
              Actualizar Contrato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
