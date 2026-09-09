export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'donor' | 'recipient' | 'admin';

export type UrgencyLevel = 'normal' | 'urgent' | 'critical';

export type RequestStatus = 'open' | 'fulfilled' | 'cancelled';

export type Language = 'en' | 'bn';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  photoUrl?: string;
  bloodGroup: BloodGroup;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  district: string;
  upazila?: string;
  city: string;
  address: string;
  isAvailable: boolean;
  lastDonationDate?: string; // YYYY-MM-DD
  medicalNotes?: string;
  totalDonations: number;
  isVerified?: boolean;
  isBanned?: boolean;
  createdAt: string;
}

export interface RequestResponder {
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  phone: string;
  message?: string;
  timestamp: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  hospitalAddress: string;
  district: string;
  city?: string;
  neededBy: string; // Date/Time string
  urgency: UrgencyLevel;
  contactName: string;
  contactPhone: string;
  description?: string;
  status: RequestStatus;
  createdAt: string;
  responders: RequestResponder[];
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  requestId?: string;
  patientName?: string;
  hospitalName: string;
  units: number;
  donatedAt: string; // YYYY-MM-DD
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'urgent_match' | 'request_response' | 'status_update' | 'system';
  read: boolean;
  linkRequestId?: string;
  createdAt: string;
}

export interface DistrictInfo {
  nameEn: string;
  nameBn: string;
  division: string;
}
