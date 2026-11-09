import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { LineChart, TrendingUp, Filter, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export const GraficoPuntosCard: React.FC = () => {
  const { trendData, formatAmount, isIncognito } = useFinance();
  const [viewMetric, setViewMetric] = useState<'gastos' | 'ingresos' | 'ahorro'>('gastos');
  const [activePoint, setActivePoint] = useState<number | null>(5); // default last month

  // Chart dimensions & scaling
  const chartHeight = 160;
  const chartWidth = 480;
  const paddingX = 40;
  const paddingY = 25;

  const values = trendData.map((d) => d[viewMetric]);
  const maxValue = Math.max(...values, 3800);
  const minValue = Math.min(...values, 500);

  // Map values to coordinates
  const points = trendData.map((d, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (trendData.length - 1);
    const normalizedY = (d[viewMetric] - minValue) / (maxValue - minValue || 1);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y, month: d.month, val: d[viewMetric], fullData: d };
  });

  // Construct SVG path string for connected line
  const linePath = points.reduce((acc, point, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }, '');

  // Fill area path string
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - 10} L ${points[0].x} ${chartHeight - 10} Z`;

  const getMetricColor = () => {
    switch (viewMetric) {
      case 'ingresos':
        return { stroke: '#43AA8B', bg: 'rgba(67, 170, 139, 0.15)', text: 'text-emerald-600' };
      case 'ahorro':
        return { stroke: '#277DA1', bg: 'rgba(39, 125, 161, 0.15)', text: 'text-sky-600' };
      default:
        return { stroke: '#F3722C', bg: 'rgba(243, 114, 44, 0.15)', text: 'text-orange-600' };
    }
  };

  const metricColors = getMetricColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2"
    >
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                📈 Tendencia Histórica
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Gráfico de Puntos por Meses
              </h2>
            </div>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMetric('gastos')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                viewMetric === 'gastos'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setViewMetric('ingresos')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                viewMetric === 'ingresos'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setViewMetric('ahorro')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                viewMetric === 'ahorro'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Ahorro
            </button>
          </div>
        </div>

        {/* Selected Month Tooltip Box */}
        {activePoint !== null && (
          <div className="mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Mes seleccionado: <strong className="text-slate-900 dark:text-white">{points[activePoint].month} 2026</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 capitalize block">{viewMetric}:</span>
              <span className={`text-base font-extrabold font-mono-num ${metricColors.text}`}>
                {formatAmount(points[activePoint].val)}
              </span>
            </div>
          </div>
        )}

        {/* SVG Interactive Connected Dot Chart */}
        <div className="relative w-full overflow-x-auto no-scrollbar py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metricColors.stroke} stopOpacity="0.25" />
                <stop offset="100%" stopColor={metricColors.stroke} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />
            <line x1="20" y1="80" x2={chartWidth - 20} y2="80" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />
            <line x1="20" y1="130" x2={chartWidth - 20} y2="130" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />

            {/* Filled area */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* Connected Line */}
            <path
              d={linePath}
              fill="none"
              stroke={metricColors.stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* Interactive Points / Circles */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                className="cursor-pointer group/dot"
                onClick={() => setActivePoint(idx)}
              >
                {/* Pulse ring for active point */}
                {activePoint === idx && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill={metricColors.stroke}
                    fillOpacity="0.2"
                    className="animate-ping"
                  />
                )}
                {/* Outer point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={activePoint === idx ? '8' : '6'}
                  fill="#ffffff"
                  stroke={metricColors.stroke}
                  strokeWidth="3.5"
                  className="transition-all duration-200 group-hover/dot:scale-125"
                />

                {/* Month Label below */}
                <text
                  x={pt.x}
                  y={chartHeight - 2}
                  textAnchor="middle"
                  className={`text-[11px] font-extrabold ${
                    activePoint === idx ? 'fill-slate-900 dark:fill-white font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-slate-400">
        <span>Toca cualquier punto para consultar la cifra exacta</span>
        <span className="font-mono-num font-bold text-emerald-600">6 Meses trazados</span>
      </div>
    </motion.div>
  );
};
