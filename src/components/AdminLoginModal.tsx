import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';
import { OfficeEmblem } from './OfficeEmblem';
import { UserRole } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, pass: string, preferredRole?: UserRole) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('sdo_officer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = onLoginSuccess(username, password, selectedRole);
    if (success) {
      setUsername('');
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Invalid User ID or Password. Please try again.');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            <OfficeEmblem className="w-16 h-16 shadow-xs" />
          </div>

          <h2 className="text-base font-bold text-slate-900">
            Co-District Administration, Nazira
          </h2>
          <p className="text-xs text-blue-900 font-semibold mt-0.5">
            Establishment Branch & Sanctioning Authority
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">
              User ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter User ID"
                autoComplete="username"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Login Authority Scope */}
          <div className="space-y-1.5 pt-1">
            <label className="block font-semibold text-slate-700">
              Active Authority Scope on Login:
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                selectedRole === 'sdo_officer' ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="authorityScope"
                  checked={selectedRole === 'sdo_officer'}
                  onChange={() => setSelectedRole('sdo_officer')}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Sanctioning Authority (Co-District Administration)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Authority to sanction leaves, reject, and issue official orders
                  </div>
                </div>
              </label>

              <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                selectedRole === 'nazir_verifier' ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="authorityScope"
                  checked={selectedRole === 'nazir_verifier'}
                  onChange={() => setSelectedRole('nazir_verifier')}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span> Establishment Branch</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Attendance Register check, recommendations & quota audits
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In as Verifier & Sanctioning Authority</span>
            </button>
          </div>

          <div className="text-[11px] text-center text-slate-400">
            Official login for Attendance Verifier, Establishment Branch & Co-District Administration, Nazira.
          </div>
        </form>
      </div>
    </div>
  );
};
