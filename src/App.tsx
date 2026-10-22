/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Employee,
  LeaveRequest,
  SMSNotification,
  UserRole,
  SMSGatewayConfig,
} from './types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_SMS_NOTIFICATIONS,
  ASSAM_HOLIDAYS_2026,
} from './data/mockData';
import { playSmsChime, createSmsPayload } from './utils/smsService';
import { Header } from './components/Header';
import { LeaveRegisterTable } from './components/LeaveRegisterTable';
import { EmployeeLedgerView } from './components/EmployeeLedgerView';
import { SMSGatewayDrawer } from './components/SMSGatewayDrawer';
import { LeaveApplicationModal } from './components/LeaveApplicationModal';
import { LeaveTrackerModal } from './components/LeaveTrackerModal';
import { SanctionOrderModal } from './components/SanctionOrderModal';
import { PhoneSimulatorModal } from './components/PhoneSimulatorModal';
import { HolidayCalendarModal } from './components/HolidayCalendarModal';
import { NewEmployeeModal } from './components/NewEmployeeModal';
import { EmployeeHistoryModal } from './components/EmployeeHistoryModal';
import { EditEmployeeModal } from './components/EditEmployeeModal';
import { EditLeaveRecordModal } from './components/EditLeaveRecordModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { EmployeeLoginModal } from './components/EmployeeLoginModal';
import { OfficeEmblem } from './components/OfficeEmblem';
import {
  FileText,
  Users,
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Smartphone,
  ShieldCheck,
  Building,
  UserCheck,
  Lock,
  LogOut,
  Key,
} from 'lucide-react';

const STORAGE_KEYS = {
  EMPLOYEES: 'cdc_nazira_employees_v3',
  REQUESTS: 'cdc_nazira_requests_v3',
  SMS: 'cdc_nazira_sms_v3',
  CONFIG: 'cdc_nazira_config_v2',
};

export default function App() {
  // Persistence state with auto-merge for official CDC staff
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    let list: Employee[] = INITIAL_EMPLOYEES;
    if (saved) {
      try {
        const parsed: Employee[] = JSON.parse(saved);
        const existingMobiles = new Set(parsed.map((e) => e.mobile.replace(/\s+/g, '')));
        const missing = INITIAL_EMPLOYEES.filter(
          (initEmp) => !existingMobiles.has(initEmp.mobile.replace(/\s+/g, ''))
        );
        list = missing.length > 0 ? [...parsed, ...missing] : parsed;
      } catch {
        list = INITIAL_EMPLOYEES;
      }
    }
    // Clean slate: reset any pending leave counters since all pending requests are removed
    return list.map((e) => ({ ...e, clPending: 0 }));
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!saved) return INITIAL_LEAVE_REQUESTS;
    try {
      const parsed: LeaveRequest[] = JSON.parse(saved);
      // Ensure all old mock pending/sanctioned requests are removed
      return parsed.filter((r) => !['req-001', 'req-002', 'req-003'].includes(r.id));
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [smsNotifications, setSmsNotifications] = useState<SMSNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SMS);
    if (!saved) return INITIAL_SMS_NOTIFICATIONS;
    try {
      const parsed: SMSNotification[] = JSON.parse(saved);
      // Ensure all old mock automated SMS pushes are removed
      return parsed.filter((s) => !['sms-101', 'sms-102', 'sms-106'].includes(s.id));
    } catch {
      return INITIAL_SMS_NOTIFICATIONS;
    }
  });

  const [gatewayConfig, setGatewayConfig] = useState<SMSGatewayConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          enableAutomatedPushes: parsed.enableAutomatedPushes ?? false,
        };
      } catch {
        // fallback
      }
    }
    return {
      provider: 'DEMO_DLT',
      senderId: 'AS-CDCNZR',
      apiKey: '',
      enableAudioChime: false,
      autoDeliverDelayMs: 1200,
      smsActive: false,
      enableAutomatedPushes: false,
    };
  });

  // Clean up legacy v2 localStorage keys containing mock requests / SMS pushes
  useEffect(() => {
    try {
      localStorage.removeItem('cdc_nazira_requests_v2');
      localStorage.removeItem('cdc_nazira_sms_v2');
    } catch {
      // ignore
    }
  }, []);

  // UI state
  const [currentRole, setCurrentRole] = useState<UserRole>('sdo_officer');
  const [activeTab, setActiveTab] = useState<'register' | 'employees' | 'sms-logs' | 'holidays'>('register');

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedEmpIdForApply, setSelectedEmpIdForApply] = useState<string | undefined>();

  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [selectedRequestForTracker, setSelectedRequestForTracker] = useState<LeaveRequest | null>(null);

  const [isSanctionOrderModalOpen, setIsSanctionOrderModalOpen] = useState(false);
  const [selectedRequestForOrder, setSelectedRequestForOrder] = useState<LeaveRequest | null>(null);

  const [isPhoneSimulatorOpen, setIsPhoneSimulatorOpen] = useState(false);
  const [phoneSimulatorMobile, setPhoneSimulatorMobile] = useState<string | undefined>();

  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedEmployeeForHistory, setSelectedEmployeeForHistory] = useState<Employee | null>(null);

  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<Employee | null>(null);

  const [isEditLeaveRecordModalOpen, setIsEditLeaveRecordModalOpen] = useState(false);
  const [selectedRequestForEdit, setSelectedRequestForEdit] = useState<LeaveRequest | null>(null);

  // Admin Authentication State for Attendance Verifier & Sanctioning Authority
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cdc_nazira_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [homeLoginUser, setHomeLoginUser] = useState('');
  const [homeLoginPass, setHomeLoginPass] = useState('');
  const [homeLoginError, setHomeLoginError] = useState('');

  const handleAdminLogin = (username: string, pass: string, targetRole: UserRole = 'sdo_officer') => {
    const trimmedUser = username.trim().toLowerCase();
    const isUserValid = trimmedUser === 'admn' || trimmedUser === 'admin';
    const isPassValid = pass === 'admn4451' || pass === 'Admn4451';

    if (isUserValid && isPassValid) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('cdc_nazira_admin_auth', 'true');
      setCurrentRole(targetRole);
      setHomeLoginError('');
      setHomeLoginPass('');
      setIsAdminLoginModalOpen(false);
      triggerSmsToast('Authority Logged In', 'admn', 'Access granted as Verifier & Sanctioning Authority.');
      return true;
    } else {
      setHomeLoginError('Invalid User ID or Password. Please try again.');
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('cdc_nazira_admin_auth');
    setCurrentRole('employee');
    triggerSmsToast('Logged Out', 'admin', 'Returned to Applicant / Staff view.');
  };

  // Employee Authentication State for Operating Casual Leave / New Leave Request
  // User ID: emp, Password: cdc@nazira
  const [isEmployeeAuthenticated, setIsEmployeeAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cdc_nazira_employee_auth') === 'true';
  });
  const [isEmployeeLoginModalOpen, setIsEmployeeLoginModalOpen] = useState(false);
  const [pendingApplyEmpId, setPendingApplyEmpId] = useState<string | undefined>(undefined);

  const handleEmployeeLogin = (username: string, pass: string): boolean => {
    if (username.trim().toLowerCase() === 'emp' && pass === 'cdc@nazira') {
      setIsEmployeeAuthenticated(true);
      localStorage.setItem('cdc_nazira_employee_auth', 'true');
      setIsEmployeeLoginModalOpen(false);
      triggerSmsToast('Employee Verified', 'emp', 'Access granted to submit Casual Leave requests.');
      setSelectedEmpIdForApply(pendingApplyEmpId);
      setPendingApplyEmpId(undefined);
      setIsApplyModalOpen(true);
      return true;
    }
    return false;
  };

  const handleEmployeeLogout = () => {
    setIsEmployeeAuthenticated(false);
    localStorage.removeItem('cdc_nazira_employee_auth');
    triggerSmsToast('Employee Logged Out', 'emp', 'Employee session ended.');
  };

  // Sanctioning Authority permission check:
  // Exclusively Sanctioning Authority (sdo_officer with authority login) can modify or update employee data and others.
  // Edit button is NOT available to any employee.
  const isSanctioningAuthority = isAdminAuthenticated && currentRole === 'sdo_officer';

  // Live Toast state
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    subtitle: string;
    mobile: string;
  } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(smsNotifications));
  }, [smsNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(gatewayConfig));
  }, [gatewayConfig]);

  // Toast trigger helper
  const triggerSmsToast = (recipientName: string, recipientMobile: string, summary: string) => {
    if (gatewayConfig.enableAudioChime) {
      playSmsChime();
    }
    const toastId = `toast-${Date.now()}`;
    setActiveToast({
      id: toastId,
      title: `SMS Sent to ${recipientName}`,
      subtitle: summary,
      mobile: recipientMobile,
    });

    setTimeout(() => {
      setActiveToast((current) => (current?.id === toastId ? null : current));
    }, 6000);
  };

  // 1. Submit New Casual Leave Request
  const handleCreateLeaveRequest = (
    data: Omit<LeaveRequest, 'id' | 'memoNo' | 'appliedAt' | 'smsNotificationIds' | 'timeline'>
  ) => {
    const nextSeq = Math.floor(100 + leaveRequests.length + 1);
    const memoNo = `CL/CDC-NZR/2026/0${nextSeq}`;
    const now = new Date().toISOString();

    const smsIds: string[] = [];

    // Only push automated SMS if explicitly enabled by configuration
    if (gatewayConfig.enableAutomatedPushes) {
      const empSms = createSmsPayload(
        data.contactNumberDuringLeave,
        data.employeeName,
        'LEAVE_SUBMITTED',
        {
          employeeName: data.employeeName,
          memoNo,
          totalDays: data.totalDays,
          startDate: data.startDate,
          endDate: data.endDate,
        }
      );
      smsIds.push(empSms.id);
      setSmsNotifications((prev) => [empSms, ...prev]);
    }

    const newRequest: LeaveRequest = {
      ...data,
      id: `req-${Date.now()}`,
      memoNo,
      appliedAt: now,
      smsNotificationIds: smsIds,
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          actor: `${data.employeeName} (Applicant)`,
          remarks: `Submitted leave request for ${data.totalDays} day(s) via e-CLMS.`,
        },
      ],
    };

    // Update Employee pending count
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === data.employeeId
          ? { ...emp, clPending: emp.clPending + data.totalDays }
          : emp
      )
    );

    setLeaveRequests((prev) => [newRequest, ...prev]);

    triggerSmsToast(
      data.employeeName,
      data.contactNumberDuringLeave,
      `Leave application ${memoNo} submitted successfully.`
    );
  };

  // 2. Attendance Verifier Recommendation
  const handleRecommendLeave = (requestId: string, remarks: string) => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return;

    const now = new Date().toISOString();
    const smsIds = [...req.smsNotificationIds];

    if (gatewayConfig.enableAutomatedPushes) {
      const sms = createSmsPayload(
        req.contactNumberDuringLeave,
        req.employeeName,
        'LEAVE_RECOMMENDED',
        {
          employeeName: req.employeeName,
          memoNo: req.memoNo,
          totalDays: req.totalDays,
          startDate: req.startDate,
          recommendedBy: 'Attendance Verifier / Establishment Branch',
        }
      );
      smsIds.push(sms.id);
      setSmsNotifications((prev) => [sms, ...prev]);
    }

    const updatedRequest: LeaveRequest = {
      ...req,
      status: 'RECOMMENDED',
      recommendedBy: 'Attendance Verifier / Establishment Branch',
      recommendedAt: now,
      recommendationRemarks: remarks,
      smsNotificationIds: smsIds,
      timeline: [
        ...req.timeline,
        {
          status: 'RECOMMENDED',
          timestamp: now,
          actor: 'Attendance Verifier / Establishment Branch',
          remarks: remarks || 'Checked in Attendance Register Form 25. Recommended.',
        },
      ],
    };

    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updatedRequest : r))
    );

    if (selectedRequestForTracker?.id === requestId) {
      setSelectedRequestForTracker(updatedRequest);
    }

    triggerSmsToast(
      req.employeeName,
      req.contactNumberDuringLeave,
      `Leave entry ${req.memoNo} recommended for sanction.`
    );
  };

  // 3. Co-District Administration Sanction
  const handleSanctionLeave = (
    requestId: string,
    orderNo: string,
    remarks: string
  ) => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return;

    const targetEmp = employees.find((e) => e.id === req.employeeId);
    const newAvailed = (targetEmp?.clAvailed || 0) + req.totalDays;
    const newPending = Math.max(0, (targetEmp?.clPending || 0) - req.totalDays);
    const remainingBalance = Math.max(0, (targetEmp?.clTotalQuota || 12) - newAvailed);

    const now = new Date().toISOString();
    const smsIds = [...req.smsNotificationIds];

    if (gatewayConfig.enableAutomatedPushes) {
      const sms = createSmsPayload(
        req.contactNumberDuringLeave,
        req.employeeName,
        'LEAVE_SANCTIONED',
        {
          employeeName: req.employeeName,
          memoNo: req.memoNo,
          totalDays: req.totalDays,
          startDate: req.startDate,
          endDate: req.endDate,
          sanctionOrderNo: orderNo,
          sanctionedBy: 'Co-District Administration, Nazira',
          remainingBalance,
        }
      );
      smsIds.push(sms.id);
      setSmsNotifications((prev) => [sms, ...prev]);
    }

    const updatedRequest: LeaveRequest = {
      ...req,
      status: 'SANCTIONED',
      sanctionedBy: 'Co-District Administration, Nazira',
      sanctionedAt: now,
      sanctionOrderNo: orderNo,
      smsNotificationIds: smsIds,
      timeline: [
        ...req.timeline,
        {
          status: 'SANCTIONED',
          timestamp: now,
          actor: 'Co-District Administration, Nazira',
          remarks: remarks || `Casual Leave sanctioned vide Order No: ${orderNo}.`,
        },
      ],
    };

    // Update Employee balance
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === req.employeeId
          ? {
              ...emp,
              clAvailed: newAvailed,
              clPending: newPending,
            }
          : emp
      )
    );

    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updatedRequest : r))
    );

    if (selectedRequestForTracker?.id === requestId) {
      setSelectedRequestForTracker(updatedRequest);
    }

    triggerSmsToast(
      req.employeeName,
      req.contactNumberDuringLeave,
      `Sanction Order ${orderNo} granted. Remaining balance: ${remainingBalance}d`
    );
  };

  // 4. Rejection of Leave
  const handleRejectLeave = (requestId: string, reason: string) => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return;

    const now = new Date().toISOString();
    const smsIds = [...req.smsNotificationIds];

    if (gatewayConfig.enableAutomatedPushes) {
      const sms = createSmsPayload(
        req.contactNumberDuringLeave,
        req.employeeName,
        'LEAVE_REJECTED',
        {
          employeeName: req.employeeName,
          memoNo: req.memoNo,
          totalDays: req.totalDays,
          startDate: req.startDate,
          rejectionReason: reason,
        }
      );
      smsIds.push(sms.id);
      setSmsNotifications((prev) => [sms, ...prev]);
    }

    const updatedRequest: LeaveRequest = {
      ...req,
      status: 'REJECTED',
      rejectionReason: reason,
      smsNotificationIds: smsIds,
      timeline: [
        ...req.timeline,
        {
          status: 'REJECTED',
          timestamp: now,
          actor: 'Head of Office / Sanctioning Authority',
          remarks: reason || 'Leave could not be sanctioned due to exigency.',
        },
      ],
    };

    // Restore pending balance
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === req.employeeId
          ? { ...emp, clPending: Math.max(0, emp.clPending - req.totalDays) }
          : emp
      )
    );

    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === requestId ? updatedRequest : r))
    );

    if (selectedRequestForTracker?.id === requestId) {
      setSelectedRequestForTracker(updatedRequest);
    }

    triggerSmsToast(
      req.employeeName,
      req.contactNumberDuringLeave,
      `Leave request ${req.memoNo} marked rejected: ${reason}`
    );
  };

  // Clear all leave requests (Sanctioning Authority only)
  const handleClearAllRequests = () => {
    if (!isSanctioningAuthority) return;
    if (window.confirm('Are you sure you want to remove all leave entries from the register? All pending sanctions and sanction requests will be cleared.')) {
      setLeaveRequests([]);
      setEmployees((prev) => prev.map((e) => ({ ...e, clPending: 0 })));
      triggerSmsToast('Register Cleared', 'Admin', 'All pending sanctions and sanction requests removed.');
    }
  };

  // Clear all SMS logs
  const handleClearAllSms = () => {
    setSmsNotifications([]);
    triggerSmsToast('SMS Queue Cleared', 'System', 'All SMS notification logs have been removed.');
  };

  // Manual Test SMS sender
  const handleSendManualSms = (mobile: string, name: string, message: string) => {
    const newSms: SMSNotification = {
      id: `sms-${Date.now()}`,
      templateId: 'DLT-1107168294719279',
      senderId: gatewayConfig.senderId,
      recipientMobile: mobile,
      recipientName: name,
      message,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      deliveredAt: new Date(Date.now() + 1000).toISOString(),
      charCount: message.length,
      triggerEvent: 'REMINDER',
    };

    setSmsNotifications((prev) => [newSms, ...prev]);
    triggerSmsToast(name, mobile, 'Manual administrative SMS delivered.');
  };

  // Employee statement SMS
  const handleSendStatementSms = (employee: Employee) => {
    const remainingCL = Math.max(0, employee.clTotalQuota - employee.clAvailed - employee.clPending);
    const message = `GOVT OF ASSAM - O/O CDC NAZIRA: Official Casual Leave Statement for ${employee.name}: Annual Quota: ${employee.clTotalQuota}d | Availed: ${employee.clAvailed}d | Pending: ${employee.clPending}d | Available Balance: ${remainingCL} days. - CDC Nazira`;

    handleSendManualSms(employee.mobile, employee.name, message);
  };

  // Quick Action handlers
  const handleOpenApplyModal = (employeeId?: string) => {
    // Both Apply Casual Leave and New leave request button can be operated with User ID: emp, password: cdc@nazira
    if (isEmployeeAuthenticated || isSanctioningAuthority) {
      setSelectedEmpIdForApply(employeeId);
      setIsApplyModalOpen(true);
    } else {
      setPendingApplyEmpId(employeeId);
      setIsEmployeeLoginModalOpen(true);
    }
  };

  const handleSelectRequest = (request: LeaveRequest) => {
    setSelectedRequestForTracker(request);
    setIsTrackerModalOpen(true);
  };

  const handleViewOrder = (request: LeaveRequest) => {
    setSelectedRequestForOrder(request);
    setIsSanctionOrderModalOpen(true);
  };

  const handleOpenPhoneSimulator = (mobile?: string) => {
    setPhoneSimulatorMobile(mobile);
    setIsPhoneSimulatorOpen(true);
  };

  const handleViewEmployeeHistory = (employee: Employee) => {
    setSelectedEmployeeForHistory(employee);
    setIsHistoryModalOpen(true);
  };

  const handleOpenEditEmployee = (employee: Employee) => {
    if (!isSanctioningAuthority) {
      if (!isAdminAuthenticated) {
        setIsAdminLoginModalOpen(true);
      } else {
        triggerSmsToast('Access Restricted', 'Authority Permission', 'Only the Sanctioning Authority can modify or update employee data.');
      }
      return;
    }
    setSelectedEmployeeForEdit(employee);
    setIsEditEmployeeModalOpen(true);
  };

  const handleUpdateEmployee = (updated: Employee) => {
    if (!isSanctioningAuthority) return;
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    if (selectedEmployeeForHistory?.id === updated.id) {
      setSelectedEmployeeForHistory(updated);
    }
    triggerSmsToast(updated.name, updated.mobile, 'Employee record & branch details updated by Sanctioning Authority.');
  };

  const handleDeleteEmployee = (empId: string) => {
    if (!isSanctioningAuthority) return;
    const emp = employees.find((e) => e.id === empId);
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
    triggerSmsToast(emp?.name || 'Staff', emp?.mobile || '', 'Employee removed by Sanctioning Authority.');
  };

  const handleOpenEditLeaveRecord = (request: LeaveRequest) => {
    if (!isSanctioningAuthority) {
      if (!isAdminAuthenticated) {
        setIsAdminLoginModalOpen(true);
      } else {
        triggerSmsToast('Access Restricted', 'Authority Permission', 'Only the Sanctioning Authority can modify or update leave records.');
      }
      return;
    }
    setSelectedRequestForEdit(request);
    setIsEditLeaveRecordModalOpen(true);
  };

  const handleUpdateLeaveRequest = (updated: LeaveRequest) => {
    if (!isSanctioningAuthority) return;
    setLeaveRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (selectedRequestForTracker?.id === updated.id) {
      setSelectedRequestForTracker(updated);
    }
    triggerSmsToast(updated.employeeName, updated.contactNumberDuringLeave, `Leave entry ${updated.memoNo} modified by Sanctioning Authority.`);
  };

  const handleDeleteLeaveRequest = (reqId: string) => {
    if (!isSanctioningAuthority) return;
    const req = leaveRequests.find((r) => r.id === reqId);
    setLeaveRequests((prev) => prev.filter((r) => r.id !== reqId));
    triggerSmsToast(req?.employeeName || 'Staff', req?.contactNumberDuringLeave || '', `Leave record ${req?.memoNo || ''} deleted by Sanctioning Authority.`);
  };

  // Stats calculation
  const totalEmployeesCount = employees.length;
  const pendingRequestsCount = leaveRequests.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'RECOMMENDED'
  ).length;
  const sanctionedCount = leaveRequests.filter((r) => r.status === 'SANCTIONED').length;
  const totalSmsSentCount = smsNotifications.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(newRole) => {
          if (!isAdminAuthenticated && (newRole === 'sdo_officer' || newRole === 'nazir_verifier')) {
            setIsAdminLoginModalOpen(true);
          } else {
            setCurrentRole(newRole);
          }
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApplyModal={() => handleOpenApplyModal()}
        onOpenPhoneSimulator={() => handleOpenPhoneSimulator()}
        smsCount={totalSmsSentCount}
        isAdminAuthenticated={isAdminAuthenticated}
        isEmployeeAuthenticated={isEmployeeAuthenticated}
        onOpenLoginModal={() => setIsAdminLoginModalOpen(true)}
        onLogout={handleAdminLogout}
        onEmployeeLogout={handleEmployeeLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dedicated Home Screen Authority Login & Status Strip */}
        {!isAdminAuthenticated ? (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-blue-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <OfficeEmblem className="w-14 h-14 ring-2 ring-white/20 bg-white" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold tracking-wide uppercase text-blue-200">
                      Authority Sign In
                    </span>
                    <span className="text-[10px] font-semibold bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded border border-blue-400/30">
                      Attendance Verifier & Sanctioning Authority
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Co-District Administration, Nazira · Attendance Verifier / Establishment Branch
                  </h3>
                  <p className="text-xs text-blue-200/90 max-w-xl">
                    Sign in to verify Form 25 attendance registers, record recommendations, grant digital leave sanctions, and manage employee records.
                  </p>
                  <div className="text-[11px] text-blue-200/80 pt-1 flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span>Official portal for Attendance Verifier & Sanctioning Authority.</span>
                  </div>
                </div>
              </div>

              {/* Inline Login Form on Home Screen */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdminLogin(homeLoginUser, homeLoginPass, 'sdo_officer');
                }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shrink-0 w-full lg:w-auto flex flex-col gap-2.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-blue-200 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={homeLoginUser}
                      onChange={(e) => setHomeLoginUser(e.target.value)}
                      placeholder="User ID"
                      autoComplete="username"
                      className="w-full sm:w-28 px-2.5 py-1.5 bg-white text-slate-900 rounded-md font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-blue-200 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={homeLoginPass}
                      onChange={(e) => setHomeLoginPass(e.target.value)}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="w-full sm:w-32 px-2.5 py-1.5 bg-white text-slate-900 rounded-md font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>

                {homeLoginError && (
                  <span className="text-[11px] text-red-300 font-medium">{homeLoginError}</span>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Login as Authority</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Logged In: User ID admn
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold border border-emerald-300">
                      AUTHENTICATED
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 font-medium">
                    Attendance Verifier / Establishment Branch & Sanctioning Authority (Co-District Administration, Nazira)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex rounded-lg p-0.5 bg-emerald-100 border border-emerald-300 text-xs">
                  <button
                    onClick={() => setCurrentRole('nazir_verifier')}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      currentRole === 'nazir_verifier'
                        ? 'bg-white text-emerald-950 shadow-2xs'
                        : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    <UserCheck className="w-3 h-3 text-emerald-700" />
                    <span>Attendance Verifier / Establishment</span>
                  </button>
                  <button
                    onClick={() => setCurrentRole('sdo_officer')}
                    className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      currentRole === 'sdo_officer'
                        ? 'bg-white text-emerald-950 shadow-2xs'
                        : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3 text-blue-700" />
                    <span>Sanctioning Authority</span>
                  </button>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-white hover:bg-red-50 border border-red-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Institutional Overview Strip */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Co-District Administration, Nazira
                </span>
                <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  e-Governance Cell
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Casual Leave Ledger
              </p>
              <div className="text-xs font-semibold text-blue-950 mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-700"></span>
                <span>Copyright reserved by: Co-District Administration</span>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setIsHolidayModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Holiday Calendar</span>
              </button>

              {isSanctioningAuthority && (
                <button
                  onClick={() => setIsNewEmployeeModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Sanctioning Authority: Add employee record"
                >
                  <Users className="w-3.5 h-3.5 text-blue-700" />
                  <span>Add Employee</span>
                </button>
              )}

              <button
                onClick={() => handleOpenPhoneSimulator()}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simulate Staff Mobile Handset</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Institutional Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-500 block">Total CDC Staff</span>
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {totalEmployeesCount}
              </span>
              <span className="text-[11px] text-slate-400 block">Civil officers & employees</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 block">Administrative Wings</span>
              <span className="text-2xl font-bold font-mono text-blue-900 tabular-nums">
                7 Branches
              </span>
              <span className="text-[11px] text-slate-400 block">Nazarat, Magistracy, Land Records & more</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 block">Annual CL Entitlement</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
                12 Days
              </span>
              <span className="text-[11px] text-slate-400 block">+ 2 Restricted Holidays per employee</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-500 block">Form 25 Register Status</span>
              <span className="text-2xl font-bold font-mono text-indigo-700">
                Operational
              </span>
              <span className="text-[11px] text-slate-400 block">Digital attendance & leave audit</span>
            </div>
          </div>
        </div>

        {/* Tab View Switching */}
        {activeTab === 'register' && (
          <LeaveRegisterTable
            requests={leaveRequests}
            currentRole={currentRole}
            canEdit={isSanctioningAuthority}
            onSelectRequest={handleSelectRequest}
            onOpenApplyModal={() => handleOpenApplyModal()}
            onDeleteRequest={isSanctioningAuthority ? handleDeleteLeaveRequest : undefined}
            onClearAllRequests={isSanctioningAuthority ? handleClearAllRequests : undefined}
            onQuickSanction={(req) => {
              if (!isAdminAuthenticated || currentRole !== 'sdo_officer') {
                setIsAdminLoginModalOpen(true);
                return;
              }
              const orderNo = `NZR/ESTT/CL-ORD/2026/${Math.floor(100 + Math.random() * 900)}`;
              handleSanctionLeave(req.id, orderNo, 'Sanctioned by Co-District Administration, Nazira.');
            }}
            onQuickRecommend={(req) => {
              if (!isAdminAuthenticated) {
                setIsAdminLoginModalOpen(true);
                return;
              }
              handleRecommendLeave(req.id, 'Verified in Form 25 Attendance Register. Recommended.');
            }}
            onViewOrder={handleViewOrder}
            onEditRequest={isSanctioningAuthority ? handleOpenEditLeaveRecord : undefined}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeLedgerView
            employees={employees}
            leaveRequests={leaveRequests}
            canEdit={isSanctioningAuthority}
            onOpenApplyForEmployee={(empId) => handleOpenApplyModal(empId)}
            onOpenNewEmployeeModal={isSanctioningAuthority ? () => setIsNewEmployeeModalOpen(true) : undefined}
            onOpenPhoneSimulator={handleOpenPhoneSimulator}
            onViewEmployeeHistory={handleViewEmployeeHistory}
            onEditEmployee={isSanctioningAuthority ? handleOpenEditEmployee : undefined}
          />
        )}

        {activeTab === 'sms-logs' && (
          <SMSGatewayDrawer
            notifications={smsNotifications}
            config={gatewayConfig}
            onUpdateConfig={(updates) => setGatewayConfig((prev) => ({ ...prev, ...updates }))}
            onOpenPhoneSimulator={handleOpenPhoneSimulator}
            onSendManualSms={handleSendManualSms}
            onClearAllSms={handleClearAllSms}
          />
        )}

        {activeTab === 'holidays' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Government of Assam Gazetted & Restricted Holidays 2026
                </h3>
                <p className="text-xs text-slate-500">
                  Official civil schedule for Co-District Administration, Nazira, District Sivasagar
                </p>
              </div>
              <button
                onClick={() => setIsHolidayModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
              >
                Expand Calendar Modal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ASSAM_HOLIDAYS_2026.slice(0, 12).map((h) => (
                <div
                  key={h.date}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-mono text-[11px] text-slate-500">{h.date}</div>
                    <div className="font-bold text-slate-900 mt-0.5">{h.name}</div>
                    <div className="text-[10px] text-slate-400">{h.description}</div>
                  </div>
                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${
                      h.type === 'GAZETTED'
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        : 'text-purple-800 bg-purple-50 border-purple-200'
                    }`}
                  >
                    {h.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Real-time SMS Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-4 max-w-sm border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg shrink-0">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">{activeToast.title}</span>
                <span className="text-[10px] text-emerald-400 font-mono">AS-CDCNZR</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                {activeToast.subtitle}
              </p>
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="font-mono text-[10px] text-slate-400">{activeToast.mobile}</span>
                <button
                  onClick={() => handleOpenPhoneSimulator(activeToast.mobile)}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Inspect Device</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeaveApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedEmpIdForApply(undefined);
        }}
        employees={employees}
        currentEmployeeId={selectedEmpIdForApply}
        onSubmit={handleCreateLeaveRequest}
      />

      <LeaveTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => {
          setIsTrackerModalOpen(false);
          setSelectedRequestForTracker(null);
        }}
        request={selectedRequestForTracker}
        currentRole={currentRole}
        smsNotifications={smsNotifications}
        onRecommend={handleRecommendLeave}
        onSanction={handleSanctionLeave}
        onReject={handleRejectLeave}
        onViewSanctionOrder={handleViewOrder}
        onOpenPhoneSimulator={handleOpenPhoneSimulator}
        onEditRequest={isSanctioningAuthority ? handleOpenEditLeaveRecord : undefined}
        canEdit={isSanctioningAuthority}
      />

      <SanctionOrderModal
        isOpen={isSanctionOrderModalOpen}
        onClose={() => {
          setIsSanctionOrderModalOpen(false);
          setSelectedRequestForOrder(null);
        }}
        request={selectedRequestForOrder}
      />

      <PhoneSimulatorModal
        isOpen={isPhoneSimulatorOpen}
        onClose={() => {
          setIsPhoneSimulatorOpen(false);
          setPhoneSimulatorMobile(undefined);
        }}
        employees={employees}
        smsNotifications={smsNotifications}
        selectedMobile={phoneSimulatorMobile}
        onSendTestSms={handleSendManualSms}
      />

      <HolidayCalendarModal
        isOpen={isHolidayModalOpen}
        onClose={() => setIsHolidayModalOpen(false)}
        holidays={ASSAM_HOLIDAYS_2026}
      />

      <NewEmployeeModal
        isOpen={isNewEmployeeModalOpen}
        onClose={() => setIsNewEmployeeModalOpen(false)}
        onAddEmployee={(newEmp) => {
          if (!isSanctioningAuthority) {
            triggerSmsToast('Access Restricted', 'Authority Permission', 'Only Sanctioning Authority can add staff.');
            return;
          }
          setEmployees((prev) => [...prev, newEmp]);
        }}
      />

      <EmployeeHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedEmployeeForHistory(null);
        }}
        employee={selectedEmployeeForHistory}
        requests={leaveRequests}
        onOpenPhoneSimulator={handleOpenPhoneSimulator}
        onViewOrder={handleViewOrder}
        onSendStatementSms={handleSendStatementSms}
        onEditEmployee={isSanctioningAuthority ? handleOpenEditEmployee : undefined}
        canEdit={isSanctioningAuthority}
      />

      <EditEmployeeModal
        isOpen={isEditEmployeeModalOpen}
        onClose={() => {
          setIsEditEmployeeModalOpen(false);
          setSelectedEmployeeForEdit(null);
        }}
        employee={selectedEmployeeForEdit}
        onUpdateEmployee={handleUpdateEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />

      <EditLeaveRecordModal
        isOpen={isEditLeaveRecordModalOpen}
        onClose={() => {
          setIsEditLeaveRecordModalOpen(false);
          setSelectedRequestForEdit(null);
        }}
        request={selectedRequestForEdit}
        employees={employees}
        onUpdateLeaveRequest={handleUpdateLeaveRequest}
        onDeleteLeaveRequest={handleDeleteLeaveRequest}
      />

      {/* Admin Login Modal for Attendance Verifier & Sanctioning Authority */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={(user, pass, role) => {
          return handleAdminLogin(user, pass, role || 'sdo_officer');
        }}
      />

      {/* Employee Login Modal for Operating Casual Leave / New Leave Request */}
      <EmployeeLoginModal
        isOpen={isEmployeeLoginModalOpen}
        onClose={() => {
          setIsEmployeeLoginModalOpen(false);
          setPendingApplyEmpId(undefined);
        }}
        onLoginSuccess={(user, pass) => {
          return handleEmployeeLogin(user, pass);
        }}
      />

      {/* Institutional Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <span>
                Office of the Co-District Administration, Nazira, District: Sivasagar, Assam
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="font-semibold text-slate-700">
              Copyright reserved by: Co-District Administration
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>TRAI DLT: AS-CDCNZR</span>
            <span>·</span>
            <span>Govt Form No. 25</span>
            <span>·</span>
            <span>v2026.10</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
