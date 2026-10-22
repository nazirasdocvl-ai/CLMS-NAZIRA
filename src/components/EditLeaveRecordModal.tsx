import React, { useState, useEffect } from 'react';
import { LeaveRequest, LeaveType, LeaveStatus, Employee } from '../types';
import { X, Save, Trash2, Edit3, ShieldAlert } from 'lucide-react';

interface EditLeaveRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
  employees: Employee[];
  onUpdateLeaveRequest: (updated: LeaveRequest) => void;
  onDeleteLeaveRequest?: (requestId: string) => void;
}

export const EditLeaveRecordModal: React.FC<EditLeaveRecordModalProps> = ({
  isOpen,
  onClose,
  request,
  employees,
  onUpdateLeaveRequest,
  onDeleteLeaveRequest,
}) => {
  const [memoNo, setMemoNo] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('CASUAL_LEAVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [reasonCategory, setReasonCategory] = useState<LeaveRequest['reasonCategory']>('Urgent Family Affairs');
  const [reasonDetails, setReasonDetails] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [stationLeaveRequired, setStationLeaveRequired] = useState(false);
  const [stationLeaveAddress, setStationLeaveAddress] = useState('');
  const [chargeHandover, setChargeHandover] = useState('');
  const [status, setStatus] = useState<LeaveStatus>('SUBMITTED');
  const [sanctionOrderNo, setSanctionOrderNo] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (request) {
      setMemoNo(request.memoNo);
      setLeaveType(request.leaveType);
      setStartDate(request.startDate);
      setEndDate(request.endDate);
      setTotalDays(request.totalDays);
      setReasonCategory(request.reasonCategory);
      setReasonDetails(request.reasonDetails);
      setContactNumber(request.contactNumberDuringLeave);
      setStationLeaveRequired(request.stationLeaveRequired);
      setStationLeaveAddress(request.stationLeaveAddress || '');
      setChargeHandover(request.chargeHandoverEmployeeName || '');
      setStatus(request.status);
      setSanctionOrderNo(request.sanctionOrderNo || '');
      setShowDeleteConfirm(false);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonDetails.trim()) {
      alert('Please enter reason details.');
      return;
    }

    const updated: LeaveRequest = {
      ...request,
      memoNo,
      leaveType,
      startDate,
      endDate,
      totalDays: Number(totalDays),
      reasonCategory,
      reasonDetails,
      contactNumberDuringLeave: contactNumber,
      stationLeaveRequired,
      stationLeaveAddress: stationLeaveRequired ? stationLeaveAddress : undefined,
      chargeHandoverEmployeeName: chargeHandover || undefined,
      status,
      sanctionOrderNo: sanctionOrderNo || undefined,
    };

    onUpdateLeaveRequest(updated);
    onClose();
  };

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
                  Modify Casual Leave Entry & Record
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-blue-700" />
                  Sanctioning Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {request.memoNo} · {request.employeeName} · Co-District Administration, Nazira
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Memo Reference No.</label>
              <input
                type="text"
                value={memoNo}
                onChange={(e) => setMemoNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Leave Nature</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="CASUAL_LEAVE">Casual Leave (Full Day)</option>
                <option value="HALF_DAY_CL_FN">Half Day (Forenoon FN)</option>
                <option value="HALF_DAY_CL_AN">Half Day (Afternoon AN)</option>
                <option value="RESTRICTED_HOLIDAY">Restricted Holiday (RH)</option>
                <option value="COMPENSATORY_CL">Compensatory Leave (CCL)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Total Leave Days</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="30"
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Reason Category</label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value as LeaveRequest['reasonCategory'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Urgent Family Affairs">Urgent Family Affairs</option>
                <option value="Medical / Health">Medical / Health Consultation</option>
                <option value="Domestic Emergency">Domestic Emergency</option>
                <option value="Religious & Cultural Observance">Religious & Cultural Observance</option>
                <option value="Official Examination">Official Examination / Study</option>
                <option value="Social Duty">Social / Community Obligation</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeaveStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="SUBMITTED">SUBMITTED (Pending)</option>
                <option value="RECOMMENDED">RECOMMENDED (Nazir Checked)</option>
                <option value="SANCTIONED">SANCTIONED (Approved)</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-slate-700">Reason Details</label>
            <textarea
              rows={2}
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Contact Number During Leave</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Sanction Order No. (if approved)</label>
              <input
                type="text"
                placeholder="e.g. NZR/ESTT/CL-ORD/2026/142"
                value={sanctionOrderNo}
                onChange={(e) => setSanctionOrderNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editStationLeave"
                checked={stationLeaveRequired}
                onChange={(e) => setStationLeaveRequired(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-slate-300 cursor-pointer"
              />
              <label htmlFor="editStationLeave" className="font-semibold text-slate-800 cursor-pointer">
                Station Leave Permission Accorded
              </label>
            </div>
            {stationLeaveRequired && (
              <input
                type="text"
                placeholder="Outstation address / destination"
                value={stationLeaveAddress}
                onChange={(e) => setStationLeaveAddress(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            )}
          </div>

          {/* Delete Option */}
          {onDeleteLeaveRequest && (
            <div className="pt-2">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete this leave entry from register...</span>
                </button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-1.5 text-red-800 font-semibold text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Confirm deletion of entry {request.memoNo}?</span>
                  </div>
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
                        onDeleteLeaveRequest(request.id);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                    >
                      Yes, Delete Record
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
              <span>Update Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
