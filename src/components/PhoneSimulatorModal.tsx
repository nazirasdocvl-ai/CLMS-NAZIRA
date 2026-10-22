import React, { useState } from 'react';
import { Employee, SMSNotification } from '../types';
import { X, Smartphone, Wifi, Battery, Volume2, ShieldCheck, CheckCheck, Send } from 'lucide-react';
import { playSmsChime } from '../utils/smsService';
import { OfficeEmblem } from './OfficeEmblem';

interface PhoneSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  smsNotifications: SMSNotification[];
  selectedMobile?: string;
  onSendTestSms: (mobile: string, name: string, message: string) => void;
}

export const PhoneSimulatorModal: React.FC<PhoneSimulatorModalProps> = ({
  isOpen,
  onClose,
  employees,
  smsNotifications,
  selectedMobile,
  onSendTestSms,
}) => {
  const [activeMobile, setActiveMobile] = useState<string>(
    selectedMobile || employees[4]?.mobile || '+91 94350 28190'
  );
  const [testText, setTestText] = useState('');

  // Update active mobile when prop changes
  React.useEffect(() => {
    if (selectedMobile) {
      setActiveMobile(selectedMobile);
    }
  }, [selectedMobile]);

  if (!isOpen) return null;

  const currentEmp = employees.find((e) => e.mobile === activeMobile) || {
    name: 'Govt Employee / Recipient',
    mobile: activeMobile,
    designation: 'Staff',
    branch: 'CDC Nazira',
  };

  const recipientSmsList = smsNotifications.filter(
    (sms) => sms.recipientMobile.replace(/\s+/g, '') === activeMobile.replace(/\s+/g, '')
  );

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleManualTestSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testText.trim()) return;
    onSendTestSms(activeMobile, currentEmp.name, testText);
    setTestText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[94vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
        {/* Left Side: Phone Device Frame */}
        <div className="p-6 bg-slate-100/90 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
          <div className="w-[310px] h-[580px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col">
            {/* Screen Inner */}
            <div className="bg-slate-900 w-full h-full rounded-[32px] overflow-hidden flex flex-col relative text-slate-100">
              {/* Notch / Dynamic Island */}
              <div className="h-6 w-full flex items-center justify-between px-6 pt-2 text-[10px] text-slate-300 font-medium select-none">
                <span>{currentTime}</span>
                <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Chat Header */}
              <div className="bg-slate-800/90 px-4 py-2.5 border-b border-slate-700 flex items-center gap-2.5 shadow-xs">
                <OfficeEmblem className="w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white truncate">
                      AS-CDCNZR
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-emerald-400 truncate">
                    Verified Govt of Assam Sender
                  </p>
                </div>
                <button
                  onClick={playSmsChime}
                  title="Test SMS Audio Chime"
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                <div className="text-center my-2">
                  <span className="bg-slate-800 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-mono">
                    Official Govt Telecom Gateway (DLT Certified)
                  </span>
                </div>

                {recipientSmsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs px-4">
                    <p>No SMS received yet on this handset.</p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      Apply for Casual Leave or trigger an action to see incoming automated SMS alerts.
                    </p>
                  </div>
                ) : (
                  recipientSmsList.map((sms) => (
                    <div
                      key={sms.id}
                      className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tl-sm p-3 text-slate-100 shadow-md space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                        <span>Header: {sms.senderId}</span>
                        <span>{new Date(sms.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-sans text-slate-200">
                        {sms.message}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-700/50">
                        <span>DLT: {sms.templateId}</span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCheck className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Phone Bottom Footer / Info */}
              <div className="p-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-center text-slate-400 font-mono">
                Handset: {currentEmp.mobile}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Handset Controls & Test Bench */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Mobile SMS Handset Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Simulating real-time SMS delivery to CDC Nazira employees
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Device Owner */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Select Active Handset / Employee:
              </label>
              <select
                value={activeMobile}
                onChange={(e) => setActiveMobile(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.mobile}>
                    {emp.name} — {emp.mobile} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Employee Metadata */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee Name:</span>
                <span className="font-semibold text-slate-900">{currentEmp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number:</span>
                <span className="font-mono font-semibold text-slate-900">{activeMobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SMS Received:</span>
                <span className="font-mono text-emerald-700 font-bold">{recipientSmsList.length} message(s)</span>
              </div>
            </div>

            {/* Test Audio Chime Button */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={playSmsChime}
                className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Test Mobile Audio Alert</span>
              </button>
            </div>

            {/* Send Custom Test SMS */}
            <form onSubmit={handleManualTestSend} className="mt-6 space-y-2 pt-4 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-700">
                Send Custom Simulated SMS to Handset:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Co-District Administration, Nazira: Urgent staff meeting at 3:00 PM today in Conference Hall."
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Dispatches immediately via AS-CDCNZR header with audio notification.
              </p>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Close Handset View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
