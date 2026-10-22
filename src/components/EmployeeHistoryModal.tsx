import React from 'react';
import { Employee, LeaveRequest, SMSNotification } from '../types';
import { X, Calendar, FileText, Phone, Send, CheckCircle2, MapPin } from 'lucide-react';

interface EmployeeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  requests: LeaveRequest[];
  onOpenPhoneSimulator: (mobile: string) => void;
  onViewOrder: (request: LeaveRequest) => void;
  onSendStatementSms: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  canEdit?: boolean;
}

export const EmployeeHistoryModal: React.FC<EmployeeHistoryModalProps> = ({
  isOpen,
  onClose,
  employee,
  requests,
  onOpenPhoneSimulator,
  onViewOrder,
  onSendStatementSms,
  onEditEmployee,
  canEdit = false,
}) => {
  if (!isOpen || !employee) return null;

  const empRequests = requests.filter((r) => r.employeeId === employee.id);
  const remainingCL = Math.max(0, employee.clTotalQuota - employee.clAvailed - employee.clPending);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {employee.employeeCode}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {employee.branch}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Casual Leave Passbook: {employee.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onEditEmployee && (
              <button
                onClick={() => {
                  onClose();
                  onEditEmployee(employee);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                title="Modify / Update Employee Details (Sanctioning Authority)"
              >
                Edit Details
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Employee Quota Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-500 block">Annual CL Quota</span>
              <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                {employee.clTotalQuota} Days
              </span>
              <span className="text-[11px] text-slate-400 block">Calendar Year 2026</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Availed</span>
              <span className="text-lg font-bold font-mono text-amber-700 tabular-nums">
                {employee.clAvailed} Days
              </span>
              <span className="text-[11px] text-slate-400 block">Sanctioned & Taken</span>
            </div>
            <div>
              <span className="text-slate-500 block">Under Review</span>
              <span className="text-lg font-bold font-mono text-blue-700 tabular-nums">
                {employee.clPending} Days
              </span>
              <span className="text-[11px] text-slate-400 block">In Verification</span>
            </div>
            <div>
              <span className="text-slate-500 block">Available Balance</span>
              <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">
                {remainingCL} Days
              </span>
              <span className="text-[11px] text-slate-400 block">Remaining Quota</span>
            </div>
          </div>

          {/* Quick SMS statement trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Registered Mobile: <strong className="font-mono">{employee.mobile}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSendStatementSms(employee)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send SMS Balance Alert</span>
              </button>
              <button
                onClick={() => onOpenPhoneSimulator(employee.mobile)}
                className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300 font-semibold rounded-md transition-colors cursor-pointer"
              >
                Inspect Handset
              </button>
            </div>
          </div>

          {/* Leave History List */}
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
              Leave Record Entries (Form No. 25 Ledger)
            </h3>

            {empRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                No casual leave records registered for this employee yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                {empRequests.map((req) => (
                  <div key={req.id} className="p-3.5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900">
                          {req.memoNo}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({new Date(req.appliedAt).toLocaleDateString()})
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${
                            req.status === 'SANCTIONED'
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : req.status === 'RECOMMENDED'
                              ? 'text-blue-800 bg-blue-50 border-blue-200'
                              : req.status === 'REJECTED'
                              ? 'text-red-800 bg-red-50 border-red-200'
                              : 'text-amber-800 bg-amber-50 border-amber-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="text-slate-700">
                        <strong className="font-mono">{req.startDate} to {req.endDate}</strong> ({req.totalDays} day(s))
                        <span className="text-slate-400 mx-1.5">·</span>
                        <span>{req.reasonCategory}: {req.reasonDetails}</span>
                      </div>

                      {req.stationLeaveRequired && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                          <MapPin className="w-3 h-3" />
                          <span>Station Leave Address: {req.stationLeaveAddress}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {req.sanctionOrderNo && (
                        <button
                          onClick={() => onViewOrder(req)}
                          className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Order Memo</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
