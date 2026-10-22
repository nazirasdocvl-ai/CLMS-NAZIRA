import React, { useState, useEffect } from 'react';
import { Employee, Branch, UserRole } from '../types';
import { X, Save, Trash2, Edit3, ShieldAlert } from 'lucide-react';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onUpdateEmployee: (updated: Employee) => void;
  onDeleteEmployee?: (employeeId: string) => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [designation, setDesignation] = useState('');
  const [branch, setBranch] = useState<Branch>('Revenue & Circle Office');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [clTotalQuota, setClTotalQuota] = useState(12);
  const [clAvailed, setClAvailed] = useState(0);
  const [clPending, setClPending] = useState(0);
  const [rhQuota, setRhQuota] = useState(2);
  const [rhAvailed, setRhAvailed] = useState(0);
  const [role, setRole] = useState<UserRole>('employee');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmployeeCode(employee.employeeCode);
      setDesignation(employee.designation);
      setBranch(employee.branch);
      setMobile(employee.mobile);
      setEmail(employee.email || '');
      setClTotalQuota(employee.clTotalQuota);
      setClAvailed(employee.clAvailed);
      setClPending(employee.clPending);
      setRhQuota(employee.rhQuota);
      setRhAvailed(employee.rhAvailed);
      setRole(employee.role);
      setShowDeleteConfirm(false);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter employee name.');
      return;
    }
    if (!mobile.trim()) {
      alert('Please enter mobile number.');
      return;
    }

    const updated: Employee = {
      ...employee,
      name,
      employeeCode,
      designation,
      branch,
      mobile,
      email,
      clTotalQuota: Number(clTotalQuota),
      clAvailed: Number(clAvailed),
      clPending: Number(clPending),
      rhQuota: Number(rhQuota),
      rhAvailed: Number(rhAvailed),
      role,
    };

    onUpdateEmployee(updated);
    onClose();
  };

  const remainingBalance = Math.max(0, Number(clTotalQuota) - Number(clAvailed) - Number(clPending));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Modify Employee Record & Leave Ledger
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-blue-700" />
                  Sanctioning Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {employee.employeeCode} · {employee.name} · Co-District Administration, Nazira
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Identity Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Employee Code</label>
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. SDAA, JDAA, Process Server, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Branch / Section <span className="text-red-500">*</span>
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as Branch)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Establishment Section">Establishment Section</option>
                <option value="Revenue & Circle Office">Settlement</option>
                <option value="Nazir Branch">Nazarat Branch</option>
                <option value="Development Branch">Development Branch</option>
                <option value="Land Records & Lot Mandal">RKG</option>
                <option value="Grade IV & General Pool">Grade IV & General Pool</option>
                <option value="e-Governance & IT Cell">e-Governance & IT Cell</option>
                <option value="Co-District Administration / Executive">Co-District Administration / Executive</option>
                <option value="T & D Branch">T & D Branch</option>
                <option value="Magistracy Branch">Magistracy Branch</option>
                <option value="Administration Branch">Administration Branch</option>
                <option value="CA Branch">Confidential Branch</option>
                <option value="R & DM Branch">R & DM Branch</option>
                <option value="Accounts Branch">Accounts Branch</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Mobile Number (SMS Gateway Recipient) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Leave Quota & History Adjustment */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Casual Leave Account & Balances (2026)
              </h3>
              <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Current Balance: {remainingBalance} Days
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Total CL Quota</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={clTotalQuota}
                  onChange={(e) => setClTotalQuota(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  required
                />
                <span className="text-[10px] text-slate-400">Std: 12 days</span>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Days Availed</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={clAvailed}
                  onChange={(e) => setClAvailed(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  required
                />
                <span className="text-[10px] text-slate-400">Taken & Sanctioned</span>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Days In-Process</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={clPending}
                  onChange={(e) => setClPending(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
                <span className="text-[10px] text-slate-400">Awaiting sanction</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Restricted Holiday (RH) Quota</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={rhQuota}
                  onChange={(e) => setRhQuota(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">RH Days Availed</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={rhAvailed}
                  onChange={(e) => setRhAvailed(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* System Role */}
          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Portal Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="employee">Staff / Applicant</option>
              <option value="nazir_verifier">Attendance Verifier / Establishment Branch</option>
              <option value="sdo_officer">Co-District Administration, Nazira / Sanctioning Authority</option>
            </select>
          </div>

          {/* Delete Option */}
          {onDeleteEmployee && (
            <div className="pt-2">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove employee from CDC roster...</span>
                </button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-1.5 text-red-800 font-semibold text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Confirm deletion of {employee.name}?</span>
                  </div>
                  <p className="text-[11px] text-red-700">
                    This will remove the employee from the active roster.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteEmployee(employee.id);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                    >
                      Yes, Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
