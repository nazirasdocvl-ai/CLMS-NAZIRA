import React from 'react';
import { LeaveRequest } from '../types';
import { X, Printer, Download, CheckCircle, Shield } from 'lucide-react';
import { OfficeEmblem } from './OfficeEmblem';

interface SanctionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
}

export const SanctionOrderModal: React.FC<SanctionOrderModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const orderNo = request.sanctionOrderNo || 'NZR/ESTT/CL-ORD/2026/142';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              Official Sanction Order Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Order</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 sm:p-12 overflow-y-auto font-serif text-slate-900 space-y-6 leading-relaxed bg-white">
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-slate-300 pb-4">
            <div className="flex justify-center mb-2">
              <OfficeEmblem className="w-16 h-16" />
            </div>
            <h1 className="text-sm font-bold tracking-wider uppercase font-sans text-slate-800">
              GOVERNMENT OF ASSAM
            </h1>
            <h2 className="text-base font-bold uppercase font-sans tracking-wide text-slate-900">
              OFFICE OF THE CO-DISTRICT COMMISSIONER :::::::: NAZIRA
            </h2>
            <p className="text-xs font-sans text-slate-600">
              (ESTABLISHMENT & GENERAL ADMINISTRATION BRANCH)
            </p>
            <p className="text-[11px] font-sans text-slate-500">
              P.O. Nazira, Dist: Sivasagar, Assam - 785685
            </p>
          </div>

          {/* Order Ref Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs font-sans border-b border-slate-200 pb-2">
            <div>
              <span className="font-semibold text-slate-700">ORDER NO: </span>
              <span className="font-mono font-bold text-slate-900">{orderNo}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">DATED NAZIRA, THE </span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>
          </div>

          {/* Order Body Text */}
          <div className="space-y-4 text-sm text-justify pt-2">
            <h3 className="text-center font-bold font-sans text-sm tracking-wide underline underline-offset-4 mb-4">
              O R D E R
            </h3>

            <p>
              In terms of the provisions under Rule 285 of the Assam Subsidiary Rules, Casual Leave for{' '}
              <strong className="underline decoration-slate-400 font-sans">
                {request.totalDays} ({request.totalDays === 1 ? 'one' : request.totalDays === 2 ? 'two' : `${request.totalDays}`}) day(s)
              </strong>{' '}
              with effect from <strong className="font-sans">{request.startDate}</strong> to{' '}
              <strong className="font-sans">{request.endDate}</strong> is hereby granted and sanctioned to{' '}
              <strong className="font-sans">{request.employeeName}</strong>,{' '}
              <span>{request.designation}</span>, {request.branch}, Co-District Administration, Nazira on grounds of{' '}
              <span className="italic">{request.reasonCategory} ({request.reasonDetails})</span>.
            </p>

            {request.stationLeaveRequired ? (
              <p>
                Permission to leave headquarters / station during the aforesaid leave period is also hereby accorded to visit{' '}
                <strong className="font-sans">{request.stationLeaveAddress || 'outstation'}</strong>, subject to the condition that the employee shall remain reachable over the registered mobile phone (<span className="font-mono">{request.contactNumberDuringLeave}</span>) and return promptly on the expiry of the sanctioned leave.
              </p>
            ) : (
              <p>
                The employee shall remain available at headquarters during the leave period in case of any administrative emergency.
              </p>
            )}

            {request.chargeHandoverEmployeeName && (
              <p>
                During the period of absence, <strong className="font-sans">{request.chargeHandoverEmployeeName}</strong> will look after the day-to-day files and receipts of the said desk in addition to own regular duties.
              </p>
            )}

            <p className="text-xs text-slate-600 font-sans italic pt-2">
              (Necessary entry has been recorded in the Casual Leave Register Form No. 25 maintained in Attendance Verifier / Establishment Branch).
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-8 flex justify-end">
            <div className="text-center space-y-1 font-sans">
              <div className="w-32 h-10 mx-auto flex items-center justify-center border-b border-dashed border-slate-400 text-xs text-slate-400 italic">
                (Digitally Authenticated)
              </div>
              <p className="text-xs font-bold text-slate-900 pt-1">
                {request.sanctionedBy || 'Co-District Commissioner, Nazira'}
              </p>
              <p className="text-[11px] text-slate-600">
                Co-District Administration, Nazira, Sivasagar, Assam
              </p>
            </div>
          </div>

          {/* Endorsement Section */}
          <div className="pt-6 border-t border-slate-300 font-sans text-xs space-y-2">
            <div className="flex justify-between font-mono text-[11px] text-slate-700">
              <span>Memo No: {orderNo}-A</span>
              <span>Dated: {formattedDate}</span>
            </div>
            <p className="text-slate-700 font-medium">
              Copy forwarded for kind information and necessary action to:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
              <li>The Co-District Commissioner, Nazira.</li>
              <li>The Attendance Verifier / Establishment Branch for record in Attendance Register Form 25.</li>
              <li>The Dealing Assistant, Establishment Section, Co-District Administration, Nazira.</li>
              <li>Person concerned: {request.employeeName}, {request.designation}.</li>
              <li>Office Copy / Guard File.</li>
            </ol>
            <div className="pt-4 flex justify-end font-sans">
              <div className="text-center text-[11px]">
                <p className="font-semibold text-slate-800">For Co-District Commissioner, Nazira</p>
                <p className="text-slate-500">Nazira, Assam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
