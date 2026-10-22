import { SMSNotification } from '../types';

// Play authentic mobile SMS alert tone via Web Audio API
export function playSmsChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (higher note)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Second tone (harmonic chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.35);
  } catch {
    // Audio context may be restricted by autoplay policy before user interaction
  }
}

export function generateSmsMessage(
  event: SMSNotification['triggerEvent'],
  data: {
    employeeName: string;
    memoNo: string;
    totalDays: number;
    startDate: string;
    endDate?: string;
    remainingBalance?: number;
    sanctionedBy?: string;
    sanctionOrderNo?: string;
    recommendedBy?: string;
    rejectionReason?: string;
  }
): { text: string; templateId: string } {
  switch (event) {
    case 'LEAVE_SUBMITTED':
      return {
        templateId: 'DLT-1107168294719273',
        text: `GOVT OF ASSAM - CO-DISTRICT ADMINISTRATION, NAZIRA: Casual Leave request for ${data.totalDays} day(s) starting ${data.startDate} has been SUBMITTED successfully by ${data.employeeName}. Application Ref: ${data.memoNo}. - Establishment Branch, CDC Nazira`,
      };
    case 'LEAVE_RECOMMENDED':
      return {
        templateId: 'DLT-1107168294719275',
        text: `CDC NAZIRA UPDATE: CL application ${data.memoNo} for ${data.employeeName} has been RECOMMENDED by ${data.recommendedBy || 'Establishment Branch'} and put up for Sanction Order to Co-District Administration, Nazira.`,
      };
    case 'LEAVE_SANCTIONED':
      return {
        templateId: 'DLT-1107168294719274',
        text: `GOVT OF ASSAM - CO-DISTRICT ADMINISTRATION, NAZIRA: Casual Leave of ${data.totalDays} day(s) from ${data.startDate} to ${data.endDate || data.startDate} has been SANCTIONED vide Order No: ${data.sanctionOrderNo || 'NZR/ESTT/CL-ORD/2026'}. Remaining CL Balance: ${data.remainingBalance ?? 0} days. - CDC Nazira e-CLMS`,
      };
    case 'LEAVE_REJECTED':
      return {
        templateId: 'DLT-1107168294719278',
        text: `CDC NAZIRA NOTICE: Your Casual Leave application ${data.memoNo} could not be sanctioned. Reason: ${data.rejectionReason || 'Administrative requirement'}. Please report to Establishment Branch, Co-District Administration, Nazira.`,
      };
    case 'REMINDER':
    default:
      return {
        templateId: 'DLT-1107168294719279',
        text: `CDC NAZIRA NOTICE: Pending review for leave request ${data.memoNo}. Please attend to urgent files. - Co-District Administration, Nazira`,
      };
  }
}

export function createSmsPayload(
  recipientMobile: string,
  recipientName: string,
  event: SMSNotification['triggerEvent'],
  data: Parameters<typeof generateSmsMessage>[1]
): SMSNotification {
  const { text, templateId } = generateSmsMessage(event, data);
  const now = new Date().toISOString();

  return {
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    templateId,
    senderId: 'AS-CDCNZR',
    recipientMobile,
    recipientName,
    message: text,
    status: 'DELIVERED',
    sentAt: now,
    deliveredAt: new Date(Date.now() + 1500).toISOString(),
    relatedMemoNo: data.memoNo,
    charCount: text.length,
    triggerEvent: event,
  };
}
