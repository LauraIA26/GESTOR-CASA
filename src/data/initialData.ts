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

export const INITIAL_MONTHLY_SUMMARY = {
  familyProfile: 'Familia García',
  monthName: 'Noviembre 2026',
  totalIncome: 3450,
  targetSavings: 500,
  currentSavingsJar: 8450,
};

export const INITIAL_SAVINGS_TARGET: SavingsTarget = {
  goalName: 'Fondo Emergencia & Vacaciones',
  currentAmount: 8450,
  targetAmount: 12000,
  mandatoryMonthly: 350,
  deadline: 'Diciembre 2027',
};

export const calcProratedMonthly = (amount: number, periodicity: string): number => {
  switch (periodicity) {
    case 'anual':
      return Math.round((amount / 12) * 10) / 10;
    case 'trimestral':
      return Math.round((amount / 3) * 10) / 10;
    case 'bimensual':
      return Math.round((amount / 2) * 10) / 10;
    default:
      return amount;
  }
};

export const INITIAL_FIXED_EXPENSES: FixedExpense[] = [
  {
    id: 'f1',
    name: 'Hipoteca Vivienda Principal',
    category: 'hipoteca',
    amount: 785,
    periodicity: 'mensual',
    proratedMonthly: 785,
    dueDate: 'Día 1',
    isPaid: true,
    provider: 'Banco Santander',
  },
  {
    id: 'f2',
    name: 'Seguro Hogar & Contenido',
    category: 'seguro',
    amount: 450,
    periodicity: 'anual',
    proratedMonthly: 37.5,
    dueDate: '15 Nov',
    isPaid: true,
    provider: 'Mapfre',
    notes: 'Prorrateo anual: 37,50€/mes en Hucha de Impuestos',
  },
  {
    id: 'f3',
    name: 'Seguro SUV Familiar',
    category: 'seguro',
    amount: 180,
    periodicity: 'trimestral',
    proratedMonthly: 60,
    dueDate: 'Día 10',
    isPaid: true,
    provider: 'Mutua Madrileña',
  },
  {
    id: 'f4',
    name: 'Impuesto IBI Municipal',
    category: 'impuesto',
    amount: 360,
    periodicity: 'anual',
    proratedMonthly: 30,
    dueDate: '20 Nov',
    isPaid: false,
    notes: 'Impuesto Anual: 30€/mes reservados en Hucha Impuestos',
  },
  {
    id: 'f5',
    name: 'Subscripciones Streaming (Netflix + Spotify)',
    category: 'subscripcion',
    amount: 28,
    periodicity: 'mensual',
    proratedMonthly: 28,
    dueDate: 'Día 22',
    isPaid: false,
  },
];

export const INITIAL_UTILITY_CONTRACTS: UtilityContract[] = [
  {
    id: 'u1',
    service: 'Luz',
    provider: 'Endesa Solar 3.0',
    monthlyAmount: 84,
    contractPowerKw: 4.6,
    costPerKwh: 0.14,
    renewalDate: '28 Nov 2026',
    isAlertNeeded: true,
    notes: 'Potencia 4.6 kW. Revisar horas valle para bajar cuota a 64€/mes.',
  },
  {
    id: 'u2',
    service: 'Agua',
    provider: 'Canal Isabel II',
    monthlyAmount: 32,
    renewalDate: 'Sin permanencia',
    isAlertNeeded: false,
  },
  {
    id: 'u3',
    service: 'Internet',
    provider: 'Digi Fibra 1Gbps',
    monthlyAmount: 30,
    renewalDate: '15 Ene 2027',
    isAlertNeeded: false,
  },
  {
    id: 'u4',
    service: 'Gas',
    provider: 'Naturgy TUR',
    monthlyAmount: 48,
    renewalDate: '10 Dic 2026',
    isAlertNeeded: true,
    notes: 'Tarifa regulada TUR activada para ahorro del 22%.',
  },
];

export const INITIAL_VARIABLE_EXPENSES: VariableExpense[] = [
  {
    id: 'v1',
    category: 'supermercado',
    name: 'Supermercado & Alimentación',
    amount: 410,
    maxBudget: 550,
    date: 'Semana 1-3',
  },
  {
    id: 'v2',
    category: 'gasolina',
    name: 'Gasolina & Transporte',
    amount: 145,
    maxBudget: 200,
    date: '05/11',
  },
  {
    id: 'v3',
    category: 'ocio',
    name: 'Ocio, Cenas & Extra',
    amount: 190,
    maxBudget: 300,
    date: '08/11',
  },
];

export const INITIAL_MEDICAL_APPOINTMENTS: MedicalAppointment[] = [
  {
    id: 'm1',
    patientName: 'Lucas (Hijo)',
    specialty: 'Pediatría - Vacunación',
    tag: 'pediatria',
    doctorName: 'Dra. Martínez',
    date: '2026-11-14',
    dayNumber: 14,
    time: '17:00h',
    location: 'Centro de Salud Norte',
    isCompleted: false,
  },
  {
    id: 'm2',
    patientName: 'Elena (Mamá)',
    specialty: 'Odontología - Limpieza',
    tag: 'dentista',
    doctorName: 'Dr. Ruiz',
    date: '2026-11-20',
    dayNumber: 20,
    time: '10:30h',
    location: 'Clínica Dental Sonrisas',
    isCompleted: false,
  },
  {
    id: 'm3',
    patientName: 'Carlos (Papá)',
    specialty: 'Oftalmología & Revisión',
    tag: 'especialista',
    doctorName: 'Dr. Blanco',
    date: '2026-11-25',
    dayNumber: 25,
    time: '12:00h',
    location: 'Hospital Infanta Sofía',
    isCompleted: false,
  },
];

export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'med1',
    name: 'Paracetamol 1g',
    dosage: '1 comprimido / 8h',
    stock: 12,
    minStock: 5,
    expiryDate: '10/2027',
  },
  {
    id: 'med2',
    name: 'Ibuprofeno 600mg',
    dosage: '1 sobre con comida',
    stock: 2,
    minStock: 6,
    expiryDate: '04/2027',
    alertDayNumber: 10,
    notes: '⚠️ Comprar recambio en farmacia (Día 10)',
  },
  {
    id: 'med3',
    name: 'Suero Oral Infantil',
    dosage: 'Según indicación',
    stock: 6,
    minStock: 3,
    expiryDate: '12/2026',
  },
  {
    id: 'med4',
    name: 'Jarabe Dalsy Pediatría',
    dosage: '5ml / 8h',
    stock: 1,
    minStock: 2,
    expiryDate: '11/2026',
    alertDayNumber: 18,
    notes: '⚠️ Próxima caducidad (Día 18)',
  },
];

export const INITIAL_MONTHLY_TREND: MonthlyTrendData[] = [
  { month: 'Jun', ingresos: 3400, gastos: 2420, ahorro: 980 },
  { month: 'Jul', ingresos: 3550, gastos: 2750, ahorro: 800 },
  { month: 'Ago', ingresos: 3400, gastos: 2890, ahorro: 510 },
  { month: 'Sep', ingresos: 3600, gastos: 2610, ahorro: 990 },
  { month: 'Oct', ingresos: 3450, gastos: 2280, ahorro: 1170 },
  { month: 'Nov', ingresos: 3450, gastos: 2182, ahorro: 1268 },
];

export const INITIAL_TIPS: OptimizationTip[] = [
  {
    id: 't1',
    title: 'Revisar tarifa de luz en horas valle',
    category: 'Suministros',
    potentialSavingsYearly: 240,
    description: 'Aprovecha las horas de 00:00h a 08:00h y fines de semana para electrodomésticos.',
    actionText: 'Aplicado ✅',
    impact: 'Alto',
    isApplied: false,
  },
  {
    id: 't2',
    title: 'Comprobar suscripciones fantasma o en desuso',
    category: 'Ocio & Streaming',
    potentialSavingsYearly: 140,
    description: 'Cancela servicios que no hayas usado en las últimas 3 semanas.',
    actionText: 'Aplicado ✅',
    impact: 'Fácil',
    isApplied: true,
  },
  {
    id: 't3',
    title: 'Optimizar potencia contratada en la factura de luz',
    category: 'Suministros',
    potentialSavingsYearly: 180,
    description: 'Bajar 1 kW de potencia contratada ahorra unos 45€/año por tramo.',
    actionText: 'Aplicado ✅',
    impact: 'Alto',
    isApplied: false,
  },
  {
    id: 't4',
    title: 'Planificar compra semanal con lista cerrada',
    category: 'Supermercado',
    potentialSavingsYearly: 520,
    description: 'Evita ir con hambre al súper y compra marcas blancas de calidad equivalente.',
    actionText: 'Aplicado ✅',
    impact: 'Medio',
    isApplied: false,
  },
  {
    id: 't5',
    title: 'Comparar póliza del seguro del vehículo',
    category: 'Seguros',
    potentialSavingsYearly: 160,
    description: 'Revisa bonificaciones sin siniestros antes de la renovación anual.',
    actionText: 'Aplicado ✅',
    impact: 'Fácil',
    isApplied: false,
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c1',
    sender: 'Elena (Mamá)',
    text: 'Acuerdo de compra en Mercadona para la semana: falta fruta y leche de avena.',
    timestamp: 'Hoy, 09:30h',
    category: 'Compra',
  },
  {
    id: 'c2',
    sender: 'Carlos (Papá)',
    text: 'Cita con la Dra. Martínez para Lucas el día 14 a las 17:00h anotada.',
    timestamp: 'Ayer, 18:15h',
    category: 'Aviso',
  },
  {
    id: 'c3',
    sender: 'Carlos (Papá)',
    text: 'He arreglado el grifo de la cocina. Todo sellado y sin goteo.',
    timestamp: 'Hace 2 días',
    category: 'Arreglo',
  },
];
