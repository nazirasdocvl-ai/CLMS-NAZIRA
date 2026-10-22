import React, { useState, useMemo } from 'react';
import { LeaveRequest, UserRole, Branch } from '../types';
import { Search, Filter, Download, Plus, Eye, Check, UserCheck, FileText, MapPin, AlertCircle, Edit3, Trash2 } from 'lucide-react';

interface LeaveRegisterTableProps {
  requests: LeaveRequest[];
  currentRole: UserRole;
  onSelectRequest: (request: LeaveRequest) => void;
  onOpenApplyModal: () => void;
  onQuickSanction: (request: LeaveRequest) => void;
  onQuickRecommend: (request: LeaveRequest) => void;
  onViewOrder: (request: LeaveRequest) => void;
  onEditRequest?: (request: LeaveRequest) => void;
  onDeleteRequest?: (requestId: string) => void;
  onClearAllRequests?: () => void;
  canEdit?: boolean;
}

export const LeaveRegisterTable: React.FC<LeaveRegisterTableProps> = ({
  requests,
  currentRole,
  onSelectRequest,
  onOpenApplyModal,
  onQuickSanction,
  onQuickRecommend,
  onViewOrder,
  onEditRequest,
  onDeleteRequest,
  onClearAllRequests,
  canEdit = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SANCTIONED' | 'REJECTED'>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.memoNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reasonDetails.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'PENDING'
          ? req.status === 'SUBMITTED' || req.status === 'RECOMMENDED'
          : req.status === statusFilter;

      const matchesBranch = branchFilter === 'ALL' ? true : req.branch === branchFilter;

      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [requests, searchTerm, statusFilter, branchFilter]);

  const handleExportCSV = () => {
    const headers = [
      'Memo No',
      'Applied Date',
      'Employee Name',
      'Designation',
      'Branch',
      'Leave Type',
      'Start Date',
      'End Date',
      'Total Days',
      'Reason Category',
      'Reason Details',
      'Station Leave',
      'Charge Handover',
      'Status',
      'Sanction Order No',
    ];

    const rows = filteredRequests.map((r) => [
      r.memoNo,
      r.appliedAt.split('T')[0],
      `"${r.employeeName}"`,
      `"${r.designation}"`,
      `"${r.branch}"`,
      r.leaveType,
      r.startDate,
      r.endDate,
      r.totalDays,
      `"${r.reasonCategory}"`,
      `"${r.reasonDetails.replace(/"/g, '""')}"`,
      r.stationLeaveRequired ? 'YES' : 'NO',
      `"${r.chargeHandoverEmployeeName || 'N/A'}"`,
      r.status,
      r.sanctionOrderNo || 'N/A',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CDC_Nazira_CL_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'SANCTIONED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Sanctioned
          </span>
        );
      case 'RECOMMENDED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Recommended
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Pending Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Employee name, Designation, Memo No, or Reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Branch filter */}
          <div className="flex items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
            >
              <option value="ALL">All Branches / Sections</option>
              <option value="Revenue & Circle Office">Revenue & Circle Office</option>
              <option value="Nazir Branch">Nazir Branch</option>
              <option value="Establishment Section">Establishment Section</option>
              <option value="Development Branch">Development Branch</option>
              <option value="Land Records & Lot Mandal">Land Records & Lot Mandal</option>
              <option value="e-Governance & IT Cell">e-Governance & IT Cell</option>
              <option value="Grade IV & General Pool">Grade IV & General Pool</option>
            </select>

            {canEdit && onClearAllRequests && requests.length > 0 && (
              <button
                onClick={onClearAllRequests}
                className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Remove all leave entries from register"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Clear All Requests</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Download CSV Leave Register"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Form 25</span>
            </button>

            <button
              onClick={onOpenApplyModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Leave Request</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 mr-2 text-[11px] font-medium">Filter Status:</span>
          {(['ALL', 'PENDING', 'SANCTIONED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL'
                ? `All Entries (${requests.length})`
                : tab === 'PENDING'
                ? `Pending Approvals (${requests.filter((r) => r.status === 'SUBMITTED' || r.status === 'RECOMMENDED').length})`
                : tab === 'SANCTIONED'
                ? `Sanctioned (${requests.filter((r) => r.status === 'SANCTIONED').length})`
                : `Rejected (${requests.filter((r) => r.status === 'REJECTED').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table Canvas */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-3.5 whitespace-nowrap">Memo Ref & Date</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Employee & Branch</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Period (From — To)</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-right">Days</th>
                <th className="py-3 px-3.5 min-w-[220px]">Reason & Handover</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700">No casual leave entries in register</p>
                      <p className="text-slate-400 text-[11px]">
                        All pending sanctions and sanction requests have been removed. Click "New Leave Request" to submit a fresh application.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectRequest(req)}
                  >
                    {/* Memo Ref & Date */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {req.memoNo}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {new Date(req.appliedAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Employee & Branch */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{req.employeeName}</div>
                      <div className="text-[11px] text-slate-500">
                        {req.designation} <span className="text-slate-300">·</span> {req.branch}
                      </div>
                    </td>

                    {/* Period */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-medium">
                        {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {req.leaveType.replace(/_/g, ' ')}
                      </div>
                    </td>

                    {/* Days */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-right font-mono tabular-nums">
                      <span className="font-bold text-slate-900 text-sm">{req.totalDays}</span>
                      <span className="text-slate-500 text-[11px]">d</span>
                    </td>

                    {/* Reason & Handover */}
                    <td className="py-3 px-3.5 max-w-[280px]">
                      <p className="text-slate-800 line-clamp-1">
                        <strong className="text-slate-900">{req.reasonCategory}:</strong> {req.reasonDetails}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        {req.stationLeaveRequired && (
                          <span className="text-amber-700 flex items-center gap-0.5 font-medium">
                            <MapPin className="w-3 h-3" />
                            <span>Station Leave</span>
                          </span>
                        )}
                        {req.chargeHandoverEmployeeName && (
                          <span className="truncate">
                            Handover: {req.chargeHandoverEmployeeName.split('(')[0]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectRequest(req)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Track Status & History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {canEdit && onEditRequest && (
                          <button
                            onClick={() => onEditRequest(req)}
                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Modify / Update Leave Entry Details (Sanctioning Authority Only)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Quick Nazir Recommend */}
                        {req.status === 'SUBMITTED' && (currentRole === 'nazir_verifier' || currentRole === 'sdo_officer') && (
                          <button
                            onClick={() => onQuickRecommend(req)}
                            className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors cursor-pointer"
                            title="Verify in Register & Recommend"
                          >
                            Recommend
                          </button>
                        )}

                        {/* Quick Co-District Administration Sanction */}
                        {(req.status === 'SUBMITTED' || req.status === 'RECOMMENDED') && (currentRole === 'sdo_officer') && (
                          <button
                            onClick={() => onQuickSanction(req)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors cursor-pointer shadow-2xs"
                            title="Sanction & Issue Formal Order"
                          >
                            Sanction
                          </button>
                        )}

                        {/* View Formal Order */}
                        {req.status === 'SANCTIONED' && (
                          <button
                            onClick={() => onViewOrder(req)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                            title="Print Formal Sanction Order"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {canEdit && onDeleteRequest && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete leave record ${req.memoNo} for ${req.employeeName}?`)) {
                                onDeleteRequest(req.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Leave Entry (Sanctioning Authority Only)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
