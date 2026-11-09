import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { UtilityContract } from '../../types/finance';
import { Zap, Droplets, Wifi, Flame, AlertTriangle, Calendar, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface SuministrosCardProps {
  onSelectContract: (contract: UtilityContract) => void;
}

export const SuministrosCard: React.FC<SuministrosCardProps> = ({ onSelectContract }) => {
  const { utilityContracts, formatAmount } = useFinance();

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Luz':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Agua':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'Internet':
        return <Wifi className="w-4 h-4 text-indigo-600" />;
      default:
        return <Flame className="w-4 h-4 text-orange-600" />;
    }
  };

  const totalUtilities = utilityContracts.reduce((acc, curr) => acc + curr.monthlyAmount, 0);
  const alertCount = utilityContracts.filter((c) => c.isAlertNeeded).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-amber-200/80 dark:border-amber-950/80 flex flex-col justify-between relative overflow-hidden group"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                🟡 Suministros & Contratos
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Luz, Agua, Internet & Gas
              </h2>
            </div>
          </div>

          {alertCount > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {alertCount} Renovar
            </span>
          )}
        </div>

        {/* Total Utilities Banner */}
        <div className="bg-amber-50/70 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-100 dark:border-amber-900/40 mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 block">
              Gasto Mensual Suministros:
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-num">
              {formatAmount(totalUtilities)}
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            4 Contratos activos
          </div>
        </div>

        {/* Contracts Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {utilityContracts.map((contract) => (
            <div
              key={contract.id}
              onClick={() => onSelectContract(contract)}
              className="bg-slate-50/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition cursor-pointer active:scale-[0.98] flex items-center justify-between group/item"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  {getServiceIcon(contract.service)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {contract.service}
                    </h4>
                    {contract.isAlertNeeded && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {contract.provider}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-1.5">
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white font-mono-num">
                    {formatAmount(contract.monthlyAmount)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5 justify-end">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{contract.renewalDate}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:translate-x-0.5 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] font-medium text-slate-400">
        Haz clic en cualquier suministro para ver detalles de renovación y notas
      </div>
    </motion.div>
  );
};
