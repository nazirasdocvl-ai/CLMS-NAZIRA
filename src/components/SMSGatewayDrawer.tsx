import React, { useState } from 'react';
import { SMSNotification, SMSGatewayConfig } from '../types';
import { Send, CheckCircle2, Search, Filter, ShieldCheck, Key, Volume2, Smartphone, Trash2 } from 'lucide-react';
import { playSmsChime } from '../utils/smsService';

interface SMSGatewayDrawerProps {
  notifications: SMSNotification[];
  config: SMSGatewayConfig;
  onUpdateConfig: (newConfig: Partial<SMSGatewayConfig>) => void;
  onOpenPhoneSimulator: (mobile?: string) => void;
  onSendManualSms: (mobile: string, name: string, message: string) => void;
  onClearAllSms?: () => void;
}

export const SMSGatewayDrawer: React.FC<SMSGatewayDrawerProps> = ({
  notifications,
  config,
  onUpdateConfig,
  onOpenPhoneSimulator,
  onSendManualSms,
  onClearAllSms,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'logs' | 'templates' | 'gateway_config'>('logs');

  // Manual test send form
  const [testMobile, setTestMobile] = useState('+91 94350 28190');
  const [testName, setTestName] = useState('Shri Anupam Baruah');
  const [testMessage, setTestMessage] = useState(
    'GOVT OF ASSAM - CO-DISTRICT ADMINISTRATION, NAZIRA: Official leave alert test notification. Your Casual Leave portal is operational. - CDC Nazira'
  );

  const filteredLogs = notifications.filter((sms) => {
    const matchesSearch =
      sms.recipientMobile.includes(searchTerm) ||
      sms.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sms.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sms.relatedMemoNo && sms.relatedMemoNo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEvent = selectedEvent === 'ALL' || sms.triggerEvent === selectedEvent;

    return matchesSearch && matchesEvent;
  });

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMobile || !testMessage) return;
    onSendManualSms(testMobile, testName, testMessage);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                SMS Dispatch & Notification Gateway
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{config.enableAutomatedPushes ? 'DLT ACTIVE · AUTO PUSH ACTIVE' : 'DLT ACTIVE · AUTO PUSHES DISABLED'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Govt of Assam / Co-District Administration, Nazira
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPhoneSimulator()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Launch Phone Handset Simulator</span>
            </button>
            <button
              onClick={playSmsChime}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Test Web Audio sound synthesizer"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Audio Chime</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Strip with Tabular Numerals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-slate-500 text-xs block">Total Dispatched</span>
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              {notifications.length}
            </span>
            <span className="text-[11px] text-slate-400 block">Messages to staff</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">Delivery Success</span>
            <span className="text-xl font-bold font-mono text-emerald-600 tabular-nums">
              100.0%
            </span>
            <span className="text-[11px] text-slate-400 block">Zero dropouts</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">Push Notification Mode</span>
            <span className="text-xl font-bold font-mono text-blue-600">
              {config.enableAutomatedPushes ? 'Automated' : 'Manual'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {config.enableAutomatedPushes ? 'Background push on' : 'Automated push disabled'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">DLT Sender Header</span>
            <span className="text-xl font-bold font-mono text-purple-700 tracking-wider">
              {config.senderId}
            </span>
            <span className="text-[11px] text-slate-400 block">TRAI Registered</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'logs'
              ? 'border-emerald-600 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Live Dispatch Logs ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'templates'
              ? 'border-emerald-600 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Approved DLT Templates (4)
        </button>
        <button
          onClick={() => setActiveTab('gateway_config')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'gateway_config'
              ? 'border-emerald-600 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Gateway Settings & Test Console
        </button>
      </div>

      {/* Tab 1: Live Dispatch Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-4 p-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Mobile, Employee name, Memo No, or message keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="ALL">All Events</option>
                <option value="LEAVE_SUBMITTED">Leave Submitted</option>
                <option value="LEAVE_RECOMMENDED">Attendance Verifier Recommended</option>
                <option value="LEAVE_SANCTIONED">Sanctioned by Co-District Administration, Nazira</option>
                <option value="LEAVE_REJECTED">Rejected</option>
              </select>

              {onClearAllSms && notifications.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Clear all SMS notification logs?')) {
                      onClearAllSms();
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Clear all SMS dispatch logs"
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                  <span>Clear SMS Logs</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Sender & Recipient</th>
                  <th className="py-2.5 px-3">Event / Memo</th>
                  <th className="py-2.5 px-3">SMS Text Dispatched</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500 text-xs">
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                          <Send className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-700">No SMS logs in dispatch queue</p>
                        <p className="text-slate-400 text-[11px]">
                          Automated SMS pushes have been removed and past logs cleared. You can send official SMS messages manually using the Test Console if needed.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((sms) => (
                    <tr key={sms.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {new Date(sms.sentAt).toLocaleDateString()} {new Date(sms.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{sms.recipientName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{sms.recipientMobile}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200 block">
                          {sms.relatedMemoNo || 'MANUAL-SMS'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {sms.triggerEvent}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 min-w-[280px] max-w-[420px]">
                        <p className="text-slate-700 text-[11px] line-clamp-2 font-mono">
                          {sms.message}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Template: {sms.templateId} · {sms.charCount} chars
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{sms.status}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenPhoneSimulator(sms.recipientMobile)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                        >
                          View in Device
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: DLT Templates */}
      {activeTab === 'templates' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Government Registered DLT SMS Templates
            </h3>
            <p className="text-xs text-slate-500">
              Approved by Telecom Regulatory Authority of India (TRAI) for Co-District Administration, Nazira
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Template 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">1. Leave Request Submission</span>
                <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  DLT-1107168294719273
                </span>
              </div>
              <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded border border-slate-200/80">
                GOVT OF ASSAM - CO-DISTRICT ADMINISTRATION, NAZIRA: Casual Leave request for &#123;#var#&#125; day(s) starting &#123;#var#&#125; has been SUBMITTED successfully by &#123;#var#&#125;. Application Ref: &#123;#var#&#125;. - Attendance Verifier / Establishment Branch, CDC Nazira
              </p>
              <div className="text-[10px] text-slate-500">
                Trigger: On employee submission | Category: Transactional Service
              </div>
            </div>

            {/* Template 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">2. Leave Sanctioned Formal Alert</span>
                <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  DLT-1107168294719274
                </span>
              </div>
              <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded border border-slate-200/80">
                GOVT OF ASSAM - CO-DISTRICT ADMINISTRATION, NAZIRA: Casual Leave of &#123;#var#&#125; day(s) from &#123;#var#&#125; to &#123;#var#&#125; has been SANCTIONED vide Order No: &#123;#var#&#125;. Remaining CL Balance: &#123;#var#&#125; days. - CDC Nazira e-CLMS
              </p>
              <div className="text-[10px] text-slate-500">
                Trigger: On Co-District Administration, Nazira digital sanction
              </div>
            </div>

            {/* Template 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">3. Verification & Forwarding</span>
                <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  DLT-1107168294719275
                </span>
              </div>
              <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded border border-slate-200/80">
                CDC NAZIRA UPDATE: CL application &#123;#var#&#125; for &#123;#var#&#125; has been RECOMMENDED by &#123;#var#&#125; and put up for Sanction Order to Co-District Administration, Nazira.
              </p>
              <div className="text-[10px] text-slate-500">
                Trigger: On Form 25 Attendance Register recommendation (Attendance Verifier / Establishment Branch)
              </div>
            </div>

            {/* Template 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">4. Rejection / Query Notice</span>
                <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  DLT-1107168294719278
                </span>
              </div>
              <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded border border-slate-200/80">
                CDC NAZIRA NOTICE: Your Casual Leave application &#123;#var#&#125; could not be sanctioned. Reason: &#123;#var#&#125;. Please report to Nazir Branch, CDC Office.
              </p>
              <div className="text-[10px] text-slate-500">
                Trigger: On rejection by Head of Office
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Gateway Configuration & Manual Test Send */}
      {activeTab === 'gateway_config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-700" />
              <span>SMS Gateway Provider Setup</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                Provider Protocol
              </label>
              <select
                value={config.provider}
                onChange={(e) => onUpdateConfig({ provider: e.target.value as SMSGatewayConfig['provider'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="DEMO_DLT">Interactive Telecom DLT Simulator (Pre-configured)</option>
                <option value="NIC_SMS">National Informatics Centre (NIC) SMS Gateway</option>
                <option value="FAST2SMS">Fast2SMS (Quick SMS India Gateway)</option>
                <option value="TWILIO">Twilio Cloud SMS API</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                Registered Sender ID / Header
              </label>
              <input
                type="text"
                value={config.senderId}
                onChange={(e) => onUpdateConfig({ senderId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">
                Max 6 alphabetic characters for India DLT (e.g. AS-CDCNZR).
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                API Key / Auth Token (Optional for live production)
              </label>
              <input
                type="password"
                placeholder="Live API Key (Stored in session)"
                value={config.apiKey}
                onChange={(e) => onUpdateConfig({ apiKey: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableAutomatedPushes"
                  checked={config.enableAutomatedPushes || false}
                  onChange={(e) => onUpdateConfig({ enableAutomatedPushes: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <label htmlFor="enableAutomatedPushes" className="font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-slate-600" />
                  <span>Enable Automated SMS Pushes on Leave Events (Disabled by default)</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableChime"
                  checked={config.enableAudioChime}
                  onChange={(e) => onUpdateConfig({ enableAudioChime: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <label htmlFor="enableChime" className="font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Synthesize Web Audio notification sound on every SMS transmission</span>
                </label>
              </div>
            </div>
          </div>

          {/* Test Dispatch Console */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Manual Test SMS Dispatcher</span>
            </h3>
            <p className="text-slate-500">
              Send an instant administrative broadcast or test notification to verify delivery and sound effects.
            </p>

            <form onSubmit={handleTestSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Recipient Mobile</label>
                  <input
                    type="tel"
                    value={testMobile}
                    onChange={(e) => setTestMobile(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Staff Name</label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">SMS Body Text</label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  Characters: {testMessage.length} | 1 SMS Segment
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Test SMS Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
