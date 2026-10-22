import React, { useState } from 'react';
import { LeaveRequest, SMSNotification, UserRole } from '../types';
import { X, CheckCircle2, Clock, AlertTriangle, FileText, Send, Smartphone, ShieldCheck, MapPin, UserCheck, Edit3 } from 'lucide-react';

interface LeaveTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
  currentRole: UserRole;
  smsNotifications: SMSNotification[];
  onRecommend: (requestId: string, remarks: string) => void;
  onSanction: (requestId: string, orderNo: string, remarks: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onViewSanctionOrder: (request: LeaveRequest) => void;
  onOpenPhoneSimulator: (mobile: string) => void;
  onEditRequest?: (request: LeaveRequest) => void;
  canEdit?: boolean;
}

export const LeaveTrackerModal: React.FC<LeaveTrackerModalProps> = ({
  isOpen,
  onClose,
  request,
  currentRole,
  smsNotifications,
  onRecommend,
  onSanction,
  onReject,
  onViewSanctionOrder,
  onOpenPhoneSimulator,
  onEditRequest,
  canEdit = false,
}) => {
  const [recommendRemarks, setRecommendRemarks] = useState('Verified with Attendance Register Form 25. Leave balance is in order. Recommended for formal sanction.');
  const [sanctionRemarks, setSanctionRemarks] = useState('Casual Leave sanctioned as prayed for. Station leave granted.');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !request) return null;

  const relatedSmsList = smsNotifications.filter((sms) => sms.relatedMemoNo === request.memoNo);

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'SANCTIONED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'RECOMMENDED':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'SUBMITTED':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'REJECTED':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {request.memoNo}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-semibold border ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Casual Leave Lifecycle & SMS Audit Trail
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onEditRequest && (
              <button
                onClick={() => {
                  onClose();
                  onEditRequest(request);
                }}
                className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Modify / Update Leave Record (Sanctioning Authority)"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Modify Record</span>
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
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Stepper Progress */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Real-time Administrative Status Tracker
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
              {/* Step 1 */}
              <div className={`p-3 rounded-lg border text-xs ${
                request.status !== 'CANCELLED'
                  ? 'bg-white border-emerald-300 shadow-2xs'
                  : 'bg-slate-100 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Submitted</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {request.employeeName}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  {new Date(request.appliedAt).toLocaleDateString()} {new Date(request.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Step 2 */}
              <div className={`p-3 rounded-lg border text-xs ${
                request.status === 'RECOMMENDED' || request.status === 'SANCTIONED'
                  ? 'bg-white border-blue-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                  {request.status === 'RECOMMENDED' || request.status === 'SANCTIONED' ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                  <span>2. Nazir Verification</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {request.recommendedBy || 'Awaiting Nazir review'}
                </p>
                {request.recommendedAt && (
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {new Date(request.recommendedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-lg border text-xs ${
                request.status === 'SANCTIONED'
                  ? 'bg-white border-emerald-500 shadow-2xs'
                  : request.status === 'REJECTED'
                  ? 'bg-white border-red-400 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                  {request.status === 'SANCTIONED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : request.status === 'REJECTED' ? (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                  <span>3. Sanctioning Authority</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {request.status === 'SANCTIONED'
                    ? request.sanctionedBy || 'Co-District Commissioner, Nazira'
                    : request.status === 'REJECTED'
                    ? 'Rejected with remarks'
                    : 'Pending Co-District Commissioner Signature'}
                </p>
                {request.sanctionOrderNo && (
                  <p className="text-[10px] text-emerald-700 font-mono mt-1 font-medium">
                    Order: {request.sanctionOrderNo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Leave Details Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Application Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Applicant</span>
                <span className="font-semibold text-slate-900">{request.employeeName}</span>
                <span className="text-[11px] text-slate-500 block">{request.designation}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Section / Branch</span>
                <span className="font-semibold text-slate-900">{request.branch}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Period</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {request.startDate} to {request.endDate}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Total: <strong className="text-slate-800">{request.totalDays} day(s)</strong>
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Phone</span>
                <span className="font-mono text-slate-900 font-semibold">{request.contactNumberDuringLeave}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Reason for Casual Leave</span>
                <p className="text-slate-800 font-medium mt-0.5">
                  <strong className="text-slate-900 font-semibold">{request.reasonCategory}:</strong> {request.reasonDetails}
                </p>
              </div>
              <div>
                <span className="text-slate-500 block">Desk Charge Handover</span>
                <p className="text-slate-800 font-medium mt-0.5">
                  {request.chargeHandoverEmployeeName || 'No temporary handover specified'}
                </p>
              </div>
            </div>

            {request.stationLeaveRequired && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Station Leave Accorded:</strong> {request.stationLeaveAddress || 'Outside headquarters'}
                </span>
              </div>
            )}
          </div>

          {/* Action Cockpit for Attendance Verifier or Co-District Commissioner */}
          {request.status !== 'SANCTIONED' && request.status !== 'REJECTED' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Administrative Actions (Acting as {currentRole === 'sdo_officer' ? 'Co-District Commissioner, Nazira' : currentRole === 'nazir_verifier' ? 'Attendance Verifier / Establishment Branch' : 'Employee'})</span>
              </h3>

              {/* If Verifier & Submitted */}
              {request.status === 'SUBMITTED' && (currentRole === 'nazir_verifier' || currentRole === 'sdo_officer') && (
                <div className="space-y-2 p-3 bg-white rounded-lg border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700">
                    Attendance Verifier / Establishment Branch Notes (Form 25 check):
                  </label>
                  <input
                    type="text"
                    value={recommendRemarks}
                    onChange={(e) => setRecommendRemarks(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onRecommend(request.id, recommendRemarks)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verify & Forward for Sanction Order</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Co-District Administration, Nazira Sanction Action (Sanctioning Authority Only) */}
              {currentRole === 'sdo_officer' && (
                <div className="space-y-3 p-3 bg-white rounded-lg border border-slate-200">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Sanction Order Remarks:
                    </label>
                    <input
                      type="text"
                      value={sanctionRemarks}
                      onChange={(e) => setSanctionRemarks(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {!showRejectInput ? (
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setShowRejectInput(true)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                      >
                        Reject / Return with query...
                      </button>

                      <button
                        onClick={() => {
                          const orderNo = `NZR/ESTT/CL-ORD/2026/${Math.floor(100 + Math.random() * 900)}`;
                          onSanction(request.id, orderNo, sanctionRemarks);
                        }}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sanction Casual Leave & Dispatch Automated SMS</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <label className="block text-xs font-semibold text-red-700">
                        Reason for Rejection / Return:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Administrative exigency; important assembly election meeting scheduled"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowRejectInput(false)}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (!rejectReason.trim()) {
                              alert('Please state the rejection reason.');
                              return;
                            }
                            onReject(request.id, rejectReason);
                          }}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
                        >
                          Confirm Rejection & Send SMS
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* If Sanctioned - Show Sanction Order CTA */}
          {request.status === 'SANCTIONED' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Sanction Order No: {request.sanctionOrderNo}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Signed & Sanctioned by {request.sanctionedBy || 'Co-District Commissioner, Nazira'}
                </span>
              </div>
              <button
                onClick={() => onViewSanctionOrder(request)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View & Print Official Office Order</span>
              </button>
            </div>
          )}

          {/* Automated SMS Dispatch Audit Log for this application */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Automated SMS Dispatch Log ({relatedSmsList.length} Dispatched)</span>
              </h3>
              <button
                onClick={() => onOpenPhoneSimulator(request.contactNumberDuringLeave)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Open in Mobile Handset Simulator</span>
              </button>
            </div>

            {relatedSmsList.length === 0 ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
                No SMS dispatched yet.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedSmsList.map((sms) => (
                  <div
                    key={sms.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-800">
                          {sms.senderId}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-mono text-slate-700">
                          {sms.recipientMobile} ({sms.recipientName})
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {sms.status} (DLT ID: {sms.templateId})
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed bg-white p-2 rounded border border-slate-200/70 font-mono">
                      {sms.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Sent: {new Date(sms.sentAt).toLocaleTimeString()}</span>
                      <span>Length: {sms.charCount} chars</span>
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
