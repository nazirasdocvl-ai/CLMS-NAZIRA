import React, { useState } from 'react';
import { Employee, LeaveRequest } from '../types';
import { Search, Plus, UserPlus, Phone, Mail, Calendar, FileText, ArrowUpRight, Send, Edit3, ShieldCheck, Lock } from 'lucide-react';

interface EmployeeLedgerViewProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onOpenApplyForEmployee: (employeeId: string) => void;
  onOpenNewEmployeeModal?: () => void;
  onOpenPhoneSimulator: (mobile: string) => void;
  onViewEmployeeHistory: (employee: Employee) => void;
  onEditEmployee?: (employee: Employee) => void;
  canEdit?: boolean;
}

export const EmployeeLedgerView: React.FC<EmployeeLedgerViewProps> = ({
  employees,
  leaveRequests,
  onOpenApplyForEmployee,
  onOpenNewEmployeeModal,
  onOpenPhoneSimulator,
  onViewEmployeeHistory,
  onEditEmployee,
  canEdit = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.mobile.includes(searchTerm);

    const matchesBranch = branchFilter === 'ALL' || emp.branch === branchFilter;

    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-5">
      {/* Search and Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee by name, designation, code, or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
            >
              <option value="ALL">All Branches ({employees.length})</option>
              <option value="Co-District Administration / Executive">Co-District Administration / Executive</option>
              <option value="Revenue & Circle Office">Revenue & Circle Office</option>
              <option value="Nazir Branch">Nazir Branch</option>
              <option value="Establishment Section">Establishment Section</option>
              <option value="Development Branch">Development Branch</option>
              <option value="Land Records & Lot Mandal">Land Records & Lot Mandal</option>
              <option value="e-Governance & IT Cell">e-Governance & IT Cell</option>
              <option value="Grade IV & General Pool">Grade IV & General Pool</option>
            </select>

            {canEdit && onOpenNewEmployeeModal && (
              <button
                onClick={onOpenNewEmployeeModal}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Add New Employee (Sanctioning Authority)"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add CDC Staff</span>
              </button>
            )}
          </div>
        </div>

        {/* Access Rights Note */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          {canEdit ? (
            <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Sanctioning Authority: You have full permissions to modify employee details, leave quotas, and records.</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Staff View (Read-Only): Modifying employee data and records is restricted to the Sanctioning Authority.</span>
            </div>
          )}
          <span className="text-slate-400 font-mono hidden sm:inline">Active Staff: {filteredEmployees.length}</span>
        </div>
      </div>

      {/* Staff Ledger Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const remainingCL = Math.max(0, emp.clTotalQuota - emp.clAvailed - emp.clPending);
          const percentUsed = Math.min(100, Math.round((emp.clAvailed / emp.clTotalQuota) * 100));

          // Count active leaves
          const activeLeaveCount = leaveRequests.filter(
            (r) => r.employeeId === emp.id && (r.status === 'SUBMITTED' || r.status === 'RECOMMENDED')
          ).length;

          return (
            <div
              key={emp.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Top metadata */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {emp.employeeCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {emp.designation}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {emp.branch}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenPhoneSimulator(emp.mobile)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
                    title="Simulate SMS on this employee's handset"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Contact strip */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{emp.mobile}</span>
                  <span>Joined: {new Date(emp.joiningDate).getFullYear()}</span>
                </div>
              </div>

              {/* CL Balance Ledger Box */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-600">Casual Leave (CL) Balance:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    <strong className="text-emerald-700 text-sm">{remainingCL}</strong> / {emp.clTotalQuota} Days
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percentUsed > 80 ? 'bg-red-500' : percentUsed > 50 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>

                {/* Breakdown */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Availed: {emp.clAvailed}d</span>
                  <span>·</span>
                  <span>In-Process: {emp.clPending}d</span>
                  <span>·</span>
                  <span>RH Availed: {emp.rhAvailed}/{emp.rhQuota}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewEmployeeHistory(emp)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer flex items-center gap-1"
                    title="View Leave Passbook"
                  >
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>Passbook</span>
                  </button>

                  {canEdit && onEditEmployee && (
                    <button
                      onClick={() => onEditEmployee(emp)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold transition-colors cursor-pointer flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200"
                      title="Modify / Update Employee Details & Leave Quota (Sanctioning Authority)"
                    >
                      <Edit3 className="w-3 h-3 text-blue-600" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onOpenApplyForEmployee(emp.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Apply CL</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
