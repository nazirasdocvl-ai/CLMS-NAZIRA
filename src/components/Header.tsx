import React from 'react';
import { UserRole } from '../types';
import { BellRing, Smartphone, ShieldCheck, UserCheck } from 'lucide-react';
import { OfficeEmblem } from './OfficeEmblem';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'register' | 'employees' | 'sms-logs' | 'holidays';
  onTabChange: (tab: 'register' | 'employees' | 'sms-logs' | 'holidays') => void;
  onOpenApplyModal: () => void;
  onOpenPhoneSimulator: () => void;
  smsCount: number;
  isAdminAuthenticated: boolean;
  isEmployeeAuthenticated?: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onEmployeeLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenApplyModal,
  onOpenPhoneSimulator,
  smsCount,
  isAdminAuthenticated,
  isEmployeeAuthenticated = false,
  onOpenLoginModal,
  onLogout,
  onEmployeeLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark with Official Assam Seal */}
          <div className="flex items-center gap-3 shrink-0">
            <OfficeEmblem className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                Co-District Administration, Nazira
              </span>
              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                Casual Leave Management System (e-CLMS)
              </span>
            </div>
          </div>

          {/* Zone 2: 4 single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('register')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Leave Register
            </button>
            <button
              onClick={() => onTabChange('employees')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'employees'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Employee CL Ledger
            </button>
            <button
              onClick={() => onTabChange('sms-logs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sms-logs'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-blue-700" />
              <span>SMS Dispatch Console</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-mono">
                {smsCount}
              </span>
            </button>
            <button
              onClick={() => onTabChange('holidays')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'holidays'
                  ? 'border-blue-700 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Assam Holidays 2026
            </button>
          </nav>

          {/* Zone 3: Primary action & admin status */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span className="text-xs font-semibold text-blue-900 hidden lg:inline">
                  Admin: Verifier & Sanctioning Authority
                </span>
                <span className="text-xs font-semibold text-blue-900 lg:hidden">
                  Admin Active
                </span>
                <button
                  onClick={onLogout}
                  className="ml-1 text-[11px] text-red-600 hover:text-red-800 font-medium cursor-pointer underline"
                >
                  Logout
                </button>
              </div>
            ) : isEmployeeAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-900 hidden sm:inline">
                    Employee Active
                  </span>
                  {onEmployeeLogout && (
                    <button
                      onClick={onEmployeeLogout}
                      className="ml-1 text-[11px] text-red-600 hover:text-red-800 font-medium cursor-pointer underline"
                      title="Log out of employee session"
                    >
                      Logout
                    </button>
                  )}
                </div>
                <button
                  onClick={onOpenLoginModal}
                  className="px-2.5 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                  title="Login as Verifier & Sanctioning Authority"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span className="hidden sm:inline">Authority Login</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-2.5 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                title="Login as Verifier & Sanctioning Authority"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Authority Login</span>
              </button>
            )}

            <button
              onClick={onOpenPhoneSimulator}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              title="Open Mobile SMS Handset Simulator"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">Phone</span>
            </button>

            <button
              onClick={onOpenApplyModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+ Apply Casual Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role switch bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 py-1.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Role:</span>
            <div className="inline-flex rounded-md p-0.5 bg-slate-200/70 border border-slate-200">
              <button
                onClick={() => {
                  if (!isAdminAuthenticated) {
                    onOpenLoginModal();
                  } else {
                    onRoleChange('sdo_officer');
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  currentRole === 'sdo_officer'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Sanctioning Authority (Co-District Administration, Nazira)"
              >
                <ShieldCheck className="w-3 h-3 text-blue-700" />
                <span>Co-District Commissioner / Sanctioning Authority</span>
              </button>
              <button
                onClick={() => {
                  if (!isAdminAuthenticated) {
                    onOpenLoginModal();
                  } else {
                    onRoleChange('nazir_verifier');
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  currentRole === 'nazir_verifier'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Attendance Verifier / Establishment Branch"
              >
                <UserCheck className="w-3 h-3 text-blue-600" />
                <span>Attendance Verifier / Establishment Branch</span>
              </button>
              <button
                onClick={() => onRoleChange('employee')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  currentRole === 'employee'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Staff / Applicant</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Co-District, Nazira · Sivasagar</span>
            <span>·</span>
            <span className="font-mono text-blue-800 font-medium">SMS DLT: AS-CDCNZR</span>
            <span>·</span>
            <span>Civil Rules: 12 Days CL / Year</span>
          </div>
        </div>
      </div>
    </header>
  );
};
