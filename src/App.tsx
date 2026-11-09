import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';

// Icons
import {
  PiggyBank,
  ShieldAlert,
  Zap,
  ShoppingCart,
  HeartPulse,
  MessageSquare,
  TrendingUp,
  Calculator,
  Lightbulb,
  ChevronRight,
  Plus
} from 'lucide-react';

// Modals
import { SectionDetailModal } from './components/modals/SectionDetailModal';
import { QRModal } from './components/modals/QRModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddAppointmentModal } from './components/modals/AddAppointmentModal';
import { ContractDetailModal } from './components/modals/ContractDetailModal';
import { SavingsModal } from './components/modals/SavingsModal';

// Types
import { UtilityContract } from './types/finance';

function DashboardContent() {
  // Modal state for opening the full detailed view of each blind box
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Auxiliary modals
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseModalDefaultType, setExpenseModalDefaultType] = useState<'fijo' | 'variable'>('fijo');

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentInitialTab, setAppointmentInitialTab] = useState<'cita' | 'medicamento'>('cita');

  const [selectedContract, setSelectedContract] = useState<UtilityContract | null>(null);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

  // The 9 giant blind-box cards configuration
  const menuCards = [
    {
      id: 'ahorro',
      title: 'Ahorro y Salud',
      subtitle: 'La Hucha, Objetivos & Tranquilidad',
      icon: PiggyBank,
      borderColor: 'border-emerald-500/40 hover:border-emerald-500',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      id: 'fijos',
      title: 'Gastos Fijos',
      subtitle: 'Alquiler, Hipoteca, IBI, Seguros',
      icon: ShieldAlert,
      borderColor: 'border-rose-500/40 hover:border-rose-500',
      iconBg: 'bg-rose-500/20 text-rose-400',
    },
    {
      id: 'suministros',
      title: 'Suministros y Luz',
      subtitle: 'Contratos, Potencia (kW) y Fechas',
      icon: Zap,
      borderColor: 'border-amber-500/40 hover:border-amber-500',
      iconBg: 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'variables',
      title: 'Gastos Día a Día',
      subtitle: 'Supermercado, Gasolina, Ocio',
      icon: ShoppingCart,
      borderColor: 'border-orange-500/40 hover:border-orange-500',
      iconBg: 'bg-orange-500/20 text-orange-400',
    },
    {
      id: 'salud',
      title: 'Salud y Botiquín',
      subtitle: 'Citas, Calendario Médico y Medicinas',
      icon: HeartPulse,
      borderColor: 'border-purple-500/40 hover:border-purple-500',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
    {
      id: 'chat',
      title: 'Chat Familiar y Avisos',
      subtitle: 'Notas Locales y Recordatorios',
      icon: MessageSquare,
      borderColor: 'border-sky-500/40 hover:border-sky-500',
      iconBg: 'bg-sky-500/20 text-sky-400',
    },
    {
      id: 'grafico',
      title: 'Evolución y Meses',
      subtitle: 'Gráfico de Puntos de 6 Meses',
      icon: TrendingUp,
      borderColor: 'border-blue-500/40 hover:border-blue-500',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    {
      id: 'calculadora',
      title: 'Simulador de Ahorro',
      subtitle: 'Calculadora Vertical en Columna',
      icon: Calculator,
      borderColor: 'border-teal-500/40 hover:border-teal-500',
      iconBg: 'bg-teal-500/20 text-teal-400',
    },
    {
      id: 'optimizador',
      title: 'Optimizador Express',
      subtitle: 'Acciones Directas de Ahorro',
      icon: Lightbulb,
      borderColor: 'border-emerald-500/40 hover:border-emerald-500',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 pb-24">
      {/* Header */}
      <Header onOpenQRModal={() => setIsQRModalOpen(true)} />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto pt-6 space-y-6">
        {/* Banner Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Menú Principal Doméstico (Cajas Ciegas)
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Toca cualquier caja para desplegar sus datos y controles privados
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hidden sm:inline-block">
            9 Cajas Privadas
          </span>
        </div>

        {/* Giant Blind-Box Grid (Cuadrícula de Cajas Ciegas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuCards.map((card) => {
            const IconComponent = card.icon;

            return (
              <button
                key={card.id}
                onClick={() => setActiveModal(card.id)}
                className={`min-h-[120px] sm:h-36 rounded-3xl bg-slate-900 border-2 ${card.borderColor} p-5 sm:p-6 flex items-center justify-between active:scale-95 transition-all duration-200 cursor-pointer shadow-lg group relative overflow-hidden`}
              >
                {/* Background ambient glow */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-slate-800/40 blur-xl group-hover:scale-150 transition pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition`}
                  >
                    <IconComponent className="w-8 h-8 sm:w-9 sm:h-9" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white transition shrink-0 relative z-10">
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Floating Action Button (+) bottom right for Quick Expense entry */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setExpenseModalDefaultType('variable');
            setIsExpenseModalOpen(true);
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 flex items-center justify-center active:scale-90 transition cursor-pointer font-bold"
          title="Añadir Gasto Rápido"
        >
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>
      </div>

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Section Detail Full Modal / Sheet */}
      <SectionDetailModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenAddExpense={(type) => {
          setExpenseModalDefaultType(type);
          setIsExpenseModalOpen(true);
        }}
        onOpenAddAppointment={(tab) => {
          setAppointmentInitialTab(tab);
          setIsAppointmentModalOpen(true);
        }}
        onSelectContract={(contract) => setSelectedContract(contract)}
        onOpenSavingsModal={() => setIsSavingsModalOpen(true)}
      />

      {/* Auxiliary Action Modals */}
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        defaultType={expenseModalDefaultType}
      />
      <AddAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        initialTab={appointmentInitialTab}
      />
      <ContractDetailModal
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
      />
      <SavingsModal isOpen={isSavingsModalOpen} onClose={() => setIsSavingsModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
