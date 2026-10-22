export type Branch =
  | 'TN, R &DM'
  | 'R & DM Branch'
  | 'Census'
  | 'Administration'
  | 'Administration Branch'
  | 'RKG, Enaroachment, Settlement Branch'
  | 'RKG'
  | 'Settlement'
  | 'DDevelopment Branch'
  | 'Development Branch'
  | 'Magistracy'
  | 'Magistracy Branch'
  | 'T & D Branch'
  | 'T &D'
  | 'Nazarat'
  | 'Nazarat Branch'
  | 'nazarat Branch'
  | 'Nazir Branch'
  | 'CA, Establishment Section'
  | 'Establishment Section'
  | 'Accounts Branch'
  | 'TN Branch'
  | 'Confidential Branch'
  | 'CA Branch'
  | 'Revenue & Circle Office'
  | 'Land Records & Lot Mandal'
  | 'e-Governance & IT Cell'
  | 'Grade IV & General Pool'
  | 'Co-District Administration / Executive'
  | (string & {});

export type UserRole = 'sdo_officer' | 'nazir_verifier' | 'employee';

export type LeaveType =
  | 'CASUAL_LEAVE'
  | 'HALF_DAY_CL_FN'
  | 'HALF_DAY_CL_AN'
  | 'RESTRICTED_HOLIDAY'
  | 'COMPENSATORY_CL';

export type LeaveStatus =
  | 'SUBMITTED'
  | 'RECOMMENDED'
  | 'SANCTIONED'
  | 'REJECTED'
  | 'CANCELLED';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  branch: Branch;
  mobile: string;
  email: string;
  clTotalQuota: number;
  clAvailed: number;
  clPending: number;
  rhQuota: number;
  rhAvailed: number;
  joiningDate: string;
  role: UserRole;
  isSanctioningOfficer?: boolean;
}

export interface LeaveTimelineEntry {
  status: LeaveStatus;
  timestamp: string;
  actor: string;
  remarks: string;
}

export interface LeaveRequest {
  id: string;
  memoNo: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  branch: Branch;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reasonCategory: 'Urgent Family Affairs' | 'Medical / Health' | 'Domestic Emergency' | 'Religious & Cultural Observance' | 'Official Examination' | 'Social Duty';
  reasonDetails: string;
  contactNumberDuringLeave: string;
  stationLeaveRequired: boolean;
  stationLeaveAddress?: string;
  chargeHandoverEmployeeId?: string;
  chargeHandoverEmployeeName?: string;
  status: LeaveStatus;
  appliedAt: string;
  recommendedBy?: string;
  recommendedAt?: string;
  recommendationRemarks?: string;
  sanctionedBy?: string;
  sanctionedAt?: string;
  sanctionOrderNo?: string;
  rejectionReason?: string;
  smsNotificationIds: string[];
  timeline: LeaveTimelineEntry[];
}

export interface SMSNotification {
  id: string;
  templateId: string;
  senderId: string;
  recipientMobile: string;
  recipientName: string;
  message: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED';
  sentAt: string;
  deliveredAt?: string;
  relatedMemoNo?: string;
  charCount: number;
  triggerEvent: 'LEAVE_SUBMITTED' | 'LEAVE_SANCTIONED' | 'LEAVE_REJECTED' | 'LEAVE_RECOMMENDED' | 'REMINDER';
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  type: 'GAZETTED' | 'RESTRICTED' | 'LOCAL';
  description?: string;
}

export interface SMSGatewayConfig {
  provider: 'DEMO_DLT' | 'FAST2SMS' | 'NIC_SMS' | 'TWILIO';
  senderId: string;
  apiKey: string;
  enableAudioChime: boolean;
  autoDeliverDelayMs: number;
  smsActive: boolean;
  enableAutomatedPushes?: boolean;
}
