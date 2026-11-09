import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FamilyMember } from '../../types/finance';
import { X, Users, UserPlus, Trash2, Plus, Edit2, Home, Check } from 'lucide-react';

interface FamilySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FamilySettingsModal: React.FC<FamilySettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    activeFamily,
    setActiveFamily,
    familyProfiles,
    addFamilyProfile,
    familyMembers,
    addFamilyMember,
    removeFamilyMember,
  } = useFinance();

  // Form states
  const [newProfileName, setNewProfileName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState<FamilyMember['role']>('Hijo/a');

  if (!isOpen) return null;

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    addFamilyProfile(newProfileName.trim());
    setNewProfileName('');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    addFamilyMember({
      name: memberName.trim(),
      role: memberRole,
    });
    setMemberName('');
  };

  const rolesList: FamilyMember['role'][] = ['Mamá', 'Papá', 'Hijo/a', 'Abuelo/a', 'Mascota', 'Inquilino/a', 'Otro'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-[32px] bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Personalizar Familia y Miembros
              </h3>
              <p className="text-xs text-slate-400">
                Añade tus nombres familiares y personaliza los integrantes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="py-4 space-y-6 overflow-y-auto no-scrollbar flex-1 pr-1">
          {/* SECTION 1: Nombre del Hogar / Familia */}
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-emerald-400" />
                Nombre del Hogar Activo:
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {activeFamily}
              </span>
            </div>

            {/* Profile Selection */}
            <div className="flex items-center gap-2 flex-wrap">
              {familyProfiles.map((prof) => (
                <button
                  key={prof}
                  type="button"
                  onClick={() => setActiveFamily(prof)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeFamily === prof
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {activeFamily === prof && <Check className="w-3.5 h-3.5 text-white" />}
                  <span>{prof}</span>
                </button>
              ))}
            </div>

            {/* Add New Household Profile Form */}
            <form onSubmit={handleAddProfile} className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
              <input
                type="text"
                placeholder="Ej. Familia García López..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </form>
          </div>

          {/* SECTION 2: Integrantes / Miembros de la Familia */}
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Integrantes de la Familia ({familyMembers.length}):
            </h4>

            {/* Members List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        {member.name}
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Rol: {member.role}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFamilyMember(member.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                    title="Eliminar miembro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Member Form */}
            <form onSubmit={handleAddMember} className="space-y-3 pt-3 border-t border-slate-700/50">
              <span className="text-[11px] font-bold text-slate-300 block">
                Añadir Nuevo Integrante:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre (ej. Sofía, Lucas, Papá...)"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      Rol: {r}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar Integrante</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
