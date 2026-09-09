import { User, BloodRequest, DonationRecord, NotificationItem, BloodGroup, UrgencyLevel, RequestStatus } from '../types';

const USERS_KEY = 'redlink_users_clean_v1';
const REQUESTS_KEY = 'redlink_requests_clean_v1';
const DONATIONS_KEY = 'redlink_donations_clean_v1';
const NOTIFICATIONS_KEY = 'redlink_notifications_clean_v1';
const CURRENT_USER_KEY = 'redlink_current_user_clean_v1';

// Cleanup legacy demo data from localStorage
try {
  ['redlink_users_v1', 'redlink_requests_v1', 'redlink_donations_v1', 'redlink_notifications_v1', 'redlink_current_user_v1'].forEach((k) => {
    localStorage.removeItem(k);
  });
} catch (_) {}

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

// Clean production database defaults with zero demo records
const INITIAL_USERS: User[] = [];
const INITIAL_REQUESTS: BloodRequest[] = [];
const INITIAL_DONATIONS: DonationRecord[] = [];
const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

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
    return getStored<User | null>(CURRENT_USER_KEY, null);
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
      const locationText = newReq.upazila ? `${newReq.upazila}, ${newReq.district}` : newReq.district;
      this.addNotification({
        userId: donor.id,
        title: `🚨 Urgent ${newReq.bloodGroup} Blood Needed in ${locationText}`,
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
  getMatchingDonors(bloodGroup: BloodGroup, district: string, upazila?: string): User[] {
    const users = this.getUsers();
    return users
      .filter((u) => {
        if (u.role !== 'donor' || u.isBanned) return false;
        const bloodMatch = u.bloodGroup === bloodGroup;
        const districtMatch = !district || u.district.toLowerCase() === district.toLowerCase();
        return bloodMatch && districtMatch;
      })
      .sort((a, b) => {
        if (upazila) {
          const aMatch = a.upazila && a.upazila.toLowerCase() === upazila.toLowerCase();
          const bMatch = b.upazila && b.upazila.toLowerCase() === upazila.toLowerCase();
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
        }
        return (b.totalDonations || 0) - (a.totalDonations || 0);
      });
  },
};
