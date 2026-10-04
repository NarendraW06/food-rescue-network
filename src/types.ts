export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin' | 'guest';

export type ActiveTabView = 
  | 'home'
  | 'map'
  | 'donate'
  | 'donor-dash'
  | 'ngo-dash'
  | 'volunteer-dash'
  | 'admin-dash'
  | 'directory'
  | 'impact'
  | 'awareness'
  | 'certificates'
  | 'profile';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  orgName?: string;
  avatar: string;
  donationCount: number;
  mealsSaved: number;
  status?: 'verified' | 'pending' | 'suspended';
}

export type FoodCategory = 
  | 'Cooked Meals' 
  | 'Bakery & Bread' 
  | 'Fresh Produce' 
  | 'Packaged Goods' 
  | 'Dairy & Beverages';

export type DonationStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'In Transit' 
  | 'Delivered' 
  | 'Expired';

export interface SafetyChecklist {
  hygienicPrep: boolean;
  properTemperature: boolean;
  safeTimeWindow: boolean;
  unservedSurplus: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorOrg: string;
  donorPhone: string;
  donorLocation: string;
  lat: number;
  lng: number;
  foodName: string;
  category: FoodCategory;
  quantityKg: number;
  servings: number;
  foodType: 'Veg' | 'Non-Veg';
  photoUrl: string;
  preparedAt: string; // ISO
  postedAt?: string; // ISO
  expiresAt: string; // ISO
  status: DonationStatus;
  acceptedByNgoId?: string;
  acceptedByNgoName?: string;
  acceptedAt?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  pickupOtp?: string;
  deliveryOtp?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  pickupPhotoUrl?: string;
  deliveryPhotoUrl?: string;
  pickupNotes?: string;
  dietaryTags?: string[];
  safetyChecklist?: SafetyChecklist;
  isUrgent?: boolean;
}

export interface NGOItem {
  id: string;
  name: string;
  category: 'NGO' | 'Orphanage' | 'Old Age Home' | 'Community Kitchen';
  location: string;
  lat: number;
  lng: number;
  capacity: number;
  mealsNeededPerDay: number;
  contactPhone: string;
  contactEmail: string;
  verified: boolean;
  image: string;
}

export interface VolunteerItem {
  id: string;
  name: string;
  phone: string;
  location: string;
  lat: number;
  lng: number;
  vehicle: 'Bike' | 'Scooter' | 'Van' | 'On Foot';
  rating: number;
  totalPickups: number;
  status: 'Available' | 'On Delivery' | 'Offline';
  avatar: string;
}

export interface FeedbackItem {
  id: string;
  donationId: string;
  donorName: string;
  ngoName: string;
  rating: number; // 1-5
  foodQualityRating: number;
  pickupRating: number;
  comment: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  donorId: string;
  donorName: string;
  milestoneCount: number;
  milestoneTitle: string;
  issuedAt: string;
  certificateCode: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  read: boolean;
  roleTarget?: UserRole | 'all';
  donationId?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  role: UserRole | 'system' | 'student';
  actorName: string;
  action: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  donationId?: string;
}

export interface FinancialDonation {
  id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string | null;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency?: string;
  message?: string;
  anonymous?: boolean;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: string;
  transactionId?: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
  purpose: string;
  receiptCode: string;
  receiptNumber?: string;
}


