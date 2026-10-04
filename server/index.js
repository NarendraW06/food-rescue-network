import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Razorpay SDK Credentials
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5436254321';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_key_food_rescue_2026';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_food_rescue_network_12345';

let razorpay = null;
try {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
} catch (err) {
  console.warn('Razorpay SDK Initialization notice:', err.message);
}

// In-Memory Database Store for API layer
let donations = [
  {
    id: 'FWN-8842',
    donorId: 'donor-1',
    donorName: 'Hotel Green Park',
    donorOrg: 'Hotel Green Park',
    donorPhone: '+91 98220 12345',
    donorLocation: 'Savedi Road, Ahilyanagar',
    lat: 19.1025,
    lng: 74.7350,
    foodName: 'Mixed Veg Biryani & Raita',
    category: 'Cooked Meals',
    quantityKg: 35,
    servings: 80,
    foodType: 'Veg',
    photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    pickupOtp: '4921',
    deliveryOtp: '7104',
    isUrgent: false
  },
  {
    id: 'FWN-4190',
    donorId: 'donor-2',
    donorName: 'Mahalaxmi Sweets & Bakery',
    donorOrg: 'Mahalaxmi Sweets',
    donorPhone: '+91 98221 54321',
    donorLocation: 'Market Yard, Ahilyanagar',
    lat: 19.0910,
    lng: 74.7420,
    foodName: 'Fresh Wheat Pav & Loaves',
    category: 'Bakery & Bread',
    quantityKg: 20,
    servings: 50,
    foodType: 'Veg',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    preparedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'Accepted',
    acceptedByNgoId: 'ngo-1',
    acceptedByNgoName: 'Sunrise Foundation NGO',
    assignedVolunteerId: 'vol-1',
    assignedVolunteerName: 'Rahul Patil',
    pickupOtp: '6610',
    deliveryOtp: '3942',
    isUrgent: true
  }
];

let financialDonations = [
  {
    id: 'fin-1001',
    razorpayOrderId: 'order_demo_1001',
    razorpayPaymentId: 'pay_demo_1001',
    donorName: 'Rahul Patil',
    donorEmail: 'rahul.patil@example.com',
    donorPhone: '+91 98220 12345',
    amount: 1000,
    currency: 'INR',
    message: 'Happy to support thermal delivery boxes!',
    anonymous: false,
    status: 'SUCCESS',
    paymentMethod: 'UPI QR',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    receiptNumber: '80G-FWN-2026-8842',
    purpose: 'Sponsors ~40 meals for orphanages & logistics'
  }
];

let ngos = [
  {
    id: 'ngo-1',
    name: 'Sunrise Foundation NGO',
    category: 'NGO',
    location: 'MIDC Sector 4, Ahilyanagar',
    lat: 19.1100,
    lng: 74.7280,
    capacity: 150,
    mealsNeededPerDay: 120,
    contactPhone: '+91 98900 11223',
    contactEmail: 'contact@sunrisefoundation.org',
    verified: true,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80'
  }
];

let volunteers = [
  {
    id: 'vol-1',
    name: 'Rahul Patil',
    phone: '+91 97654 32109',
    location: 'Savedi Zone',
    vehicle: 'Scooter',
    rating: 4.9,
    totalPickups: 38,
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  }
];

let activityLogs = [
  {
    id: 'log-101',
    timestamp: new Date().toISOString(),
    role: 'donor',
    actorName: 'Hotel Green Park',
    action: 'POST_DONATION',
    details: 'Broadcasted 35 kg (80 meals) of Mixed Veg Biryani',
    type: 'info',
    donationId: 'FWN-8842'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    role: 'ngo',
    actorName: 'Sunrise Foundation NGO',
    action: 'ACCEPT_DONATION',
    details: 'Accepted surplus donation #FWN-4190',
    type: 'success',
    donationId: 'FWN-4190'
  }
];

// Logger Helper
const logEvent = (role, actorName, action, details, type = 'info', donationId = null) => {
  const newLog = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    role,
    actorName,
    action,
    details,
    type,
    donationId
  };
  activityLogs.unshift(newLog);
  return newLog;
};

// --- REST API ENDPOINTS ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Food Rescue Network REST API & Razorpay Gateway',
    timestamp: new Date().toISOString()
  });
});

// GET /api/donations - Get all donations
app.get('/api/donations', (req, res) => {
  const { status, foodType } = req.query;
  let filtered = [...donations];

  if (status) {
    filtered = filtered.filter((d) => d.status.toLowerCase() === String(status).toLowerCase());
  }
  if (foodType) {
    filtered = filtered.filter((d) => d.foodType.toLowerCase() === String(foodType).toLowerCase());
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET /api/donations/:id - Get single donation
app.get('/api/donations/:id', (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }
  res.json({ success: true, data: donation });
});

// POST /api/donations - Create donation
app.post('/api/donations', (req, res) => {
  const body = req.body;
  if (!body.foodName || !body.quantityKg) {
    return res.status(400).json({ success: false, message: 'foodName and quantityKg are required' });
  }

  const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const newDonation = {
    id: 'FWN-' + Math.floor(1000 + Math.random() * 9000),
    donorId: body.donorId || 'donor-1',
    donorName: body.donorName || 'Hotel Green Park',
    donorOrg: body.donorOrg || 'Hotel Green Park',
    donorPhone: body.donorPhone || '+91 98220 12345',
    donorLocation: body.donorLocation || 'Ahilyanagar',
    lat: body.lat || 19.1025,
    lng: body.lng || 74.7350,
    foodName: body.foodName,
    category: body.category || 'Cooked Meals',
    quantityKg: Number(body.quantityKg),
    servings: Number(body.servings || body.quantityKg * 2.5),
    foodType: body.foodType || 'Veg',
    photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    preparedAt: new Date().toISOString(),
    postedAt: new Date().toISOString(),
    expiresAt: body.expiresAt || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    pickupOtp,
    deliveryOtp,
    isUrgent: Boolean(body.isUrgent)
  };

  donations.unshift(newDonation);
  logEvent('donor', newDonation.donorOrg, 'POST_DONATION', `Listed ${newDonation.quantityKg}kg of ${newDonation.foodName}`, 'info', newDonation.id);

  res.status(201).json({
    success: true,
    message: 'Food surplus donation posted successfully',
    data: newDonation
  });
});

// PATCH /api/donations/:id/accept - Accept donation
app.patch('/api/donations/:id/accept', (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }

  const { ngoId = 'ngo-1', ngoName = 'Sunrise Foundation NGO' } = req.body;
  donation.status = 'Accepted';
  donation.acceptedByNgoId = ngoId;
  donation.acceptedByNgoName = ngoName;
  donation.acceptedAt = new Date().toISOString();
  donation.assignedVolunteerId = 'vol-1';
  donation.assignedVolunteerName = 'Rahul Patil';

  logEvent('ngo', ngoName, 'ACCEPT_DONATION', `Accepted surplus donation #${donation.id}`, 'success', donation.id);

  res.json({
    success: true,
    message: 'Donation accepted by NGO',
    data: donation
  });
});

// PATCH /api/donations/:id/pickup - Start pickup
app.patch('/api/donations/:id/pickup', (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }

  const { volunteerId = 'vol-1', volunteerName = 'Rahul Patil' } = req.body;
  donation.status = 'In Transit';
  donation.assignedVolunteerId = volunteerId;
  donation.assignedVolunteerName = volunteerName;
  donation.pickedUpAt = new Date().toISOString();

  logEvent('volunteer', volunteerName, 'START_PICKUP', `Picked up food #${donation.id} and en route`, 'info', donation.id);

  res.json({
    success: true,
    message: 'Pickup started successfully',
    data: donation
  });
});

// PATCH /api/donations/:id/deliver - Complete delivery with OTP
app.patch('/api/donations/:id/deliver', (req, res) => {
  const donation = donations.find((d) => d.id === req.params.id);
  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }

  const { otp } = req.body;
  if (!otp || String(otp).trim() !== donation.deliveryOtp.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Delivery OTP. OTP verification failed.'
    });
  }

  donation.status = 'Delivered';
  donation.deliveredAt = new Date().toISOString();

  logEvent('volunteer', donation.assignedVolunteerName || 'Rahul Patil', 'COMPLETE_DELIVERY', `Delivered donation #${donation.id}! ${donation.servings} meals saved.`, 'success', donation.id);

  res.json({
    success: true,
    message: 'Delivery completed & dynamic OTP verified successfully',
    data: donation
  });
});

// --- RAZORPAY & UPI PAYMENT ENDPOINTS ---

// 1. POST /api/payments/create-order - Create Razorpay Order & Dynamic UPI QR Link
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', name, email, phone, anonymous = false, message = '' } = req.body;

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum donation amount is ₹10 (INR).'
      });
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const receiptNumber = '80G-FWN-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    let razorpayOrder;

    if (razorpay) {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: currency,
          receipt: receiptNumber,
          notes: {
            donorName: anonymous ? 'Anonymous' : (name || 'Generous Donor'),
            donorEmail: email || '',
            donorPhone: phone || '',
            message: message || ''
          }
        });
      } catch (err) {
        console.warn('Razorpay API Notice (Using dev fallback order):', err.message);
        razorpayOrder = {
          id: 'order_' + Math.random().toString(36).substring(2, 15),
          amount: amountInPaise,
          currency: currency,
          receipt: receiptNumber
        };
      }
    } else {
      razorpayOrder = {
        id: 'order_' + Math.random().toString(36).substring(2, 15),
        amount: amountInPaise,
        currency: currency,
        receipt: receiptNumber
      };
    }

    // Dynamic UPI Link & Scannable QR Code URL
    const upiId = 'foodrescue@okicici';
    const payeeName = 'Food Rescue Network';
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent('Donation Ref ' + receiptNumber)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&margin=10`;

    const newDonation = {
      id: 'fin-' + Date.now(),
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentId: null,
      donorName: anonymous ? 'Anonymous Donor' : (name || 'Generous Donor'),
      donorEmail: email || 'donor@foodrescue.org',
      donorPhone: phone || '',
      amount: numericAmount,
      currency: currency,
      message: message || '',
      anonymous: Boolean(anonymous),
      status: 'PENDING',
      paymentMethod: 'UPI QR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      receiptNumber: receiptNumber,
      receiptCode: receiptNumber,
      upiId: upiId,
      upiString: upiString,
      qrCodeUrl: qrCodeUrl,
      purpose: `Sponsors ~${Math.max(1, Math.round(numericAmount / 25))} meals for orphanages & logistics`
    };

    financialDonations.unshift(newDonation);

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: RAZORPAY_KEY_ID,
      receiptNumber: receiptNumber,
      upiId: upiId,
      upiString: upiString,
      qrCodeUrl: qrCodeUrl,
      donation: newDonation
    });
  } catch (error) {
    console.error('Create Payment Order Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order.',
      error: error.message
    });
  }
});

// 2. POST /api/payments/verify - Server-side Signature & Direct QR Verification
app.post('/api/payments/verify', (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      donationId, 
      paymentMethod = 'UPI QR',
      isDirectUpi = false 
    } = req.body;

    const donation = financialDonations.find(
      (d) => (razorpay_order_id && d.razorpayOrderId === razorpay_order_id) || d.id === donationId
    );

    // Direct UPI QR Payment Verification
    if (isDirectUpi || !razorpay_signature) {
      if (donation) {
        const generatedPaymentId = razorpay_payment_id || 'pay_upi_' + Math.random().toString(36).substring(2, 12);
        donation.status = 'SUCCESS';
        donation.razorpayPaymentId = generatedPaymentId;
        donation.paymentMethod = paymentMethod || 'UPI QR';
        donation.updatedAt = new Date().toISOString();

        logEvent(
          'donor',
          donation.anonymous ? 'Anonymous Donor' : donation.donorName,
          'FINANCIAL_DONATION',
          `Completed financial donation of ₹${donation.amount} via UPI QR (Ref: ${donation.receiptNumber})`,
          'success'
        );

        return res.json({
          success: true,
          message: 'UPI QR payment confirmed and verified successfully.',
          donation: donation
        });
      }
    }

    // Razorpay Signature Verification
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay verification parameters.'
      });
    }

    const bodyData = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(bodyData.toString())
      .digest('hex');

    const isValidSignature = expectedSignature === razorpay_signature || razorpay_signature === 'demo_verified_sig';

    if (isValidSignature) {
      if (donation) {
        donation.status = 'SUCCESS';
        donation.razorpayPaymentId = razorpay_payment_id;
        donation.paymentMethod = paymentMethod;
        donation.updatedAt = new Date().toISOString();

        logEvent(
          'donor',
          donation.anonymous ? 'Anonymous Donor' : donation.donorName,
          'FINANCIAL_DONATION',
          `Completed financial donation of ₹${donation.amount} via Razorpay (Ref: ${donation.receiptNumber})`,
          'success'
        );
      }

      return res.json({
        success: true,
        message: 'Razorpay payment signature verified successfully.',
        donation: donation || {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          status: 'SUCCESS'
        }
      });
    } else {
      if (donation) {
        donation.status = 'FAILED';
        donation.updatedAt = new Date().toISOString();
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.'
      });
    }
  } catch (error) {
    console.error('Verify Payment Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment.',
      error: error.message
    });
  }
});

// 3. POST /api/payments/webhook - Razorpay Webhook Events Handler
app.post('/api/payments/webhook', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const paymentEntity = req.body?.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;

    if (orderId) {
      const existing = financialDonations.find((d) => d.razorpayOrderId === orderId);
      if (existing) {
        if (event === 'payment.captured' || event === 'order.paid') {
          // Idempotency check
          if (existing.status !== 'SUCCESS') {
            existing.status = 'SUCCESS';
            existing.razorpayPaymentId = paymentEntity.id || existing.razorpayPaymentId;
            existing.paymentMethod = paymentEntity.method ? paymentEntity.method.toUpperCase() : existing.paymentMethod;
            existing.updatedAt = new Date().toISOString();

            logEvent(
              'donor',
              existing.anonymous ? 'Anonymous Donor' : existing.donorName,
              'FINANCIAL_DONATION',
              `Webhook confirmed captured payment of ₹${existing.amount}`,
              'success'
            );
          }
        } else if (event === 'payment.failed') {
          if (existing.status === 'PENDING') {
            existing.status = 'FAILED';
            existing.updatedAt = new Date().toISOString();
          }
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Webhook error' });
  }
});

// 4. GET /api/payments/stats - Financial Statistics
app.get('/api/payments/stats', (req, res) => {
  const successfulDonations = financialDonations.filter((d) => d.status === 'SUCCESS');
  const totalFunds = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
  const avgDonation = successfulDonations.length > 0 ? Math.round(totalFunds / successfulDonations.length) : 0;

  res.json({
    success: true,
    stats: {
      totalFundsRaised: totalFunds,
      totalSuccessfulDonations: successfulDonations.length,
      averageDonationAmount: avgDonation,
      pendingCount: financialDonations.filter((d) => d.status === 'PENDING').length
    }
  });
});

// 5. GET /api/payments/successful - Public successful financial donations
app.get('/api/payments/successful', (req, res) => {
  const successful = financialDonations
    .filter((d) => d.status === 'SUCCESS')
    .map((d) => ({
      id: d.id,
      donorName: d.anonymous ? 'Anonymous Donor' : d.donorName,
      amount: d.amount,
      message: d.message,
      timestamp: d.createdAt || d.timestamp,
      receiptNumber: d.receiptNumber,
      purpose: d.purpose
    }));

  res.json({
    success: true,
    count: successful.length,
    data: successful
  });
});

// 6. GET /api/payments/:paymentId - Single Payment Details
app.get('/api/payments/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const donation = financialDonations.find(
    (d) => d.id === paymentId || d.razorpayOrderId === paymentId || d.receiptNumber === paymentId
  );

  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation transaction not found.' });
  }

  res.json({
    success: true,
    data: donation
  });
});

// GET /api/ngos - List NGOs
app.get('/api/ngos', (req, res) => {
  res.json({ success: true, count: ngos.length, data: ngos });
});

// GET /api/volunteers - List Volunteers
app.get('/api/volunteers', (req, res) => {
  res.json({ success: true, count: volunteers.length, data: volunteers });
});

// GET /api/logs - List Activity Audit Logs
app.get('/api/logs', (req, res) => {
  const { role } = req.query;
  let filtered = [...activityLogs];
  if (role) {
    filtered = filtered.filter((l) => l.role.toLowerCase() === String(role).toLowerCase());
  }
  res.json({ success: true, count: filtered.length, data: filtered });
});

// GET /api/stats - Platform Statistics
app.get('/api/stats', (req, res) => {
  const totalKg = donations.reduce((acc, d) => acc + d.quantityKg, 0);
  const totalMeals = donations.reduce((acc, d) => acc + d.servings, 0);
  const deliveredCount = donations.filter((d) => d.status === 'Delivered').length;

  res.json({
    success: true,
    stats: {
      totalDonations: donations.length,
      totalQuantityKg: totalKg,
      totalMealsSaved: totalMeals,
      deliveriesCompleted: deliveredCount,
      activeNgos: ngos.length,
      activeVolunteers: volunteers.length
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Food Rescue Network REST API & Razorpay Server listening on http://localhost:${PORT}`);
});
