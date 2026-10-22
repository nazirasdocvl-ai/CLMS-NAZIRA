import React, { useState } from 'react';
import { Holiday } from '../types';
import { X, Calendar, Search, Info } from 'lucide-react';

interface HolidayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  holidays: Holiday[];
}

export const HolidayCalendarModal: React.FC<HolidayCalendarModalProps> = ({
  isOpen,
  onClose,
  holidays,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'GAZETTED' | 'RESTRICTED'>('ALL');

  if (!isOpen) return null;

  const filteredHolidays = holidays.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.date.includes(searchTerm) ||
      (h.description && h.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || h.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Government of Assam Official Holiday Calendar 2026
            </h2>
            <p className="text-xs text-slate-500">
              Applicable to Co-District Administration, Nazira, Dist: Sivasagar
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Civil CL Rule Note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Assam Civil Casual Leave Rule Note:</strong> Sundays and Gazetted Holidays falling within a period of Casual Leave are not debited against the 12-day annual Casual Leave account. Restricted Holidays (RH) can be availed up to 2 days per employee per year.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search holiday name, Bihu, festival..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {(['ALL', 'GAZETTED', 'RESTRICTED'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    typeFilter === t
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'ALL' ? 'All' : t === 'GAZETTED' ? 'Gazetted' : 'Restricted (RH)'}
                </button>
              ))}
            </div>
          </div>

          {/* Holidays List */}
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
            {filteredHolidays.map((h) => {
              const dateObj = new Date(h.date);
              const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={h.date + h.name} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-14 text-center bg-slate-100 rounded-md p-1.5 border border-slate-200 font-mono">
                      <span className="block text-[10px] text-slate-500 uppercase">{dayOfWeek}</span>
                      <span className="block text-sm font-bold text-slate-900">{dateObj.getDate()}</span>
                      <span className="block text-[9px] text-slate-500 uppercase">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{h.name}</h4>
                      <p className="text-[11px] text-slate-500">{h.description || 'Public holiday'}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      h.type === 'GAZETTED'
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        : 'text-purple-800 bg-purple-50 border-purple-200'
                    }`}
                  >
                    {h.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
