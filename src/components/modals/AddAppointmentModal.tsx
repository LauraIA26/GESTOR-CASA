import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, Calendar, Pill, PlusCircle } from 'lucide-react';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'cita' | 'medicamento';
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'cita',
}) => {
  const { addAppointment, addMedicine, familyMembers } = useFinance();
  const [activeTab, setActiveTab] = useState<'cita' | 'medicamento'>(initialTab);

  // Appointment Form state
  const [patientName, setPatientName] = useState('Lucas (Hijo)');
  const [specialty, setSpecialty] = useState('');
  const [appointmentTag, setAppointmentTag] = useState<'pediatria' | 'dentista' | 'especialista'>('pediatria');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('2026-11-25');
  const [time, setTime] = useState('11:00h');
  const [location, setLocation] = useState('Centro de Salud');

  // Medicine Form state
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 comp / 8h');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('4');
  const [expiryDate, setExpiryDate] = useState('12/2027');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'cita') {
      if (!specialty || !location) return;
      const dayNumber = parseInt(date.split('-')[2]) || 15;
      addAppointment({
        patientName,
        specialty,
        tag: appointmentTag,
        doctorName: doctorName || undefined,
        date,
        dayNumber,
        time,
        location,
        isCompleted: false,
      });
    } else {
      if (!medName) return;
      addMedicine({
        name: medName,
        dosage,
        stock: Number(stock),
        minStock: Number(minStock),
        expiryDate,
        notes: notes || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Salud Familiar & Botiquín
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => setActiveTab('cita')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'cita'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Cita Médica</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medicamento')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'medicamento'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Medicamento Botiquín</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'cita' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Familiar / Paciente:
                </label>
                <select
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={`${m.name} (${m.role})`}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                  <option value="Toda la Familia">Toda la Familia</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Especialidad / Motivo de consulta:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pediatría, Odontología, Oftalmología..."
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Fecha:
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Hora:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 17:00h"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Lugar / Centro Médico:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Centro de Salud Norte, Clínica Sonrisas..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Médico / Especialista (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Dra. Martínez"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del medicamento:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Paracetamol 1g, Ibuprofeno..."
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dosis recomendada:
                </label>
                <input
                  type="text"
                  placeholder="Ej. 1 comprimido cada 8 horas con comida"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock actual:
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock mínimo:
                  </label>
                  <input
                    type="number"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Caducidad:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12/2027"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notas / Observaciones (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. Comprar recambio antes del viaje"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition active:scale-[0.97] cursor-pointer min-h-[44px]"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
