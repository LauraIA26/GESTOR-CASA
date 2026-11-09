import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { UtilityContract } from '../../types/finance';

// Bento Card imports
import { SaludAhorroCard } from '../bento/SaludAhorroCard';
import { GastosFijosCard } from '../bento/GastosFijosCard';
import { SuministrosCard } from '../bento/SuministrosCard';
import { VariablesCard } from '../bento/VariablesCard';
import { SaludCitasCard } from '../bento/SaludCitasCard';
import { ChatFamiliarCard } from '../bento/ChatFamiliarCard';
import { GraficoPuntosCard } from '../bento/GraficoPuntosCard';
import { CalculadoraAhorroCard } from '../bento/CalculadoraAhorroCard';
import { OptimizadorExpressCard } from '../bento/OptimizadorExpressCard';

interface SectionDetailModalProps {
  activeModal: string | null;
  onClose: () => void;
  onOpenAddExpense: (type: 'fijo' | 'variable') => void;
  onOpenAddAppointment: (tab: 'cita' | 'medicamento') => void;
  onSelectContract: (contract: UtilityContract) => void;
  onOpenSavingsModal: () => void;
}

export const SectionDetailModal: React.FC<SectionDetailModalProps> = ({
  activeModal,
  onClose,
  onOpenAddExpense,
  onOpenAddAppointment,
  onSelectContract,
  onOpenSavingsModal,
}) => {
  if (!activeModal) return null;

  const getSectionTitle = () => {
    switch (activeModal) {
      case 'ahorro':
        return '🟢 La Hucha y Salud Financiera';
      case 'fijos':
        return '🔴 Gastos Fijos e Impuestos';
      case 'suministros':
        return '🟡 Suministros y Proveedores';
      case 'variables':
        return '🟠 Gastos del Día a Día';
      case 'salud':
        return '🟣 Salud, Citas y Botiquín';
      case 'chat':
        return '💬 Chat Familiar y Avisos';
      case 'grafico':
        return '📈 Evolución y Meses';
      case 'calculadora':
        return '🧮 Simulador de Ahorro';
      case 'optimizador':
        return '💡 Optimizador Express';
      default:
        return 'Detalle de Sección';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-3xl h-[92vh] sm:h-auto max-h-[90vh] rounded-t-[32px] sm:rounded-[32px] bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Modal Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>
          
          <h3 className="text-sm sm:text-base font-extrabold text-white text-center truncate px-2">
            {getSectionTitle()}
          </h3>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 pb-4">
          {activeModal === 'ahorro' && (
            <SaludAhorroCard onOpenSavingsModal={onOpenSavingsModal} />
          )}

          {activeModal === 'fijos' && (
            <GastosFijosCard onOpenAddModal={() => onOpenAddExpense('fijo')} />
          )}

          {activeModal === 'suministros' && (
            <SuministrosCard onSelectContract={onSelectContract} />
          )}

          {activeModal === 'variables' && (
            <VariablesCard onOpenAddModal={() => onOpenAddExpense('variable')} />
          )}

          {activeModal === 'salud' && (
            <SaludCitasCard
              onOpenAddAppointment={() => onOpenAddAppointment('cita')}
              onOpenAddMedicine={() => onOpenAddAppointment('medicamento')}
            />
          )}

          {activeModal === 'chat' && <ChatFamiliarCard />}

          {activeModal === 'grafico' && <GraficoPuntosCard />}

          {activeModal === 'calculadora' && <CalculadoraAhorroCard />}

          {activeModal === 'optimizador' && <OptimizadorExpressCard />}
        </div>
      </div>
    </div>
  );
};
