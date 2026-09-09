import { User, BloodRequest, DonationRecord, NotificationItem, BloodGroup, UrgencyLevel, RequestStatus } from '../types';

const USERS_KEY = 'redlink_users_v1';
const REQUESTS_KEY = 'redlink_requests_v1';
const DONATIONS_KEY = 'redlink_donations_v1';
const NOTIFICATIONS_KEY = 'redlink_notifications_v1';
const CURRENT_USER_KEY = 'redlink_current_user_v1';

// Calculate 90 days eligibility gap
export function calculateEligibility(lastDonationDate?: string): {
  isEligible: boolean;
  daysRemaining: number;
  nextEligibleDateStr: string;
} {
  if (!lastDonationDate) {
    return { isEligible: true, daysRemaining: 0, nextEligibleDateStr: 'Today' };
  }

  const lastDate = new Date(lastDonationDate);
  if (isNaN(lastDate.getTime())) {
    return { isEligible: true, daysRemaining: 0, nextEligibleDateStr: 'Today' };
  }

  const eligibleDate = new Date(lastDate);
  eligibleDate.setDate(eligibleDate.getDate() + 90);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eligibleDate.setHours(0, 0, 0, 0);

  const diffTime = eligibleDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isEligible = daysRemaining <= 0;
  const nextEligibleDateStr = eligibleDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

  return {
    isEligible,
    daysRemaining: Math.max(0, daysRemaining),
    nextEligibleDateStr,
  };
}

const INITIAL_USERS: User[] = [
  {
    id: 'usr_donor_1',
    name: 'Tanvir Ahmed',
    email: 'donor@redlink.org',
    phone: '+880 1711-234567',
    role: 'donor',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'O+',
    age: 27,
    gender: 'Male',
    district: 'Dhaka',
    upazila: 'Mirpur',
    city: 'Dhaka',
    address: 'Sector 2, Mirpur-10, Dhaka 1216',
    isAvailable: true,
    lastDonationDate: '2026-05-10', // More than 90 days ago -> eligible
    medicalNotes: 'Fit and regular whole blood donor. No chronic illnesses.',
    totalDonations: 7,
    isVerified: true,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'usr_donor_2',
    name: 'Dr. Sabrina Hasan',
    email: 'sabrina@redlink.org',
    phone: '+880 1819-876543',
    role: 'donor',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'A+',
    age: 29,
    gender: 'Female',
    district: 'Chattogram',
    upazila: 'Panchlaish',
    city: 'Chattogram',
    address: 'GEC Circle, Nasirabad, Chattogram',
    isAvailable: true,
    lastDonationDate: '2026-08-20', // ~20 days ago -> cooldown
    medicalNotes: 'Physician at CMCH. Rh Positive regular donor.',
    totalDonations: 5,
    isVerified: true,
    createdAt: '2025-02-10T12:00:00Z',
  },
  {
    id: 'usr_donor_3',
    name: 'Mahfuzur Rahman',
    email: 'mahfuz@redlink.org',
    phone: '+880 1912-345678',
    role: 'donor',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'B+',
    age: 32,
    gender: 'Male',
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    city: 'Sylhet',
    address: 'Zindabazar, Sylhet 3100',
    isAvailable: true,
    lastDonationDate: '2026-04-12', // Eligible
    medicalNotes: 'Active youth volunteer with Red Crescent Sylhet.',
    totalDonations: 12,
    isVerified: true,
    createdAt: '2024-11-20T08:00:00Z',
  },
  {
    id: 'usr_donor_4',
    name: 'Farhan Chowdhury',
    email: 'farhan@redlink.org',
    phone: '+880 1622-445566',
    role: 'donor',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'O-',
    age: 30,
    gender: 'Male',
    district: 'Dhaka',
    upazila: 'Uttara',
    city: 'Dhaka',
    address: 'Sector 4, Uttara, Dhaka 1230',
    isAvailable: true,
    lastDonationDate: '2026-05-01', // Eligible Universal Donor
    medicalNotes: 'Universal Donor O Negative. Ready for emergency dispatches.',
    totalDonations: 15,
    isVerified: true,
    createdAt: '2024-08-14T09:30:00Z',
  },
  {
    id: 'usr_donor_5',
    name: 'Anika Tabassum',
    email: 'anika@redlink.org',
    phone: '+880 1552-998877',
    role: 'donor',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'AB+',
    age: 24,
    gender: 'Female',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    city: 'Dhaka',
    address: 'Road 8/A, Dhanmondi, Dhaka',
    isAvailable: true,
    lastDonationDate: '2026-04-25',
    medicalNotes: 'University student, plasma and whole blood donor.',
    totalDonations: 3,
    isVerified: true,
    createdAt: '2025-03-01T15:00:00Z',
  },
  {
    id: 'usr_donor_6',
    name: 'Rokonuzzaman Khan',
    email: 'rokon@redlink.org',
    phone: '+880 1715-112233',
    role: 'donor',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'B-',
    age: 26,
    gender: 'Male',
    district: 'Rajshahi',
    upazila: 'Boalia',
    city: 'Rajshahi',
    address: 'Shaheb Bazar, Rajshahi',
    isAvailable: false,
    lastDonationDate: '2026-08-15',
    medicalNotes: 'Currently recovering from mild seasonal cold.',
    totalDonations: 4,
    isVerified: false,
    createdAt: '2025-04-10T11:00:00Z',
  },
  {
    id: 'usr_requester_1',
    name: 'Nusrat Jahan',
    email: 'requester@redlink.org',
    phone: '+880 1718-998877',
    role: 'recipient',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'B+',
    age: 28,
    gender: 'Female',
    district: 'Dhaka',
    upazila: 'Mohammadpur',
    city: 'Dhaka',
    address: 'Salimullah Road, Mohammadpur, Dhaka',
    isAvailable: false,
    totalDonations: 0,
    isVerified: true,
    createdAt: '2025-05-18T10:00:00Z',
  },
  {
    id: 'usr_admin_1',
    name: 'RedLink Admin',
    email: 'admin@redlink.org',
    phone: '+880 1700-733546',
    role: 'admin',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'O+',
    age: 35,
    gender: 'Male',
    district: 'Dhaka',
    city: 'Dhaka',
    address: 'RedLink Operations HQ, Tejgaon, Dhaka',
    isAvailable: true,
    lastDonationDate: '2026-05-02',
    totalDonations: 18,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req_101',
    requesterId: 'usr_requester_1',
    requesterName: 'Nusrat Jahan',
    requesterPhone: '+880 1718-998877',
    patientName: 'Kamal Hossain (Father)',
    bloodGroup: 'O+',
    units: 2,
    hospitalName: 'Dhaka Medical College Hospital (DMCH)',
    hospitalAddress: 'Secretariat Road, Ramna, Dhaka 1000 (Surgery Ward 12)',
    district: 'Dhaka',
    city: 'Dhaka',
    neededBy: 'Today by 5:00 PM',
    urgency: 'critical',
    contactName: 'Nusrat Jahan (Daughter)',
    contactPhone: '+880 1718-998877',
    description: 'Emergency vascular surgery scheduled for acute intestinal bypass. 2 bags of fresh O+ blood needed urgently. Attendants are at the blood bank.',
    status: 'open',
    createdAt: '2026-09-09T06:30:00Z',
    responders: [
      {
        donorId: 'usr_donor_1',
        donorName: 'Tanvir Ahmed',
        donorBloodGroup: 'O+',
        phone: '+880 1711-234567',
        message: 'I can reach DMCH by 3:30 PM. Please confirm with the blood bank.',
        timestamp: '2026-09-09T07:15:00Z',
      },
    ],
  },
  {
    id: 'req_102',
    requesterId: 'usr_requester_1',
    requesterName: 'Monirul Islam',
    requesterPhone: '+880 1822-334455',
    patientName: 'Rasheda Begum',
    bloodGroup: 'A+',
    units: 1,
    hospitalName: 'Evercare Hospital Dhaka',
    hospitalAddress: 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229',
    district: 'Dhaka',
    city: 'Dhaka',
    neededBy: 'Tomorrow morning 10:00 AM',
    urgency: 'urgent',
    contactName: 'Monirul Islam (Son)',
    contactPhone: '+880 1822-334455',
    description: 'Thalassemia regular transfusion. Platelets and Hb level dropped below 7.0. Immediate donor required.',
    status: 'open',
    createdAt: '2026-09-08T18:20:00Z',
    responders: [],
  },
  {
    id: 'req_103',
    requesterId: 'usr_donor_2',
    requesterName: 'Dr. Sabrina Hasan',
    requesterPhone: '+880 1819-876543',
    patientName: 'Subir Das',
    bloodGroup: 'B+',
    units: 3,
    hospitalName: 'Chittagong Medical College Hospital',
    hospitalAddress: '57 K.B. Fazlul Kader Road, Panchlaish, Chattogram',
    district: 'Chattogram',
    city: 'Chattogram',
    neededBy: 'Urgent within 6 hours',
    urgency: 'critical',
    contactName: 'Dr. Sabrina (Attending Physician)',
    contactPhone: '+880 1819-876543',
    description: 'Multiple trauma patient from highway collision on Dhaka-Chittagong expressway. Massive blood loss, orthopaedic surgery ongoing.',
    status: 'open',
    createdAt: '2026-09-09T07:45:00Z',
    responders: [],
  },
  {
    id: 'req_104',
    requesterId: 'usr_donor_3',
    requesterName: 'Tareq Aziz',
    requesterPhone: '+880 1911-778899',
    patientName: 'Baby Rayan (3 months old)',
    bloodGroup: 'O-',
    units: 1,
    hospitalName: 'BSMMU (PG Hospital)',
    hospitalAddress: 'Shahbagh, Dhaka 1000 (Pediatric ICU)',
    district: 'Dhaka',
    city: 'Dhaka',
    neededBy: 'Today by 8:00 PM',
    urgency: 'critical',
    contactName: 'Tareq Aziz (Father)',
    contactPhone: '+880 1911-778899',
    description: 'Rare O- blood needed for neonatal heart corrective surgery. Universal donor urgently requested to assist this infant.',
    status: 'open',
    createdAt: '2026-09-09T05:15:00Z',
    responders: [],
  },
  {
    id: 'req_105',
    requesterId: 'usr_donor_1',
    requesterName: 'Farhana Yeasmin',
    requesterPhone: '+880 1733-665544',
    patientName: 'Tahmina Akter',
    bloodGroup: 'AB-',
    units: 2,
    hospitalName: 'Sylhet MAG Osmani Medical College',
    hospitalAddress: 'Medical College Road, Kajolshah, Sylhet 3100',
    district: 'Sylhet',
    city: 'Sylhet',
    neededBy: '12 September 2026',
    urgency: 'normal',
    contactName: 'Farhana Yeasmin (Sister)',
    contactPhone: '+880 1733-665544',
    description: 'Scheduled caesarean delivery (C-Section). High risk pregnancy requiring blood standby.',
    status: 'open',
    createdAt: '2026-09-07T14:00:00Z',
    responders: [],
  },
  {
    id: 'req_106',
    requesterId: 'usr_requester_1',
    requesterName: 'Nusrat Jahan',
    requesterPhone: '+880 1718-998877',
    patientName: 'Nurul Alam',
    bloodGroup: 'A-',
    units: 2,
    hospitalName: 'Square Hospital Dhaka',
    hospitalAddress: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Panthapath, Dhaka',
    district: 'Dhaka',
    city: 'Dhaka',
    neededBy: 'Completed',
    urgency: 'urgent',
    contactName: 'Nusrat Jahan',
    contactPhone: '+880 1718-998877',
    description: 'Bypass surgery blood requisition. Successfully donors donated.',
    status: 'fulfilled',
    createdAt: '2026-08-28T09:00:00Z',
    responders: [],
  },
];

const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don_1',
    donorId: 'usr_donor_1',
    donorName: 'Tanvir Ahmed',
    patientName: 'Nurul Alam',
    hospitalName: 'Square Hospital Dhaka',
    units: 1,
    donatedAt: '2026-05-10',
    notes: 'Voluntary donation for scheduled heart surgery patient.',
  },
  {
    id: 'don_2',
    donorId: 'usr_donor_1',
    donorName: 'Tanvir Ahmed',
    patientName: 'Fatima Zohra',
    hospitalName: 'National Heart Institute Dhaka',
    units: 1,
    donatedAt: '2026-01-20',
    notes: 'Emergency donation via RedLink alert.',
  },
  {
    id: 'don_3',
    donorId: 'usr_donor_4',
    donorName: 'Farhan Chowdhury',
    patientName: 'Siam Ahmed',
    hospitalName: 'Dhaka Shishu Hospital',
    units: 1,
    donatedAt: '2026-05-01',
    notes: 'O- Negative emergency response for pediatric surgery.',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_donor_1',
    title: 'Emergency Blood Request Match (O+)',
    message: 'Kamal Hossain urgently needs 2 units of O+ blood at Dhaka Medical College Hospital (DMCH).',
    type: 'urgent_match',
    read: false,
    linkRequestId: 'req_101',
    createdAt: '2026-09-09T06:35:00Z',
  },
  {
    id: 'notif_2',
    userId: 'usr_requester_1',
    title: 'Donor Responded to Request',
    message: 'Tanvir Ahmed (O+) offered to donate for Kamal Hossain at DMCH.',
    type: 'request_response',
    read: false,
    linkRequestId: 'req_101',
    createdAt: '2026-09-09T07:16:00Z',
  },
];

// LocalStorage Helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key}`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key}`, e);
  }
}

export const RedLinkStorage = {
  // Users
  getUsers(): User[] {
    const users = getStored<User[]>(USERS_KEY, INITIAL_USERS);
    if (!localStorage.getItem(USERS_KEY)) {
      setStored(USERS_KEY, INITIAL_USERS);
    }
    return users;
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    setStored(USERS_KEY, users);

    // If updating current user, sync session
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      setStored(CURRENT_USER_KEY, user);
    }
  },

  deleteUser(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    setStored(USERS_KEY, users);
  },

  // Auth / Current User
  getCurrentUser(): User | null {
    // Default to Donor Tanvir so preview works effortlessly with a pre-authenticated experience
    const user = getStored<User | null>(CURRENT_USER_KEY, INITIAL_USERS[0]);
    if (!localStorage.getItem(CURRENT_USER_KEY)) {
      setStored(CURRENT_USER_KEY, INITIAL_USERS[0]);
    }
    return user;
  },

  setCurrentUser(user: User | null): void {
    setStored(CURRENT_USER_KEY, user);
  },

  login(email: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'User with this email not found. Please register.' };
    }
    if (user.isBanned) {
      return { success: false, error: 'This account has been suspended by administration.' };
    }
    this.setCurrentUser(user);
    return { success: true, user };
  },

  signup(userData: Omit<User, 'id' | 'createdAt' | 'totalDonations'>): User {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalDonations: 0,
      isVerified: false,
    };
    const users = this.getUsers();
    users.unshift(newUser);
    setStored(USERS_KEY, users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout(): void {
    setStored(CURRENT_USER_KEY, null);
  },

  // Requests
  getRequests(): BloodRequest[] {
    const requests = getStored<BloodRequest[]>(REQUESTS_KEY, INITIAL_REQUESTS);
    if (!localStorage.getItem(REQUESTS_KEY)) {
      setStored(REQUESTS_KEY, INITIAL_REQUESTS);
    }
    return requests;
  },

  createRequest(requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'responders'>): BloodRequest {
    const newReq: BloodRequest = {
      ...requestData,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
      responders: [],
    };
    const requests = this.getRequests();
    requests.unshift(newReq);
    setStored(REQUESTS_KEY, requests);

    // Auto-alert matching donors: find donors with matching blood group in the same district
    const matchingDonors = this.getUsers().filter(
      (u) =>
        u.role === 'donor' &&
        u.isAvailable &&
        !u.isBanned &&
        u.bloodGroup === newReq.bloodGroup &&
        u.district.toLowerCase() === newReq.district.toLowerCase()
    );

    matchingDonors.forEach((donor) => {
      this.addNotification({
        userId: donor.id,
        title: `🚨 Urgent ${newReq.bloodGroup} Blood Needed in ${newReq.district}`,
        message: `${newReq.patientName} urgently needs ${newReq.units} bags of ${newReq.bloodGroup} at ${newReq.hospitalName}.`,
        type: 'urgent_match',
        linkRequestId: newReq.id,
      });
    });

    return newReq;
  },

  updateRequest(request: BloodRequest): void {
    const requests = this.getRequests();
    const index = requests.findIndex((r) => r.id === request.id);
    if (index >= 0) {
      requests[index] = request;
      setStored(REQUESTS_KEY, requests);
    }
  },

  deleteRequest(requestId: string): void {
    const requests = this.getRequests().filter((r) => r.id !== requestId);
    setStored(REQUESTS_KEY, requests);
  },

  respondToRequest(requestId: string, donor: User, message?: string): boolean {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return false;

    // Check if already responded
    const already = req.responders?.some((res) => res.donorId === donor.id);
    if (already) return false;

    const newResponder = {
      donorId: donor.id,
      donorName: donor.name,
      donorBloodGroup: donor.bloodGroup,
      phone: donor.phone,
      message: message || 'I am available to donate blood for this patient.',
      timestamp: new Date().toISOString(),
    };

    req.responders = [...(req.responders || []), newResponder];
    setStored(REQUESTS_KEY, requests);

    // Notify requester
    this.addNotification({
      userId: req.requesterId,
      title: 'Donor Responded to Blood Request',
      message: `${donor.name} (${donor.bloodGroup}) offered to donate for ${req.patientName}. Phone: ${donor.phone}`,
      type: 'request_response',
      linkRequestId: req.id,
    });

    return true;
  },

  // Donations History
  getDonations(): DonationRecord[] {
    const donations = getStored<DonationRecord[]>(DONATIONS_KEY, INITIAL_DONATIONS);
    if (!localStorage.getItem(DONATIONS_KEY)) {
      setStored(DONATIONS_KEY, INITIAL_DONATIONS);
    }
    return donations;
  },

  addDonation(record: Omit<DonationRecord, 'id'>): DonationRecord {
    const newRecord: DonationRecord = {
      ...record,
      id: `don_${Date.now()}`,
    };
    const donations = this.getDonations();
    donations.unshift(newRecord);
    setStored(DONATIONS_KEY, donations);

    // Update donor's last donation date and total donations count
    const user = this.getUserById(record.donorId);
    if (user) {
      user.lastDonationDate = record.donatedAt;
      user.totalDonations = (user.totalDonations || 0) + (record.units || 1);
      this.saveUser(user);
    }

    return newRecord;
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    const notifs = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
      setStored(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    }
    return notifs.filter((n) => n.userId === userId);
  },

  addNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void {
    const notifs = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      ...data,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    notifs.unshift(newNotif);
    setStored(NOTIFICATIONS_KEY, notifs);
  },

  markNotificationRead(id: string): void {
    const notifs = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.read = true;
      setStored(NOTIFICATIONS_KEY, notifs);
    }
  },

  markAllNotificationsRead(userId: string): void {
    const notifs = getStored<NotificationItem[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
    notifs.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    setStored(NOTIFICATIONS_KEY, notifs);
  },

  // Auto-suggest matching donors for request creation
  getMatchingDonors(bloodGroup: BloodGroup, district: string): User[] {
    const users = this.getUsers();
    return users.filter((u) => {
      if (u.role !== 'donor' || u.isBanned) return false;
      const bloodMatch = u.bloodGroup === bloodGroup;
      const districtMatch = !district || u.district.toLowerCase() === district.toLowerCase();
      return bloodMatch && districtMatch;
    });
  },
};
