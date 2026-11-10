import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FixedExpense, VariableExpense, PeriodicityType } from '../../types/finance';
import { calcProratedMonthly } from '../../data/initialData';
import { X, PlusCircle, Calculator } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'fijo' | 'variable';
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'fijo',
}) => {
  const { addFixedExpense, addVariableExpense, formatAmount } = useFinance();
  const [expenseType, setExpenseType] = useState<'fijo' | 'variable'>(defaultType);

  // Form states for Fixed
  const [fixedName, setFixedName] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedPeriodicity, setFixedPeriodicity] = useState<PeriodicityType>('mensual');
  const [fixedCategory, setFixedCategory] = useState<FixedExpense['category']>('hipoteca');
  const [fixedDueDate, setFixedDueDate] = useState('Día 1');
  const [fixedProvider, setFixedProvider] = useState('');

  // Form states for Variable
  const [varName, setVarName] = useState('');
  const [varAmount, setVarAmount] = useState('');
  const [varMaxBudget, setVarMaxBudget] = useState('');
  const [varCategory, setVarCategory] = useState<VariableExpense['category']>('supermercado');

  if (!isOpen) return null;

  const numericAmount = Number(fixedAmount) || 0;
  const calculatedProrated = calcProratedMonthly(numericAmount, fixedPeriodicity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (expenseType === 'fijo') {
      if (!fixedName.trim() || !Number.isFinite(Number(fixedAmount)) || Number(fixedAmount) <= 0) return;
      addFixedExpense({
        name: fixedName,
        amount: Number(fixedAmount),
        periodicity: fixedPeriodicity,
        category: fixedCategory,
        dueDate: fixedDueDate,
        isPaid: false,
        provider: fixedProvider || undefined,
      });
    } else {
      if (!varName.trim() || !Number.isFinite(Number(varAmount)) || Number(varAmount) <= 0) return;
      addVariableExpense({
        name: varName,
        amount: Number(varAmount),
        maxBudget: varMaxBudget ? Number(varMaxBudget) : Number(varAmount) * 1.5,
        category: varCategory,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      });
    }

    onClose();
  };

  const periodicities: { id: PeriodicityType; label: string }[] = [
    { id: 'mensual', label: 'Mensual' },
    { id: 'bimensual', label: 'Bimensual' },
    { id: 'trimestral', label: 'Trimestral' },
    { id: 'anual', label: 'Anual' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Añadir Nuevo Gasto
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => setExpenseType('fijo')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              expenseType === 'fijo'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🔴 Gasto Fijo / Impuesto
          </button>
          <button
            type="button"
            onClick={() => setExpenseType('variable')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              expenseType === 'variable'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🟠 Día a Día / Variable
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {expenseType === 'fijo' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Concepto del gasto o impuesto:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Impuesto IBI, Seguro Hogar, Hipoteca..."
                  value={fixedName}
                  onChange={(e) => setFixedName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Periodicity Selector Buttons */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Periodicidad de cobro:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {periodicities.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setFixedPeriodicity(p.id)}
                      className={`py-2 text-[11px] font-extrabold rounded-xl transition border cursor-pointer ${
                        fixedPeriodicity === p.id
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Importe de Recibo (€):
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    required
                    placeholder="Ej. 300"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Día / Fecha de Pago:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 15 Nov"
                    value={fixedDueDate}
                    onChange={(e) => setFixedDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Automatic Proration Box */}
              {numericAmount > 0 && fixedPeriodicity !== 'mensual' && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-rose-900 dark:text-rose-200 block">
                        Prorrateo Mensual Automático:
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Reserva para Hucha de Impuestos
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold font-mono-num text-rose-600 dark:text-rose-300">
                    {formatAmount(calculatedProrated)}/mes
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Categoría:
                </label>
                <select
                  value={fixedCategory}
                  onChange={(e) => setFixedCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="hipoteca">Hipoteca / Alquiler</option>
                  <option value="seguro">Seguro (Hogar/Coche/Salud)</option>
                  <option value="impuesto">Impuesto / Tasas Municipales</option>
                  <option value="subscripcion">Subscripción / Cuota</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Entidad / Proveedor (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Ayuntamiento, Mapfre, Santander..."
                  value={fixedProvider}
                  onChange={(e) => setFixedProvider(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Concepto del gasto:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Compra semanal Mercadona..."
                  value={varName}
                  onChange={(e) => setVarName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Importe (€):
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    required
                    placeholder="Ej. 45"
                    value={varAmount}
                    onChange={(e) => setVarAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tope Presupuesto (€):
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. 150"
                    value={varMaxBudget}
                    onChange={(e) => setVarMaxBudget(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Categoría:
                </label>
                <select
                  value={varCategory}
                  onChange={(e) => setVarCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="supermercado">Supermercado & Alimentación</option>
                  <option value="gasolina">Gasolina & Transporte</option>
                  <option value="ocio">Ocio & Restauración</option>
                  <option value="otros">Otros Gastos</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white text-xs font-bold shadow-md transition active:scale-[0.97] cursor-pointer min-h-[44px] ${
                expenseType === 'fijo'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              Guardar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
