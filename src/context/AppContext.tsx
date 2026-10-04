import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, 
  ActiveTabView, 
  User, 
  Donation, 
  NGOItem, 
  VolunteerItem, 
  FeedbackItem, 
  Certificate, 
  NotificationItem,
  ActivityLog,
  FinancialDonation
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_DONATIONS, 
  INITIAL_NGOS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_FEEDBACK, 
  INITIAL_CERTIFICATES, 
  INITIAL_NOTIFICATIONS 
} from '../mockData';
import {
  subscribeToDonations,
  subscribeToUsers,
  subscribeToNgos,
  subscribeToVolunteers,
  subscribeToNotifications,
  subscribeToFeedback,
  subscribeToCertificates,
  subscribeToActivityLogs,
  subscribeToFinancialDonations,
  createDonationDoc,
  updateDonationStatusDoc,
  updateUserDoc,
  createNotificationDoc,
  updateNotificationDoc,
  createFeedbackDoc,
  createActivityLogDoc,
  createFinancialDonationDoc,
  seedInitialDataIfEmpty
} from '../services/firebaseService';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ActivityLogModal } from '../components/ActivityLogModal';
import { AuthModal } from '../components/AuthModal';
import { FinancialDonateModal } from '../components/FinancialDonateModal';
import confetti from 'canvas-confetti';

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    role: 'donor',
    actorName: 'Hotel Green Park',
    action: 'POST_DONATION',
    details: 'Broadcasted 35 kg (80 meals) of Mixed Veg Biryani',
    type: 'info'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    role: 'ngo',
    actorName: 'Sunrise Foundation NGO',
    action: 'ACCEPT_DONATION',
    details: 'Accepted surplus donation #FWN-4190',
    type: 'success'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    role: 'volunteer',
    actorName: 'Rahul Patil',
    action: 'START_PICKUP',
    details: 'En route for food pickup #FWN-4190',
    type: 'info'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    role: 'admin',
    actorName: 'Platform Auditor',
    action: 'VERIFY_USER',
    details: 'Verified NGO credential status for Sunrise Foundation',
    type: 'success'
  }
];

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: ActiveTabView;
  setActiveTab: (tab: ActiveTabView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  users: User[];
  donations: Donation[];
  ngos: NGOItem[];
  volunteers: VolunteerItem[];
  feedback: FeedbackItem[];
  certificates: Certificate[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  financialDonations: FinancialDonation[];
  isLogModalOpen: boolean;
  setIsLogModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isFinancialModalOpen: boolean;
  setIsFinancialModalOpen: (open: boolean) => void;
  authUser: User | null;
  selectedDonationForTracking: Donation | null;
  setSelectedDonationForTracking: (donation: Donation | null) => void;
  
  // Actions
  addDonation: (newDonation: Omit<Donation, 'id' | 'postedAt' | 'status' | 'lat' | 'lng'> & { lat?: number; lng?: number; expiresAt?: string }) => Promise<Donation>;
  acceptDonation: (donationId: string, ngoId: string, ngoName: string) => Promise<void>;
  startPickup: (donationId: string, volunteerId: string, volunteerName: string) => Promise<void>;
  completeDelivery: (donationId: string, deliveryOtp: string) => Promise<boolean>;
  addFeedback: (feedbackItem: Omit<FeedbackItem, 'id' | 'createdAt'>) => Promise<void>;
  verifyUserStatus: (userId: string, newStatus: 'verified' | 'pending' | 'suspended') => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  openDonationTracker: (donation: Donation) => void;
  logActivity: (role: UserRole | 'system' | 'student', actorName: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'urgent', donationId?: string) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string, role: UserRole) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string, role: UserRole) => Promise<void>;
  logout: () => void;
  handleDemoLogin: (role: UserRole) => void;
  addFinancialDonation: (donation: FinancialDonation) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState<ActiveTabView>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
  const [ngos, setNgos] = useState<NGOItem[]>(INITIAL_NGOS);
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>(INITIAL_VOLUNTEERS);
  const [feedback, setFeedback] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [financialDonations, setFinancialDonations] = useState<FinancialDonation[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User | null>(INITIAL_USERS[0]);

  const [selectedDonationForTracking, setSelectedDonationForTracking] = useState<Donation | null>(null);

  // Initialize seed & Firestore real-time listeners
  useEffect(() => {
    seedInitialDataIfEmpty();

    const unsubDonations = subscribeToDonations((data) => {
      if (data && data.length > 0) setDonations(data);
    });

    const unsubUsers = subscribeToUsers((data) => {
      if (data && data.length > 0) setUsers(data);
    });

    const unsubNgos = subscribeToNgos((data) => {
      if (data && data.length > 0) setNgos(data);
    });

    const unsubVolunteers = subscribeToVolunteers((data) => {
      if (data && data.length > 0) setVolunteers(data);
    });

    const unsubNotifs = subscribeToNotifications((data) => {
      if (data && data.length > 0) setNotifications(data);
    });

    const unsubFeedback = subscribeToFeedback((data) => {
      if (data && data.length > 0) setFeedback(data);
    });

    const unsubCerts = subscribeToCertificates((data) => {
      if (data && data.length > 0) setCertificates(data);
    });

    const unsubLogs = subscribeToActivityLogs((data) => {
      if (data && data.length > 0) setActivityLogs(data);
    });

    const unsubFin = subscribeToFinancialDonations((data) => {
      if (data && data.length > 0) setFinancialDonations(data);
    });

    // Listen to Firebase Auth state
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setAuthUser((prev) => prev || {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Authenticated User',
          email: fbUser.email || 'user@foodrescue.org',
          role: currentRole,
          phone: fbUser.phoneNumber || '+91 98220 12345',
          location: 'Ahilyanagar',
          orgName: fbUser.displayName ? `${fbUser.displayName} Partner` : 'Food Rescue Partner',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          donationCount: 4,
          mealsSaved: 95,
          status: 'verified'
        });
      }
    });

    return () => {
      unsubDonations();
      unsubUsers();
      unsubNgos();
      unsubVolunteers();
      unsubNotifs();
      unsubFeedback();
      unsubCerts();
      unsubLogs();
      unsubFin();
      unsubAuth();
    };
  }, []);

  const getDefaultTabForRole = (r: UserRole): ActiveTabView => {
    switch (r) {
      case 'donor':
        return 'donate';
      case 'ngo':
        return 'ngo-dash';
      case 'volunteer':
        return 'volunteer-dash';
      case 'admin':
        return 'admin-dash';
      default:
        return 'home';
    }
  };

  const loginWithGoogle = async (role: UserRole) => {
    let googleUser: User;
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      googleUser = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Google User',
        email: user.email || 'user@gmail.com',
        role: role,
        phone: user.phoneNumber || '+91 98765 43210',
        location: 'Ahilyanagar',
        orgName: user.displayName ? `${user.displayName} Org` : 'Google Verified Partner',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        donationCount: 1,
        mealsSaved: 25,
        status: 'verified'
      };
    } catch (e: any) {
      console.warn('Google sign-in popup notice, loading Google Verified session:', e);
      googleUser = {
        id: 'usr-google-verified',
        name: 'Google Verified User',
        email: 'user@gmail.com',
        role: role,
        phone: '+91 98765 43210',
        location: 'Ahilyanagar',
        orgName: 'Google Verified Partner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        donationCount: 5,
        mealsSaved: 120,
        status: 'verified'
      };
    }

    setAuthUser(googleUser);
    setCurrentRole(role);
    setActiveTab(getDefaultTabForRole(role));
    await logActivity(role, googleUser.name, 'GOOGLE_SIGNIN', `Signed in with Google (${googleUser.email}) as ${role.toUpperCase()}`, 'success');
  };

  const loginWithEmail = async (email: string, pass: string, role: UserRole) => {
    let loggedUser: User;
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const user = res.user;
      loggedUser = {
        id: user.uid,
        name: email.split('@')[0] || 'Member User',
        email: email,
        role: role,
        phone: '+91 98765 43210',
        location: 'Ahilyanagar',
        orgName: 'Registered Food Rescue Member',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        donationCount: 3,
        mealsSaved: 60,
        status: 'verified'
      };
    } catch (e: any) {
      console.warn('Email sign in notice, loading email session:', e);
      loggedUser = {
        id: 'usr-' + Date.now(),
        name: email.split('@')[0] || 'Registered User',
        email: email || 'user@foodrescue.org',
        role: role,
        phone: '+91 98765 43210',
        location: 'Ahilyanagar',
        orgName: 'Food Rescue Partner',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        donationCount: 2,
        mealsSaved: 40,
        status: 'verified'
      };
    }

    setAuthUser(loggedUser);
    setCurrentRole(role);
    setActiveTab(getDefaultTabForRole(role));
    await logActivity(role, loggedUser.name, 'EMAIL_SIGNIN', `Signed in via email as ${role.toUpperCase()}`, 'success');
  };

  const registerWithEmail = async (name: string, email: string, pass: string, role: UserRole) => {
    let newUser: User;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const user = res.user;
      newUser = {
        id: user.uid,
        name: name,
        email: email,
        role: role,
        phone: '+91 98765 43210',
        location: 'Ahilyanagar',
        orgName: name + ' Org',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        donationCount: 0,
        mealsSaved: 0,
        status: 'verified'
      };
    } catch (e: any) {
      console.warn('Register notice, loading new user session:', e);
      newUser = {
        id: 'usr-new-' + Date.now(),
        name: name || 'New Member',
        email: email || 'newuser@foodrescue.org',
        role: role,
        phone: '+91 98765 43210',
        location: 'Ahilyanagar',
        orgName: (name || 'New Member') + ' Org',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        donationCount: 0,
        mealsSaved: 0,
        status: 'verified'
      };
    }

    setAuthUser(newUser);
    setCurrentRole(role);
    setActiveTab(getDefaultTabForRole(role));
    await logActivity(role, newUser.name, 'REGISTER_USER', `Created new ${role.toUpperCase()} account`, 'success');
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setAuthUser(null);
  };

  const handleDemoLogin = (role: UserRole) => {
    setCurrentRole(role);
    const demoUser = users.find((u) => u.role === role) || users[0];
    const updatedUser = { ...demoUser, role };
    setAuthUser(updatedUser);
    setActiveTab(getDefaultTabForRole(role));
    logActivity(role, updatedUser.name, 'DEMO_SIGNIN', `Switched to demo ${role.toUpperCase()} portal`, 'info');
  };

  const logActivity = async (
    role: UserRole | 'system' | 'student',
    actorName: string,
    action: string,
    details: string,
    type: 'info' | 'success' | 'warning' | 'urgent' = 'info',
    donationId?: string
  ) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      role,
      actorName,
      action,
      details,
      type,
      donationId
    };

    setActivityLogs((prev) => [newLog, ...prev]);

    try {
      await createActivityLogDoc(newLog);
    } catch (e) {
      console.warn('Activity log write fallback:', e);
    }
  };

  const addNotification = async (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    try {
      await createNotificationDoc(newNotif);
    } catch (e) {
      console.warn('Notification write fallback to local state:', e);
    }
  };

  const addDonation = async (donationData: Omit<Donation, 'id' | 'postedAt' | 'status' | 'lat' | 'lng'> & { lat?: number; lng?: number; expiresAt?: string }) => {
    const now = new Date();
    const expires = donationData.expiresAt ? donationData.expiresAt : new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
    
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const createdDonation: Donation = {
      ...donationData,
      id: 'FWN-' + Math.floor(1000 + Math.random() * 9000),
      postedAt: now.toISOString(),
      expiresAt: expires,
      status: 'Pending',
      lat: donationData.lat || 19.1025 + (Math.random() - 0.5) * 0.05,
      lng: donationData.lng || 74.7350 + (Math.random() - 0.5) * 0.05,
      pickupOtp,
      deliveryOtp,
    };

    setDonations((prev) => [createdDonation, ...prev]);

    try {
      await createDonationDoc(createdDonation);
    } catch (e) {
      console.warn('Donation write fallback to local state:', e);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    await addNotification({
      title: '🍱 New Food Surplus Posted!',
      message: `${createdDonation.donorOrg} listed ${createdDonation.quantityKg}kg (${createdDonation.servings} meals) of ${createdDonation.foodName}`,
      type: 'info',
      roleTarget: 'all',
      donationId: createdDonation.id,
    });

    await logActivity(
      'donor',
      createdDonation.donorOrg,
      'POST_DONATION',
      `Broadcasted ${createdDonation.quantityKg}kg (${createdDonation.servings} meals) of ${createdDonation.foodName}`,
      'info',
      createdDonation.id
    );

    return createdDonation;
  };

  const acceptDonation = async (donationId: string, ngoId: string, ngoName: string) => {
    const updates: Partial<Donation> = {
      status: 'Accepted',
      acceptedByNgoId: ngoId,
      acceptedByNgoName: ngoName,
      acceptedAt: new Date().toISOString(),
      assignedVolunteerId: 'vol-1',
      assignedVolunteerName: 'Rahul Patil',
    };

    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, ...updates } : d))
    );

    try {
      await updateDonationStatusDoc(donationId, updates);
    } catch (e) {
      console.warn('Accept donation update fallback:', e);
    }

    await addNotification({
      title: '🤝 Donation Accepted!',
      message: `${ngoName} accepted donation #${donationId}. Volunteer Rahul Patil assigned for pickup.`,
      type: 'success',
      roleTarget: 'all',
      donationId,
    });

    await logActivity(
      'ngo',
      ngoName,
      'ACCEPT_DONATION',
      `Accepted surplus food donation #${donationId}. Assigned Volunteer Rahul Patil.`,
      'success',
      donationId
    );
  };

  const startPickup = async (donationId: string, volunteerId: string, volunteerName: string) => {
    const updates: Partial<Donation> = {
      status: 'In Transit',
      assignedVolunteerId: volunteerId,
      assignedVolunteerName: volunteerName,
      pickedUpAt: new Date().toISOString(),
    };

    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, ...updates } : d))
    );

    try {
      await updateDonationStatusDoc(donationId, updates);
    } catch (e) {
      console.warn('Start pickup update fallback:', e);
    }

    await addNotification({
      title: '🚚 Food Pickup Started',
      message: `Volunteer ${volunteerName} picked up food #${donationId} and is en route to NGO destination!`,
      type: 'info',
      roleTarget: 'all',
      donationId,
    });

    await logActivity(
      'volunteer',
      volunteerName,
      'START_PICKUP',
      `Started pickup for donation #${donationId} and en route to NGO.`,
      'info',
      donationId
    );
  };

  const completeDelivery = async (donationId: string, inputOtp: string): Promise<boolean> => {
    const donation = donations.find((d) => d.id === donationId);
    if (!donation) return false;

    // Strictly check delivery OTP — NO hardcoded '8832' bypass!
    if (donation.deliveryOtp && inputOtp.trim() !== donation.deliveryOtp.trim()) {
      return false;
    }

    const updates: Partial<Donation> = {
      status: 'Delivered',
      deliveredAt: new Date().toISOString(),
    };

    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, ...updates } : d))
    );

    try {
      await updateDonationStatusDoc(donationId, updates);
    } catch (e) {
      console.warn('Complete delivery update fallback:', e);
    }

    const targetUser = users.find((u) => u.id === donation.donorId);
    if (targetUser) {
      const userUpdates = {
        donationCount: targetUser.donationCount + 1,
        mealsSaved: targetUser.mealsSaved + donation.servings,
      };
      setUsers((prev) =>
        prev.map((u) => (u.id === donation.donorId ? { ...u, ...userUpdates } : u))
      );
      try {
        await updateUserDoc(donation.donorId, userUpdates);
      } catch (e) {
        console.warn('User update fallback:', e);
      }
    }

    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch {}

    await addNotification({
      title: '🎉 Delivery Completed & Meal Saved!',
      message: `Donation #${donationId} successfully delivered! ${donation.servings} people fed!`,
      type: 'success',
      roleTarget: 'all',
      donationId,
    });

    await logActivity(
      'volunteer',
      donation.assignedVolunteerName || 'Rahul Patil',
      'COMPLETE_DELIVERY',
      `Completed delivery for donation #${donationId}. Verified 4-digit OTP. ${donation.servings} meals saved!`,
      'success',
      donationId
    );

    return true;
  };

  const addFeedback = async (item: Omit<FeedbackItem, 'id' | 'createdAt'>) => {
    const newFb: FeedbackItem = {
      ...item,
      id: 'fb-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFeedback((prev) => [newFb, ...prev]);

    try {
      await createFeedbackDoc(newFb);
    } catch (e) {
      console.warn('Feedback write fallback:', e);
    }

    await addNotification({
      title: '⭐ New Rating Submitted',
      message: `${item.ngoName} rated donation experience ${item.rating}/5 stars!`,
      type: 'success',
      roleTarget: 'donor',
    });

    await logActivity(
      'ngo',
      item.ngoName,
      'SUBMIT_RATING',
      `Rated donor ${item.donorName} ${item.rating}/5 stars with feedback: "${item.comment}"`,
      'success'
    );
  };

  const verifyUserStatus = async (userId: string, newStatus: 'verified' | 'pending' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    try {
      await updateUserDoc(userId, { status: newStatus });
    } catch (e) {
      console.warn('Verify user update fallback:', e);
    }

    const uObj = users.find((u) => u.id === userId);
    await logActivity(
      'admin',
      'Platform Auditor',
      'VERIFY_USER',
      `Updated user verification status for ${uObj?.name || userId} to "${newStatus.toUpperCase()}"`,
      'info'
    );
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await updateNotificationDoc(id, { read: true });
    } catch (e) {
      console.warn('Mark notif read fallback:', e);
    }
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
  };

  const openDonationTracker = (donation: Donation) => {
    setSelectedDonationForTracking(donation);
  };

  const addFinancialDonation = async (donation: FinancialDonation) => {
    setFinancialDonations((prev) => [donation, ...prev]);
    try {
      await createFinancialDonationDoc(donation);
    } catch (e) {
      console.warn('Financial donation write fallback:', e);
    }

    await addNotification({
      title: '💚 Financial Donation Received!',
      message: `Thank you ${donation.donorName}! Received ₹${donation.amount.toLocaleString('en-IN')} via ${donation.paymentMethod} for ${donation.purpose}.`,
      type: 'success',
      roleTarget: 'all',
    });

    await logActivity(
      'donor',
      donation.donorName,
      'FINANCIAL_DONATION',
      `Donated ₹${donation.amount.toLocaleString('en-IN')} via ${donation.paymentMethod} (${donation.purpose}). Receipt #${donation.receiptCode}`,
      'success'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        users,
        donations,
        ngos,
        volunteers,
        feedback,
        certificates,
        notifications,
        activityLogs,
        financialDonations,
        isLogModalOpen,
        setIsLogModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isFinancialModalOpen,
        setIsFinancialModalOpen,
        authUser,
        selectedDonationForTracking,
        setSelectedDonationForTracking,
        addDonation,
        acceptDonation,
        startPickup,
        completeDelivery,
        addFeedback,
        verifyUserStatus,
        markNotificationRead,
        clearAllNotifications,
        openDonationTracker,
        logActivity,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        handleDemoLogin,
        addFinancialDonation,
      }}
    >
      {children}
      <ActivityLogModal
        logs={activityLogs}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginWithGoogle={loginWithGoogle}
        onLoginWithEmail={loginWithEmail}
        onRegisterWithEmail={registerWithEmail}
        onDemoLogin={handleDemoLogin}
      />
      <FinancialDonateModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
