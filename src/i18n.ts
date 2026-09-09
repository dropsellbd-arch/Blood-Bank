import { Language, BloodGroup, UrgencyLevel, RequestStatus } from './types';
export {
  BANGLADESH_LOCATIONS,
  BANGLADESH_DISTRICTS,
  getUpazilasForDistrict,
  formatLocation,
} from './data/bangladeshData';
export type { UpazilaItem, DistrictItem } from './data/bangladeshData';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const translations = {
  en: {
    // Navigation
    brandName: 'RedLink',
    tagline: 'Donate Blood, Save Lives',
    home: 'Home',
    findDonors: 'Find Donors',
    requests: 'Blood Requests',
    postRequest: 'Request Blood',
    dashboard: 'Dashboard',
    adminPanel: 'Admin Panel',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    becomeDonor: 'Become a Donor',
    emergencyHotline: '24/7 Hotline: 01700-REDLINK',
    mobileHome: 'Home',
    mobileDonors: 'Donors',
    mobilePost: 'Request',
    mobileRequests: 'Requests',
    mobileProfile: 'Profile',

    // Hero
    heroTitle: 'Every Drop Connects a Life in Need',
    heroSubtitle: 'Connect with voluntary blood donors across Bangladesh instantly. Verified donors, live urgent requests, and automated notifications when seconds count.',
    searchBloodGroupPlaceholder: 'Select Blood Group',
    searchDistrictPlaceholder: 'Select District/Location',
    searchBtn: 'Search Donors',
    totalDonors: 'Registered Donors',
    requestsFulfilled: 'Requests Fulfilled',
    activeRequests: 'Active Urgent Requests',
    citiesCovered: 'Districts Covered',

    // Urgent Requests
    urgentFeedTitle: 'Urgent Blood Requests',
    urgentFeedSubtitle: 'Patients waiting for blood right now. Your immediate response can save a life.',
    viewAllRequests: 'View All Requests',
    unitsNeeded: 'Bags/Units Needed',
    patient: 'Patient',
    hospital: 'Hospital',
    neededTime: 'Needed By',
    callNow: 'Call Contact',
    respondToRequest: 'I Can Donate',
    alreadyResponded: 'You Responded',
    urgencyNormal: 'Standard',
    urgencyUrgent: 'Urgent',
    urgencyCritical: 'Critical Emergency',

    // Request Status
    statusOpen: 'Active',
    statusFulfilled: 'Fulfilled',
    statusCancelled: 'Cancelled',

    // Donor search
    donorSearchTitle: 'Find Voluntary Donors',
    donorSearchSubtitle: 'Search verified donors ready to donate across all districts in Bangladesh.',
    allBloodGroups: 'All Blood Groups',
    allDistricts: 'All Districts',
    upazila: 'Upazila / Thana',
    allUpazilas: 'All Upazilas',
    selectUpazila: 'Select Upazila / Thana',
    selectDistrictFirst: 'Select district first',
    searchByUpazila: 'Search by Upazila',
    filterByUpazila: 'Filter by Upazila',
    availableOnly: 'Available Donors Only',
    eligibleOnly: 'Currently Eligible Only',
    resetFilters: 'Reset Filters',
    matchingDonorsFound: 'Matching Donors Found',
    contactDonor: 'Contact Donor',
    lastDonated: 'Last Donated',
    neverDonated: 'Not yet recorded',
    nextEligible: 'Next Eligible',
    eligibleNow: 'Eligible to Donate',
    eligibleInDays: 'Eligible in {days} days',
    donorVerified: 'Verified Donor',
    availableToDonate: 'Available',
    unavailable: 'Unavailable',
    totalDonationsCount: 'donations completed',

    // Request Form
    createRequestTitle: 'Post a Blood Request',
    createRequestSubtitle: 'Fill in patient details accurately. We will automatically alert matching donors nearby.',
    patientName: 'Patient Name',
    bloodGroupNeeded: 'Blood Group Needed',
    units: 'Units (Bags)',
    hospitalName: 'Hospital / Clinic Name',
    hospitalAddress: 'Hospital Full Address',
    district: 'District',
    cityOrArea: 'City / Upazila / Area',
    urgencyLevel: 'Urgency Level',
    requiredDateTime: 'Required Date & Time',
    contactPersonName: 'Contact Person Name',
    contactPhone: 'Contact Phone Number',
    reasonDescription: 'Medical Condition / Additional Info',
    submitRequestBtn: 'Publish Emergency Request',
    autoSuggestTitle: 'Matching Donors Nearby',
    autoSuggestDesc: 'We found donors in your area with this blood group. You can contact them directly or alert them.',

    // Donor Profile
    profileTitle: 'My Profile',
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    bloodGroup: 'Blood Group',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    address: 'Street Address',
    availabilityStatus: 'Donation Availability',
    availabilityHelper: 'Turn ON when you are physically fit and ready to donate.',
    lastDonationDateLabel: 'Last Donation Date',
    medicalNotes: 'Medical Conditions / Notes (Optional)',
    saveChanges: 'Save Changes',
    uploadPhoto: 'Upload Photo',
    removePhoto: 'Remove Photo',
    eligibilityCardTitle: 'Donation Eligibility',
    daysWaitNotice: 'Standard 90-day cooldown between whole blood donations ensures your body replenishes iron and blood cells safely.',

    // Dashboard
    donorDashboard: 'Donor Dashboard',
    requesterDashboard: 'Requester Dashboard',
    adminDashboard: 'Admin Control Center',
    myDonationHistory: 'Donation History',
    logDonationBtn: 'Log a Donation',
    myRespondedRequests: 'Requests I Responded To',
    myPostedRequests: 'My Blood Requests',
    noRequestsYet: 'No blood requests posted yet.',
    noResponsesYet: 'No responses recorded yet.',
    markFulfilled: 'Mark as Fulfilled',
    cancelRequest: 'Cancel Request',
    respondersCount: 'Responders',

    // Admin
    manageUsers: 'Manage Users',
    manageRequests: 'Manage Requests',
    userRole: 'Role',
    verifyDonor: 'Verify Donor',
    unverifyDonor: 'Remove Verification',
    banUser: 'Suspend User',
    unbanUser: 'Reactivate',
    deleteRequest: 'Delete (Spam)',

    // Auth
    loginTab: 'Sign In',
    signupTab: 'Register',
    forgotPassword: 'Forgot Password?',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    iWantTo: 'I want to register as:',
    roleDonor: 'Blood Donor (Can also request)',
    roleRecipient: 'Blood Requester / Recipient',
    sendResetLink: 'Send Password Reset Link',
    backToLogin: 'Back to Sign In',

    // Notifications
    notifications: 'Notifications',
    markAllAsRead: 'Mark all read',
    noNotifications: 'No new notifications',

    // Compatibility
    compatibilityTitle: 'Blood Compatibility Guide',
    compatibilityDesc: 'Knowing which blood types you can receive and donate to saves valuable time in emergencies.',
    canDonateTo: 'Can donate to',
    canReceiveFrom: 'Can receive from',
  },
  bn: {
    // Navigation
    brandName: 'রেডলিঙ্ক',
    tagline: 'রক্ত দিন, জীবন বাঁচান',
    home: 'হোম',
    findDonors: 'রক্তদাতা খুঁজুন',
    requests: 'রক্তের আবেদনসমূহ',
    postRequest: 'রক্তের আবেদন করুন',
    dashboard: 'ড্যাশবোর্ড',
    adminPanel: 'অ্যাডমিন প্যানেল',
    signIn: 'লগইন',
    signUp: 'রেজিস্ট্রেশন',
    signOut: 'লগআউট',
    becomeDonor: 'রক্তদাতা হোন',
    emergencyHotline: '২৪/৭ হটলাইন: ০১৭০০-REDLINK',
    mobileHome: 'হোম',
    mobileDonors: 'রক্তদাতা',
    mobilePost: 'আবেদন',
    mobileRequests: 'জরুরি ফিড',
    mobileProfile: 'প্রোফাইল',

    // Hero
    heroTitle: 'প্রতিটি রক্তবিন্দুতে বেঁচে থাকে একটি প্রাণ',
    heroSubtitle: 'বাংলাদেশজুড়ে রক্তদাতাদের সাথে তাৎক্ষণিক সংযোগ। যাচাইকৃত রক্তদাতা, লাইভ জরুরি আবেদন এবং সংকটের মুহূর্তে স্বয়ংক্রিয় নোটিফিকেশন।',
    searchBloodGroupPlaceholder: 'রক্তের গ্রুপ নির্বাচন করুন',
    searchDistrictPlaceholder: 'জেলা নির্বাচন করুন',
    searchBtn: 'রক্তদাতা খুঁজুন',
    totalDonors: 'নিবন্ধিত রক্তদাতা',
    requestsFulfilled: 'সফল রক্তদান',
    activeRequests: 'জরুরি আবেদন',
    citiesCovered: 'জেলায় সক্রিয়',

    // Urgent Requests
    urgentFeedTitle: 'জরুরি রক্তের আবেদন',
    urgentFeedSubtitle: 'এই মুহূর্তে রক্তের অপেক্ষায় থাকা রোগীরা। আপনার সামান্য সহানুভূতি বাঁচাতে পারে একটি অমূল্য জীবন।',
    viewAllRequests: 'সব আবেদন দেখুন',
    unitsNeeded: 'ব্যাগ রক্ত প্রয়োজন',
    patient: 'রোগী',
    hospital: 'হাসপাতাল',
    neededTime: 'প্রয়োজনের সময়',
    callNow: 'ফোন করুন',
    respondToRequest: 'আমি রক্ত দিতে প্রস্তুত',
    alreadyResponded: 'সাড়া দিয়েছেন',
    urgencyNormal: 'সাধারণ',
    urgencyUrgent: 'জরুরি',
    urgencyCritical: 'অতি জরুরি (ক্রিটিকাল)',

    // Request Status
    statusOpen: 'চলমান',
    statusFulfilled: 'রক্তদান সম্পন্ন',
    statusCancelled: 'বাতিলকৃত',

    // Donor search
    donorSearchTitle: 'স্বেচ্ছাসেবী রক্তদাতা খুঁজুন',
    donorSearchSubtitle: 'বাংলাদেশের যেকোনো জেলায় রক্তদানে প্রস্তুত যাচাইকৃত রক্তদাতাদের তালিকা।',
    allBloodGroups: 'সব রক্তের গ্রুপ',
    allDistricts: 'সব জেলা',
    upazila: 'উপজেলা / থানা',
    allUpazilas: 'সকল উপজেলা',
    selectUpazila: 'উপজেলা নির্বাচন করুন',
    selectDistrictFirst: 'আগে জেলা নির্বাচন করুন',
    searchByUpazila: 'উপজেলা অনুযায়ী খুঁজুন',
    filterByUpazila: 'উপজেলা দিয়ে ফিল্টার করুন',
    availableOnly: 'শুধুমাত্র প্রস্তুত রক্তদাতা',
    eligibleOnly: 'রক্তদানের যোগ্য রক্তদাতা',
    resetFilters: 'ফিল্টার রিসেট',
    matchingDonorsFound: 'জন রক্তদাতা পাওয়া গেছে',
    contactDonor: 'যোগাযোগ করুন',
    lastDonated: 'সর্বশেষ রক্তদান',
    neverDonated: 'এখনো তথ্য নেই',
    nextEligible: 'পরবর্তী রক্তদানের তারিখ',
    eligibleNow: 'রক্তদানের জন্য যোগ্য',
    eligibleInDays: '{days} দিন পর রক্ত দিতে পারবেন',
    donorVerified: 'যাচাইকৃত রক্তদাতা',
    availableToDonate: 'প্রস্তুত আছেন',
    unavailable: 'বর্তমানে অপ্রস্তুত',
    totalDonationsCount: 'বার রক্তদান করেছেন',

    // Request Form
    createRequestTitle: 'রক্তের জরুরি আবেদন করুন',
    createRequestSubtitle: 'রোগীর সঠিক তথ্য পূরণ করুন। আপনার এলাকার একই গ্রুপের রক্তদাতাদের কাছে তৎক্ষণাৎ বার্তা পৌঁছাবে।',
    patientName: 'রোগীর নাম',
    bloodGroupNeeded: 'প্রয়োজনীয় রক্তের গ্রুপ',
    units: 'রক্তের পরিমাণ (ব্যাগ)',
    hospitalName: 'হাসপাতাল / ক্লিনিকের নাম',
    hospitalAddress: 'হাসপাতালের পূর্ণ ঠিকানা',
    district: 'জেলা',
    cityOrArea: 'উপজেলা / এলাকা',
    urgencyLevel: 'জরুরিতা',
    requiredDateTime: 'কখন রক্ত প্রয়োজন',
    contactPersonName: 'যোগাযোগকারীর নাম',
    contactPhone: 'যোগাযোগের মোবাইল নম্বর',
    reasonDescription: 'রোগীর সমস্যা বা সংক্ষিপ্ত বিবরণ',
    submitRequestBtn: 'জরুরি আবেদন প্রকাশ করুন',
    autoSuggestTitle: 'নিকটবর্তী সম্ভাব্য রক্তদাতাগণ',
    autoSuggestDesc: 'আপনার নির্বাচিত জেলায় একই রক্তের গ্রুপের রক্তদাতাদের সরাসরি কল বা আমন্ত্রণ জানাতে পারেন।',

    // Donor Profile
    profileTitle: 'আমার প্রোফাইল',
    editProfile: 'প্রোফাইল সম্পাদনা',
    fullName: 'পূর্ণ নাম',
    email: 'ইমেইল অ্যাড্রেস',
    phone: 'মোবাইল নম্বর',
    bloodGroup: 'রক্তের গ্রুপ',
    age: 'বয়স',
    gender: 'লিঙ্গ',
    male: 'পুরুষ',
    female: 'নারী',
    other: 'অন্যান্য',
    address: 'বর্তমান ঠিকানা',
    availabilityStatus: 'রক্তদানে প্রস্তুত কি না',
    availabilityHelper: 'আপনি সুস্থ এবং রক্তদানে ইচ্ছুক থাকলে অপশনটি অন রাখুন।',
    lastDonationDateLabel: 'সর্বশেষ রক্তদানের তারিখ',
    medicalNotes: 'শারীরিক বা স্বাস্থ্যগত তথ্য (ঐচ্ছিক)',
    saveChanges: 'সংরক্ষণ করুন',
    uploadPhoto: 'ছবি আপলোড করুন',
    removePhoto: 'ছবি সরান',
    eligibilityCardTitle: 'রক্তদানের যোগ্যতা ও বিরতি',
    daysWaitNotice: 'প্রতিটি পূর্ণ রক্তদানের মাঝে ন্যূনতম ৯০ দিনের ব্যবধান আপনার শরীরের হিমোগ্লোবিন ও রক্তকণিকা সুরক্ষায় জরুরি।',

    // Dashboard
    donorDashboard: 'রক্তদাতার ড্যাশবোর্ড',
    requesterDashboard: 'আবেদনকারীর ড্যাশবোর্ড',
    adminDashboard: 'অ্যাডমিন কন্ট্রোল সেন্টার',
    myDonationHistory: 'আমার রক্তদানের ইতিহাস',
    logDonationBtn: 'নতুন রক্তদান যুক্ত করুন',
    myRespondedRequests: 'যেসব আবেদনে সাড়া দিয়েছি',
    myPostedRequests: 'আমার পোস্ট করা আবেদনসমূহ',
    noRequestsYet: 'এখনো কোনো রক্তের আবেদন করেননি।',
    noResponsesYet: 'এখনো কেউ সাড়া দেয়নি।',
    markFulfilled: 'সম্পন্ন চিহ্নিত করুন',
    cancelRequest: 'আবেদন বাতিল করুন',
    respondersCount: 'সাড়াদানকারী',

    // Admin
    manageUsers: 'ব্যবহারকারী ব্যবস্থাপনা',
    manageRequests: 'রক্তের আবেদন ব্যবস্থাপনা',
    userRole: 'ভূমিকা',
    verifyDonor: 'রক্তদাতা যাচাই করুন',
    unverifyDonor: 'যাচাই বাতিল',
    banUser: 'স্থগিত করুন',
    unbanUser: 'পুনরায় চালু করুন',
    deleteRequest: 'মুছে ফেলুন (স্প্যাম)',

    // Auth
    loginTab: 'লগইন',
    signupTab: 'নিবন্ধন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    iWantTo: 'আমি নিবন্ধন করতে চাই:',
    roleDonor: 'রক্তদাতা হিসেবে (প্রয়োজনে আবেদনও করতে পারবেন)',
    roleRecipient: 'রক্তের আবেদনকারী হিসেবে',
    sendResetLink: 'পাসওয়ার্ড রিসেট লিংক পাঠান',
    backToLogin: 'লগইনে ফিরে যান',

    // Notifications
    notifications: 'বিজ্ঞপ্তিসমূহ',
    markAllAsRead: 'সব পড়া হয়েছে',
    noNotifications: 'কোনো নতুন বিজ্ঞপ্তি নেই',

    // Compatibility
    compatibilityTitle: 'রক্তের সামঞ্জস্য তালিকা',
    compatibilityDesc: 'কোন গ্রুপের রক্ত কাকে দেওয়া যায় এবং কার থেকে নেওয়া যায় তা জেনে রাখা জরুরি।',
    canDonateTo: 'রক্ত দিতে পারবে',
    canReceiveFrom: 'রক্ত গ্রহণ করতে পারবে',
  },
};

export function t(key: keyof typeof translations.en, lang: Language, params?: Record<string, string | number>): string {
  let str = translations[lang]?.[key] || translations.en[key] || (key as string);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return str;
}

export const BLOOD_COMPATIBILITY: Record<BloodGroup, { donateTo: BloodGroup[]; receiveFrom: BloodGroup[] }> = {
  'A+': {
    donateTo: ['A+', 'AB+'],
    receiveFrom: ['A+', 'A-', 'O+', 'O-'],
  },
  'A-': {
    donateTo: ['A+', 'A-', 'AB+', 'AB-'],
    receiveFrom: ['A-', 'O-'],
  },
  'B+': {
    donateTo: ['B+', 'AB+'],
    receiveFrom: ['B+', 'B-', 'O+', 'O-'],
  },
  'B-': {
    donateTo: ['B+', 'B-', 'AB+', 'AB-'],
    receiveFrom: ['B-', 'O-'],
  },
  'AB+': {
    donateTo: ['AB+'],
    receiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  },
  'AB-': {
    donateTo: ['AB+', 'AB-'],
    receiveFrom: ['AB-', 'A-', 'B-', 'O-'],
  },
  'O+': {
    donateTo: ['O+', 'A+', 'B+', 'AB+'],
    receiveFrom: ['O+', 'O-'],
  },
  'O-': {
    donateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Donor
    receiveFrom: ['O-'],
  },
};
