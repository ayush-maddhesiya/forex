import express from 'express';
import { 
  register,
  test,
  login,
  changePassword,
  dashboard,
  logout as logOut,

  // // Transaction controllers
  // deposit,
  // withdraw,
  // transactionHistory,
  // depositHistory,
  // withdrawHistory,
  // depositDetails,
  // withdrawDetails,

  // Profile controllers
  getProfile,
  getPersonalInfo,
  getKYCInfo,
  getBankDetails,
  getLastLogin,
  // Order/Trade controllers
  getOrderHistory,
  getTradeHistory
 } from '../controllers/user.controller.js';

import {
  deposit,
  withdraw,
  transactionHistory,
  depositHistory,
  withdrawHistory,
  depositDetails,
  withdrawDetails,
  
  // getTransactionById,           not needed
  // updateTransactionStatus,      for admin
  // getTransactionSummary         we will see
} from '../controllers/transaction.controller.js';

import {  veriftyJWT } from '../middleware/auth.middleware.js';
import { uploadFields } from '../middleware/uploadMiddleware.js';

const router = express.Router();  

// Register route with file upload
router.post('/register', uploadFields, register);
router.route('/login').post(login);

// Middleware to verify JWT
router.use(veriftyJWT);

// Auth routes [Done]
router.route('/logout').post(logOut);
router.route('/change-password').post(changePassword);

// Dashboard routes [Under Development]
router.route('/dashboard').get(dashboard);

// Transaction routes
// Deposit Funds
router.route('/deposit').post(veriftyJWT, deposit);
router.route('/deposit-history').get(veriftyJWT, depositHistory);
router.route('/deposit-details').get(veriftyJWT, depositDetails);

// Withdraw Funds  
router.route('/withdraw').post(veriftyJWT, withdraw);
router.route('/withdraw-history').get(veriftyJWT, withdrawHistory);
router.route('/withdraw-details').get(veriftyJWT, withdrawDetails);

// Transaction History
router.route('/transaction-history').get(veriftyJWT, transactionHistory);

// Order History routes
router.route('/order-history').get(veriftyJWT, getOrderHistory);
router.route('/trade-history').get(veriftyJWT, getTradeHistory);

// Profile (Account Settings) routes
router.route('/profile').get(veriftyJWT, getProfile);   // profile and KYC Information
router.route('/personal-info').get(veriftyJWT, getPersonalInfo);
router.route('/bank-details').get(veriftyJWT, getBankDetails);
// router.route('/last-login').get(veriftyJWT, getLastLogin);

export default router;