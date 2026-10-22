import React, { useState, useMemo } from 'react';
import { Employee, LeaveRequest, LeaveType } from '../types';
import { X, Calendar, MapPin, Send, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface LeaveApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  currentEmployeeId?: string;
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'memoNo' | 'appliedAt' | 'smsNotificationIds' | 'timeline'>) => void;
}

export const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({
  isOpen,
  onClose,
  employees,
  currentEmployeeId,
  onSubmit,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    currentEmployeeId || employees[4]?.id || employees[0]?.id || ''
  );
  const [leaveType, setLeaveType] = useState<LeaveType>('CASUAL_LEAVE');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [reasonCategory, setReasonCategory] = useState<LeaveRequest['reasonCategory']>('Urgent Family Affairs');
  const [reasonDetails, setReasonDetails] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [stationLeaveRequired, setStationLeaveRequired] = useState<boolean>(false);
  const [stationLeaveAddress, setStationLeaveAddress] = useState<string>('');
  const [chargeHandoverEmpId, setChargeHandoverEmpId] = useState<string>('');

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmpId);
  }, [employees, selectedEmpId]);

  // Update contact number when employee changes
  React.useEffect(() => {
    if (selectedEmployee) {
      setContactNumber(selectedEmployee.mobile);
    }
  }, [selectedEmployee]);

  // Calculate leave days count
  const calculatedDays = useMemo(() => {
    if (leaveType === 'HALF_DAY_CL_FN' || leaveType === 'HALF_DAY_CL_AN') {
      return 0.5;
    }
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 1;

    let days = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const dayOfWeek = cur.getDay();
      // Skip Sundays in civil casual leave computation
      if (dayOfWeek !== 0) {
        days++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, days);
  }, [startDate, endDate, leaveType]);

  const availableBalance = useMemo(() => {
    if (!selectedEmployee) return 0;
    if (leaveType === 'RESTRICTED_HOLIDAY') {
      return selectedEmployee.rhQuota - selectedEmployee.rhAvailed;
    }
    return Math.max(0, selectedEmployee.clTotalQuota - selectedEmployee.clAvailed - selectedEmployee.clPending);
  }, [selectedEmployee, leaveType]);

  const hasExceededBalance = calculatedDays > availableBalance;

  const handoverColleague = useMemo(() => {
    return employees.find((e) => e.id === chargeHandoverEmpId);
  }, [employees, chargeHandoverEmpId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    if (!reasonDetails.trim()) {
      alert('Please state the specific reason for casual leave.');
      return;
    }

    if (stationLeaveRequired && !stationLeaveAddress.trim()) {
      alert('Please provide the destination address and contact place during station leave.');
      return;
    }

    onSubmit({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      designation: selectedEmployee.designation,
      branch: selectedEmployee.branch,
      leaveType,
      startDate,
      endDate: leaveType.startsWith('HALF_DAY') ? startDate : endDate,
      totalDays: calculatedDays,
      reasonCategory,
      reasonDetails,
      contactNumberDuringLeave: contactNumber || selectedEmployee.mobile,
      stationLeaveRequired,
      stationLeaveAddress: stationLeaveRequired ? stationLeaveAddress : undefined,
      chargeHandoverEmployeeId: handoverColleague?.id,
      chargeHandoverEmployeeName: handoverColleague ? `${handoverColleague.name} (${handoverColleague.designation})` : undefined,
      status: 'SUBMITTED',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Casual Leave Application (Form No. 25)
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                Staff Verified (emp)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Office of the Co-District Commissioner, Nazira
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Employee Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Applicant Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.designation} ({emp.branch})
                </option>
              ))}
            </select>
          </div>

          {/* Balance info strip */}
          {selectedEmployee && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-emerald-900 font-medium">
                  {selectedEmployee.name} ({selectedEmployee.employeeCode})
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-emerald-950">
                <span>Total Quota: <strong>{selectedEmployee.clTotalQuota}d</strong></span>
                <span>·</span>
                <span>Availed: <strong>{selectedEmployee.clAvailed}d</strong></span>
                <span>·</span>
                <span className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-semibold text-emerald-800">
                  Balance Available: {availableBalance}d
                </span>
              </div>
            </div>
          )}

          {/* Leave Type & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Leave Nature
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="CASUAL_LEAVE">Casual Leave (Full Day)</option>
                <option value="HALF_DAY_CL_FN">Half Day (Forenoon FN)</option>
                <option value="HALF_DAY_CL_AN">Half Day (Afternoon AN)</option>
                <option value="RESTRICTED_HOLIDAY">Restricted Holiday (RH)</option>
                <option value="COMPENSATORY_CL">Compensatory Leave (CCL)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                From Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value > endDate) {
                      setEndDate(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                To Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={leaveType.startsWith('HALF_DAY') ? startDate : endDate}
                  min={startDate}
                  disabled={leaveType.startsWith('HALF_DAY')}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Calculated days badge & warning */}
          <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-600">
              Computed Duration: <strong className="text-slate-900 font-mono text-sm">{calculatedDays} Day(s)</strong> (Sundays excluded)
            </span>
            {hasExceededBalance ? (
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Exceeds available balance ({availableBalance}d)</span>
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                Remaining after sanction: {availableBalance - calculatedDays} days
              </span>
            )}
          </div>

          {/* Reason Category & Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Reason Category <span className="text-red-500">*</span>
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value as LeaveRequest['reasonCategory'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Urgent Family Affairs">Urgent Family Affairs</option>
                <option value="Medical / Health">Medical / Health Consultation</option>
                <option value="Domestic Emergency">Domestic Emergency</option>
                <option value="Religious & Cultural Observance">Religious & Cultural Observance</option>
                <option value="Official Examination">Official Examination / Study</option>
                <option value="Social Duty">Social / Community Obligation</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Reason Details / Justification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Attending to urgent family matter at ancestral home; urgent court appearance"
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Contact Mobile & Charge Handover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Contact Phone for SMS Alerts <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 94350 XXXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <p className="text-[11px] text-slate-500">
                Automated SMS alerts will be dispatched to this number.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Charge Handover Colleague (Urgent Desk Files)
              </label>
              <select
                value={chargeHandoverEmpId}
                onChange={(e) => setChargeHandoverEmpId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="">-- Select Colleague to Attend Desk --</option>
                {employees
                  .filter((e) => e.id !== selectedEmpId)
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.designation}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Station Leave Permission */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stationLeave"
                checked={stationLeaveRequired}
                onChange={(e) => setStationLeaveRequired(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
              />
              <label htmlFor="stationLeave" className="text-xs font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Station Leave Permission required (Leaving Co-District Administration, Nazira Headquarters)</span>
              </label>
            </div>

            {stationLeaveRequired && (
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Destination Outstation Address & Emergency Contact Place <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Village Borholla / Guwahati / Jorhat with full local contact location"
                  value={stationLeaveAddress}
                  onChange={(e) => setStationLeaveAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  required={stationLeaveRequired}
                />
              </div>
            )}
          </div>

          {/* Real-time SMS Dispatch Notice */}
          <div className="text-xs text-slate-500 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Real-time SMS notification will be automatically transmitted via DLT gateway <strong>AS-CDCNZR</strong> to applicant and sanctioning officer.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasExceededBalance}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit & Dispatch SMS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
