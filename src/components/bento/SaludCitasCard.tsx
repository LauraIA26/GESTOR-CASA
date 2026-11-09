import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { HeartPulse, Calendar, Pill, AlertTriangle, Plus, CheckCircle, Clock, User, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SaludCitasCardProps {
  onOpenAddAppointment: () => void;
  onOpenAddMedicine: () => void;
}

export const SaludCitasCard: React.FC<SaludCitasCardProps> = ({
  onOpenAddAppointment,
  onOpenAddMedicine,
}) => {
  const {
    medicalAppointments,
    toggleAppointmentCompleted,
    medicines,
    updateMedicineStock,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'calendario' | 'citas' | 'botiquin'>('calendario');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(14); // default 14 Nov
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // Noviembre (0-indexed 10)

  const monthNames = [
    'Enero 2026',
    'Febrero 2026',
    'Marzo 2026',
    'Abril 2026',
    'Mayo 2026',
    'Junio 2026',
    'Julio 2026',
    'Agosto 2026',
    'Septiembre 2026',
    'Octubre 2026',
    'Noviembre 2026',
    'Diciembre 2026',
  ];

  // Calendar grid math for Nov 2026 (starts on Sunday / 30 days)
  const daysInMonth = 30;
  const startOffset = 6; // Sunday is 7th day of week (L=0, M=1, X=2, J=3, V=4, S=5, D=6)

  // Map appointments & medicines to days
  const getDayEvents = (day: number) => {
    const apps = medicalAppointments.filter((a) => a.dayNumber === day);
    const meds = medicines.filter((m) => m.alertDayNumber === day);
    return { apps, meds };
  };

  const selectedDayEvents = getDayEvents(selectedDayNumber);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'pediatria':
        return 'bg-emerald-500';
      case 'dentista':
        return 'bg-blue-500';
      default:
        return 'bg-purple-500';
    }
  };

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case 'pediatria':
        return '🟢 Pediatría';
      case 'dentista':
        return '🔵 Dentista';
      default:
        return '🟣 Especialista';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-purple-100 dark:border-purple-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                🟣 Salud & Calendario Médico
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Citas, Calendario y Botiquín
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {activeTab === 'botiquin' ? (
              <button
                onClick={onOpenAddMedicine}
                className="p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition active:scale-[0.97] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Añadir medicamento al botiquín"
              >
                <Plus className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onOpenAddAppointment}
                className="p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition active:scale-[0.97] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Añadir cita médica"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTab('calendario')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'calendario'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendario</span>
          </button>
          <button
            onClick={() => setActiveTab('citas')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'citas'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Lista ({medicalAppointments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('botiquin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'botiquin'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Botiquín ({medicines.length})</span>
          </button>
        </div>

        {/* TAB 1: Calendario Médico Mensual Interactivo */}
        {activeTab === 'calendario' && (
          <div className="space-y-3">
            {/* Month Header Switcher */}
            <div className="flex items-center justify-between px-2 py-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {monthNames[currentMonthIndex]}
              </span>
              <button
                onClick={() => setCurrentMonthIndex((prev) => Math.min(11, prev + 1))}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Color Legend */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Pediatría</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Dentista</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Especialista</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Medicina</span>
            </div>

            {/* Calendar Grid Header (L-D) */}
            <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400">
              <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Offset blanks */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`blank-${i}`} className="h-9 rounded-xl bg-slate-50/30 dark:bg-slate-900/30" />
              ))}

              {/* Days 1 to 30 */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { apps, meds } = getDayEvents(day);
                const isSelected = selectedDayNumber === day;
                const hasEvents = apps.length > 0 || meds.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDayNumber(day)}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-purple-600 text-white font-extrabold shadow-sm'
                        : hasEvents
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-slate-900 dark:text-white font-bold border border-purple-200 dark:border-purple-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">{day}</span>

                    {/* Color Dots */}
                    {hasEvents && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {apps.map((a) => (
                          <span key={a.id} className={`w-1.5 h-1.5 rounded-full ${getTagColor(a.tag)}`} />
                        ))}
                        {meds.map((m) => (
                          <span key={m.id} className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Details Panel */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 mt-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Eventos del Día {selectedDayNumber} de Noviembre:
              </span>

              {selectedDayEvents.apps.length === 0 && selectedDayEvents.meds.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Sin citas ni recordatorios de medicación para este día.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.apps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => toggleAppointmentCompleted(app.id)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {app.patientName}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            {getTagBadge(app.tag)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {app.specialty} · {app.time} en {app.location}
                        </p>
                      </div>
                      <button
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          app.isCompleted ? 'bg-emerald-500 text-white' : 'border border-slate-300'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {selectedDayEvents.meds.map((med) => (
                    <div
                      key={med.id}
                      className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Recambio de {med.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {med.notes || `Stock actual: ${med.stock} unidades`}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        🔴 Alerta
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Full Appointments List */}
        {activeTab === 'citas' && (
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar">
            {medicalAppointments.map((app) => (
              <div
                key={app.id}
                onClick={() => toggleAppointmentCompleted(app.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  app.isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800/80 border-purple-100 dark:border-purple-900/60 shadow-xs hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {app.patientName}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          {getTagBadge(app.tag)}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                        {app.specialty} {app.location ? `· ${app.location}` : ''}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          Día {app.dayNumber} Nov ({app.date})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          {app.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      app.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-purple-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Botiquín Doméstico */}
        {activeTab === 'botiquin' && (
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar">
            {medicines.map((med) => {
              const isLow = med.stock <= med.minStock;

              return (
                <div
                  key={med.id}
                  className={`p-3 rounded-2xl border transition ${
                    isLow
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {med.name}
                        </h4>
                        {isLow && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Reponer
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Dosis: {med.dosage} · Caducidad: {med.expiryDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-700 p-1 rounded-xl border border-slate-200 dark:border-slate-600">
                      <button
                        onClick={() => updateMedicineStock(med.id, med.stock - 1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold font-mono-num px-1 text-slate-900 dark:text-white min-w-[20px] text-center">
                        {med.stock}
                      </span>
                      <button
                        onClick={() => updateMedicineStock(med.id, med.stock + 1)}
                        className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 flex items-center justify-center active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] font-medium text-slate-400">
        Calendario mensual con código de colores para citas familiares y repuesto de farmacia
      </div>
    </motion.div>
  );
};
