import React, { useState } from 'react';
import { Employee, Branch, UserRole } from '../types';
import { X, UserPlus, Phone, Mail, Building, Briefcase } from 'lucide-react';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee) => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
}) => {
  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState(`CDC-NZR-0${Math.floor(12 + Math.random() * 88)}`);
  const [designation, setDesignation] = useState('Junior Assistant');
  const [branch, setBranch] = useState<Branch>('Revenue & Circle Office');
  const [mobile, setMobile] = useState('+91 94350 ');
  const [email, setEmail] = useState('');
  const [clQuota, setClQuota] = useState(12);
  const [role, setRole] = useState<UserRole>('employee');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter employee name.');
      return;
    }
    if (!mobile.trim()) {
      alert('Please enter mobile number for automated SMS notifications.');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeCode,
      name,
      designation,
      branch,
      mobile,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@assam.gov.in`,
      clTotalQuota: clQuota,
      clAvailed: 0,
      clPending: 0,
      rhQuota: 2,
      rhAvailed: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      role,
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Register Civil Employee / Staff
            </h2>
            <p className="text-xs text-slate-500">
              Co-District Administration, Nazira
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Shri Bikash Bora"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
              <label className="block font-semibold text-slate-700">Designation <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Junior Assistant / Lot Mandal"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Branch / Section</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as Branch)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Revenue & Circle Office">RKG</option>
                <option value="Nazir Branch">Nazarat</option>
                <option value="Establishment Section">Establishment Section</option>
                <option value="Development Branch">Development Branch</option>
                <option value="Land Records & Lot Mandal">Settlement</option>
                <option value="e-Governance & IT Cell">e-Governance & IT Cell</option>
                <option value="Grade IV & General Pool">Grade IV & General Pool</option>
                <option value="Co-District Commissioner / Executive">Co-District Commissioner / Executive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Mobile Number (SMS alerts) <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 94350 XXXXX"
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
                placeholder="official@assam.gov.in"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Annual CL Quota</label>
              <input
                type="number"
                min={1}
                max={20}
                value={clQuota}
                onChange={(e) => setClQuota(parseInt(e.target.value) || 12)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-slate-400">12 days standard under Assam Civil Rules</span>
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="employee">Staff / Applicant</option>
                <option value="nazir_verifier">Attendance Verifier / Establishment Branch</option>
                <option value="sdo_officer">Co-District Commissioner / Sanctioning Authority</option>
              </select>
            </div>
          </div>

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
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Employee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
