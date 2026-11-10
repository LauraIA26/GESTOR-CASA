import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FixedExpense,
  UtilityContract,
  VariableExpense,
  MedicalAppointment,
  MedicineItem,
  MonthlyTrendData,
  SavingsTarget,
  OptimizationTip,
  ChatMessage
} from '../types/finance';
import {
  INITIAL_MONTHLY_SUMMARY,
  INITIAL_FIXED_EXPENSES,
  INITIAL_UTILITY_CONTRACTS,
  INITIAL_VARIABLE_EXPENSES,
  INITIAL_MEDICAL_APPOINTMENTS,
  INITIAL_MEDICINES,
  INITIAL_MONTHLY_TREND,
  INITIAL_SAVINGS_TARGET,
  INITIAL_TIPS,
  INITIAL_CHAT_MESSAGES,
  calcProratedMonthly
} from '../data/initialData';

const LOCAL_STORAGE_KEY = 'GESTOR_CASA_PRO_STATE_v2';

interface FinanceContextType {
  isIncognito: boolean;
  toggleIncognito: () => void;
  formatAmount: (amount: number, forceShow?: boolean) => string;
  activeFamily: string;
  setActiveFamily: (family: string) => void;
  familyMembers: string[];
  setFamilyMembers: (members: string[]) => void;
  monthlySummary: typeof INITIAL_MONTHLY_SUMMARY;
  fixedExpenses: FixedExpense[];
  toggleFixedPaid: (id: string) => void;
  addFixedExpense: (expense: Omit<FixedExpense, 'id' | 'proratedMonthly'>) => void;
  utilityContracts: UtilityContract[];
  updateContract: (id: string, updated: Partial<UtilityContract>) => void;
  variableExpenses: VariableExpense[];
  addVariableAmount: (id: string, delta: number) => void;
  addVariableExpense: (expense: Omit<VariableExpense, 'id'>) => void;
  medicalAppointments: MedicalAppointment[];
  toggleAppointmentCompleted: (id: string) => void;
  addAppointment: (appointment: Omit<MedicalAppointment, 'id'>) => void;
  medicines: MedicineItem[];
  updateMedicineStock: (id: string, newStock: number) => void;
  addMedicine: (med: Omit<MedicineItem, 'id'>) => void;
  savingsTarget: SavingsTarget;
  addToSavingsJar: (amount: number) => void;
  trendData: MonthlyTrendData[];
  tips: OptimizationTip[];
  toggleTipApplied: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  monthsOfPeace: number;
  totalFixedOriginalAmount: number;
  totalFixedProratedMonthly: number;
  totalFixedAmount: number;
  totalVariableAmount: number;
  totalSpentProrated: number;
  totalSpent: number;
  availableCashProrated: number;
  availableCash: number;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  resetAllData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isIncognito, setIsIncognito] = useState(false);
  const [activeFamily, setActiveFamily] = useState('Mi casa');
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [utilityContracts, setUtilityContracts] = useState<UtilityContract[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([]);
  const [medicalAppointments, setMedicalAppointments] = useState<MedicalAppointment[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [savingsTarget, setSavingsTarget] = useState<SavingsTarget>({ goalName: '', currentAmount: 0, targetAmount: 0, mandatoryMonthly: 0, deadline: '' });
  const [trendData, setTrendData] = useState<MonthlyTrendData[]>([]);
  const [tips, setTips] = useState<OptimizationTip[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.fixedExpenses) setFixedExpenses(parsed.fixedExpenses);
        if (parsed.utilityContracts) setUtilityContracts(parsed.utilityContracts);
        if (parsed.variableExpenses) setVariableExpenses(parsed.variableExpenses);
        if (parsed.medicalAppointments) setMedicalAppointments(parsed.medicalAppointments);
        if (parsed.medicines) setMedicines(parsed.medicines);
        if (parsed.savingsTarget) setSavingsTarget(parsed.savingsTarget);
        if (parsed.tips) setTips(parsed.tips);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.activeFamily) setActiveFamily(parsed.activeFamily);
        if (Array.isArray(parsed.familyMembers)) setFamilyMembers(parsed.familyMembers);
      }
    } catch (e) {
      console.error('Failed to load local state:', e);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        fixedExpenses,
        utilityContracts,
        variableExpenses,
        medicalAppointments,
        medicines,
        savingsTarget,
        tips,
        chatMessages,
        activeFamily,
        familyMembers,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [
    fixedExpenses,
    utilityContracts,
    variableExpenses,
    medicalAppointments,
    medicines,
    savingsTarget,
    tips,
    chatMessages,
    activeFamily,
    familyMembers,
  ]);

  const toggleIncognito = () => {
    setIsIncognito((prev) => !prev);
  };

  const formatAmount = (amount: number, forceShow: boolean = false): string => {
    if (isIncognito && !forceShow) {
      return '•••• €';
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalFixedOriginalAmount = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalFixedProratedMonthly = fixedExpenses.reduce((acc, curr) => acc + curr.proratedMonthly, 0);
  const totalVariableAmount = variableExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUtilitiesAmount = utilityContracts.reduce((acc, curr) => acc + curr.monthlyAmount, 0);
  
  const totalSpentProrated = totalFixedProratedMonthly + totalUtilitiesAmount + totalVariableAmount;
  const availableCashProrated = -totalSpentProrated - savingsTarget.mandatoryMonthly;

  // Calculation for "Meses de Tranquilidad" (Emergency colchón ÷ Monthly expenses)
  const monthsOfPeace = totalSpentProrated > 0
    ? Math.round((savingsTarget.currentAmount / totalSpentProrated) * 10) / 10
    : 0;

  const toggleFixedPaid = (id: string) => {
    setFixedExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, isPaid: !exp.isPaid } : exp))
    );
  };

  const addFixedExpense = (newExp: Omit<FixedExpense, 'id' | 'proratedMonthly'>) => {
    const proratedMonthly = calcProratedMonthly(newExp.amount, newExp.periodicity);
    const item: FixedExpense = {
      ...newExp,
      proratedMonthly,
      id: 'f_' + Date.now(),
    };
    setFixedExpenses((prev) => [...prev, item]);
  };

  const updateContract = (id: string, updated: Partial<UtilityContract>) => {
    setUtilityContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const addVariableAmount = (id: string, delta: number) => {
    setVariableExpenses((prev) =>
      prev.map((v) => (v.id === id ? { ...v, amount: Math.max(0, v.amount + delta) } : v))
    );
  };

  const addVariableExpense = (newVar: Omit<VariableExpense, 'id'>) => {
    const item: VariableExpense = {
      ...newVar,
      id: 'v_' + Date.now(),
    };
    setVariableExpenses((prev) => [...prev, item]);
  };

  const toggleAppointmentCompleted = (id: string) => {
    setMedicalAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isCompleted: !app.isCompleted } : app))
    );
  };

  const addAppointment = (newApp: Omit<MedicalAppointment, 'id'>) => {
    const item: MedicalAppointment = {
      ...newApp,
      id: 'm_' + Date.now(),
    };
    setMedicalAppointments((prev) => [...prev, item]);
  };

  const updateMedicineStock = (id: string, newStock: number) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: Math.max(0, newStock) } : m))
    );
  };

  const addMedicine = (newMed: Omit<MedicineItem, 'id'>) => {
    const item: MedicineItem = {
      ...newMed,
      id: 'med_' + Date.now(),
    };
    setMedicines((prev) => [...prev, item]);
  };

  const addToSavingsJar = (amount: number) => {
    setSavingsTarget((prev) => ({
      ...prev,
      currentAmount: prev.currentAmount + amount,
    }));
  };

  const toggleTipApplied = (id: string) => {
    setTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isApplied: !t.isApplied } : t))
    );
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      ...msg,
      id: 'c_' + Date.now(),
      timestamp: `Hoy, ${timeStr}h`,
    };
    setChatMessages((prev) => [newMsg, ...prev]);
  };

  const exportDataJSON = (): string => {
    const data = {
      fixedExpenses,
      utilityContracts,
      variableExpenses,
      medicalAppointments,
      medicines,
      savingsTarget,
      tips,
      chatMessages,
      activeFamily,
      familyMembers,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.fixedExpenses) setFixedExpenses(parsed.fixedExpenses);
      if (parsed.utilityContracts) setUtilityContracts(parsed.utilityContracts);
      if (parsed.variableExpenses) setVariableExpenses(parsed.variableExpenses);
      if (parsed.medicalAppointments) setMedicalAppointments(parsed.medicalAppointments);
      if (parsed.medicines) setMedicines(parsed.medicines);
      if (parsed.savingsTarget) setSavingsTarget(parsed.savingsTarget);
      if (parsed.tips) setTips(parsed.tips);
      if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      if (parsed.activeFamily) setActiveFamily(parsed.activeFamily);
      if (Array.isArray(parsed.familyMembers)) setFamilyMembers(parsed.familyMembers);
      else if (parsed.familyMembers !== undefined) return false;
      return true;
    } catch (e) {
      console.error('Invalid JSON string:', e);
      return false;
    }
  };

  const resetAllData = () => {
    setIsIncognito(false);
    setActiveFamily('Mi casa');
    setFamilyMembers([]);
    setFixedExpenses([]);
    setUtilityContracts([]);
    setVariableExpenses([]);
    setMedicalAppointments([]);
    setMedicines([]);
    setSavingsTarget({ goalName: '', currentAmount: 0, targetAmount: 0, mandatoryMonthly: 0, deadline: '' });
    setTrendData([]);
    setTips([]);
    setChatMessages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <FinanceContext.Provider
      value={{
        isIncognito,
        toggleIncognito,
        formatAmount,
        activeFamily,
        familyMembers,
        setActiveFamily,
        setFamilyMembers,
        monthlySummary: INITIAL_MONTHLY_SUMMARY,
        fixedExpenses,
        toggleFixedPaid,
        addFixedExpense,
        utilityContracts,
        updateContract,
        variableExpenses,
        addVariableAmount,
        addVariableExpense,
        medicalAppointments,
        toggleAppointmentCompleted,
        addAppointment,
        medicines,
        updateMedicineStock,
        addMedicine,
        savingsTarget,
        addToSavingsJar,
        trendData,
        tips,
        toggleTipApplied,
        chatMessages,
        addChatMessage,
        monthsOfPeace,
        totalFixedOriginalAmount,
        totalFixedProratedMonthly,
        totalFixedAmount: totalFixedOriginalAmount,
        totalVariableAmount,
        totalSpentProrated,
        totalSpent: totalSpentProrated,
        availableCashProrated,
        availableCash: availableCashProrated,
        exportDataJSON,
        importDataJSON,
        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
