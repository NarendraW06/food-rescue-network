import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import type { 
  Donation, 
  User, 
  NGOItem, 
  VolunteerItem, 
  NotificationItem, 
  FeedbackItem, 
  Certificate,
  ActivityLog,
  FinancialDonation
} from '../types';

// Subscriptions
export const subscribeToFinancialDonations = (callback: (donations: FinancialDonation[]) => void): Unsubscribe => {
  const colRef = collection(db, 'financial_donations');
  return onSnapshot(colRef, (snapshot) => {
    const list: FinancialDonation[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as FinancialDonation);
    });
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  }, (err) => {
    console.warn("Firestore financial_donations subscription error:", err);
  });
};

export const createFinancialDonationDoc = async (donation: FinancialDonation): Promise<void> => {
  await setDoc(doc(db, 'financial_donations', donation.id), donation);
};

export const subscribeToActivityLogs = (callback: (logs: ActivityLog[]) => void): Unsubscribe => {
  const colRef = collection(db, 'activity_logs');
  return onSnapshot(colRef, (snapshot) => {
    const list: ActivityLog[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as ActivityLog);
    });
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  }, (err) => {
    console.warn("Firestore activity_logs subscription error:", err);
  });
};

export const createActivityLogDoc = async (log: ActivityLog): Promise<void> => {
  await setDoc(doc(db, 'activity_logs', log.id), log);
};
import { 
  INITIAL_DONATIONS, 
  INITIAL_USERS, 
  INITIAL_NGOS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_FEEDBACK, 
  INITIAL_CERTIFICATES 
} from '../mockData';

// Subscriptions
export const subscribeToDonations = (callback: (donations: Donation[]) => void): Unsubscribe => {
  const colRef = collection(db, 'donations');
  return onSnapshot(colRef, (snapshot) => {
    const list: Donation[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Donation);
    });
    // Sort by postedAt descending
    list.sort((a, b) => new Date(b.postedAt || b.expiresAt).getTime() - new Date(a.postedAt || a.expiresAt).getTime());
    callback(list);
  }, (err) => {
    console.warn("Firestore donations subscription error:", err);
  });
};

export const subscribeToUsers = (callback: (users: User[]) => void): Unsubscribe => {
  const colRef = collection(db, 'users');
  return onSnapshot(colRef, (snapshot) => {
    const list: User[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as User);
    });
    callback(list);
  }, (err) => {
    console.warn("Firestore users subscription error:", err);
  });
};

export const subscribeToNgos = (callback: (ngos: NGOItem[]) => void): Unsubscribe => {
  const colRef = collection(db, 'ngos');
  return onSnapshot(colRef, (snapshot) => {
    const list: NGOItem[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as NGOItem);
    });
    callback(list);
  }, (err) => {
    console.warn("Firestore ngos subscription error:", err);
  });
};

export const subscribeToVolunteers = (callback: (volunteers: VolunteerItem[]) => void): Unsubscribe => {
  const colRef = collection(db, 'volunteers');
  return onSnapshot(colRef, (snapshot) => {
    const list: VolunteerItem[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as VolunteerItem);
    });
    callback(list);
  }, (err) => {
    console.warn("Firestore volunteers subscription error:", err);
  });
};

export const subscribeToNotifications = (callback: (notifs: NotificationItem[]) => void): Unsubscribe => {
  const colRef = collection(db, 'notifications');
  return onSnapshot(colRef, (snapshot) => {
    const list: NotificationItem[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as NotificationItem);
    });
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  }, (err) => {
    console.warn("Firestore notifications subscription error:", err);
  });
};

export const subscribeToFeedback = (callback: (feedback: FeedbackItem[]) => void): Unsubscribe => {
  const colRef = collection(db, 'feedback');
  return onSnapshot(colRef, (snapshot) => {
    const list: FeedbackItem[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as FeedbackItem);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => {
    console.warn("Firestore feedback subscription error:", err);
  });
};

export const subscribeToCertificates = (callback: (certs: Certificate[]) => void): Unsubscribe => {
  const colRef = collection(db, 'certificates');
  return onSnapshot(colRef, (snapshot) => {
    const list: Certificate[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Certificate);
    });
    callback(list);
  }, (err) => {
    console.warn("Firestore certificates subscription error:", err);
  });
};

// Write Operations
export const createDonationDoc = async (donation: Donation): Promise<void> => {
  await setDoc(doc(db, 'donations', donation.id), donation);
};

export const updateDonationStatusDoc = async (id: string, updates: Partial<Donation>): Promise<void> => {
  await updateDoc(doc(db, 'donations', id), updates);
};

export const createUserDoc = async (user: User): Promise<void> => {
  await setDoc(doc(db, 'users', user.id), user);
};

export const updateUserDoc = async (id: string, updates: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, 'users', id), updates);
};

export const createNotificationDoc = async (notif: NotificationItem): Promise<void> => {
  await setDoc(doc(db, 'notifications', notif.id), notif);
};

export const updateNotificationDoc = async (id: string, updates: Partial<NotificationItem>): Promise<void> => {
  await updateDoc(doc(db, 'notifications', id), updates);
};

export const createFeedbackDoc = async (fb: FeedbackItem): Promise<void> => {
  await setDoc(doc(db, 'feedback', fb.id), fb);
};

export const createCertificateDoc = async (cert: Certificate): Promise<void> => {
  await setDoc(doc(db, 'certificates', cert.id), cert);
};

// One-time Database Seeding Check
export const seedInitialDataIfEmpty = async (): Promise<void> => {
  try {
    const snap = await getDocs(collection(db, 'donations'));
    if (snap.empty) {
      console.log('Firestore is empty. Seeding initial Food Rescue Network data...');
      
      for (const d of INITIAL_DONATIONS) {
        await setDoc(doc(db, 'donations', d.id), d);
      }
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, 'users', u.id), u);
      }
      for (const n of INITIAL_NGOS) {
        await setDoc(doc(db, 'ngos', n.id), n);
      }
      for (const v of INITIAL_VOLUNTEERS) {
        await setDoc(doc(db, 'volunteers', v.id), v);
      }
      for (const notif of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      }
      for (const fb of INITIAL_FEEDBACK) {
        await setDoc(doc(db, 'feedback', fb.id), fb);
      }
      for (const c of INITIAL_CERTIFICATES) {
        await setDoc(doc(db, 'certificates', c.id), c);
      }
      console.log('Firestore initial seeding completed successfully.');
    }
  } catch (error) {
    console.warn('Seed initial data check encountered error (rules might restrict or DB offline):', error);
  }
};
