export type CategoryType = 'fijos' | 'suministros' | 'variables' | 'ahorro' | 'salud' | 'chat';

export type PeriodicityType = 'mensual' | 'bimensual' | 'trimestral' | 'anual';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Mamá' | 'Papá' | 'Hijo/a' | 'Abuelo/a' | 'Mascota' | 'Inquilino/a' | 'Otro';
  notes?: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  category: 'hipoteca' | 'seguro' | 'impuesto' | 'subscripcion';
  amount: number; // Original billing amount
  periodicity: PeriodicityType; // Mensual, Bimensual, Trimestral, Anual
  proratedMonthly: number; // Calculated monthly impact
  dueDate: string; // e.g., 'Día 1' or '15 Nov'
  isPaid: boolean;
  provider?: string;
  notes?: string;
}

export interface UtilityContract {
  id: string;
  service: 'Luz' | 'Agua' | 'Internet' | 'Gas';
  provider: string;
  monthlyAmount: number;
  contractPowerKw?: number; // Power in kW (e.g., 4.6 kW)
  costPerKwh?: number; // Cost €/kWh (e.g., 0.14 €)
  renewalDate: string;
  contractUrl?: string;
  notes?: string;
  isAlertNeeded?: boolean;
}

export interface VariableExpense {
  id: string;
  category: 'supermercado' | 'gasolina' | 'ocio' | 'otros';
  name: string;
  amount: number;
  maxBudget: number;
  date: string;
}

export type AppointmentTag = 'pediatria' | 'dentista' | 'especialista';

export interface MedicalAppointment {
  id: string;
  patientName: string;
  specialty: string;
  tag: AppointmentTag;
  doctorName?: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-31 for calendar matching
  time: string;
  location: string;
  isCompleted: boolean;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  minStock: number;
  expiryDate: string;
  alertDayNumber?: number; // Day of month for renewal/expiry alert
  notes?: string;
}

export interface MonthlyTrendData {
  month: string;
  ingresos: number;
  gastos: number;
  ahorro: number;
}

export interface SavingsTarget {
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  mandatoryMonthly: number;
  deadline: string;
}

export interface OptimizationTip {
  id: string;
  title: string;
  category: string;
  potentialSavingsYearly: number;
  description: string;
  actionText: string;
  impact: 'Alto' | 'Medio' | 'Fácil';
  isApplied?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  category: 'Aviso' | 'Compra' | 'Arreglo' | 'Nota';
}
