import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { MessageSquare, Send, Bell, ShoppingCart, Wrench, FileText, User } from 'lucide-react';
import { motion } from 'motion/react';

export const ChatFamiliarCard: React.FC = () => {
  const { chatMessages, addChatMessage, familyMembers } = useFinance();
  const [sender, setSender] = useState('');
  const [textInput, setTextInput] = useState('');
  const [category, setCategory] = useState<'Aviso' | 'Compra' | 'Arreglo' | 'Nota'>('Aviso');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !sender) return;
    addChatMessage({
      sender,
      text: textInput,
      category,
    });
    setTextInput('');
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Compra':
        return { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', icon: <ShoppingCart className="w-3 h-3" /> };
      case 'Arreglo':
        return { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', icon: <Wrench className="w-3 h-3" /> };
      case 'Aviso':
        return { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', icon: <Bell className="w-3 h-3" /> };
      default:
        return { bg: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300', icon: <FileText className="w-3 h-3" /> };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.22, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-sky-100 dark:border-sky-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                💬 Mensajería Local
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Chat Familiar y Avisos
              </h2>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200">
            {chatMessages.length} Mensajes
          </span>
        </div>

        {/* Sender & Category Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">Selecciona un miembro</option>
              {familyMembers.map((member) => <option key={member} value={member}>{member}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {(['Aviso', 'Compra', 'Arreglo', 'Nota'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-xl transition cursor-pointer ${
                  category === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Feed */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar mb-4">
          {chatMessages.map((msg) => {
            const badge = getCategoryBadge(msg.category);

            return (
              <div
                key={msg.id}
                className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {msg.sender}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.bg}`}
                    >
                      {badge.icon}
                      {msg.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {msg.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <input
          type="text"
          required
          placeholder="Escribe un aviso o nota para la casa..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-medium"
        />
        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white transition active:scale-95 cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};
