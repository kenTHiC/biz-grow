import React from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { CalendarDays, Download } from "lucide-react";

export default function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  onExport,
  isExporting = false
}) {
  const presetRanges = [
    { label: "Last 7 days", value: "7d", start: subDays(new Date(), 7), end: new Date() },
    { label: "Last 30 days", value: "30d", start: subDays(new Date(), 30), end: new Date() },
    { label: "This month", value: "month", start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    { label: "Last 3 months", value: "3m", start: subDays(new Date(), 90), end: new Date() },
  ];

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    const range = presetRanges.find(r => r.value === preset);
    if (range) {
      onDateRangeChange({ from: range.start, to: range.end });
    }
  };

  const handleFromDateChange = (e) => {
    const newDate = new Date(e.target.value);
    onDateRangeChange({
      ...dateRange,
      from: newDate
    });
  };

  const handleToDateChange = (e) => {
    const newDate = new Date(e.target.value);
    onDateRangeChange({
      ...dateRange,
      to: newDate
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-900">Time Period</h3>
          </div>

          <select
            onChange={handlePresetChange}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select preset range</option>
            {presetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <div className="flex gap-3 items-center">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-600 mb-1">From</label>
              <input
                type="date"
                value={dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                onChange={handleFromDateChange}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-slate-600 mb-1">To</label>
              <input
                type="date"
                value={dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                onChange={handleToDateChange}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-lg"
        >
          {isExporting ? (
            'Exporting...'
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
