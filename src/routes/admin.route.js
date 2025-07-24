import { Router } from "express";
import { isAdmin, veriftyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Import controllers
import {
  getAllUpi,
  addUpi,
  deleteUpiById,
} from "../controllers/upi.controller.js";

import {
  getAllUsers,
  deleteUserById,
  getAlluserKpis,
  updateTransactionStatus,
  getUserbyId,
  userapprove,
  userreject,
} from "../controllers/user.controller.js";

import { 
  getUserTradeHistory,
  createTrade,
  updateTrade,
} from "../controllers/orderhistory.controller.js";

import {
  getAllPendingWithdrawals,
  getPendingWithdrawalById,
  getVerifiedWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
  getAllWithdrawals,
  getallCompletedWithdrawals,
  // Deposit routes
  getAllPendingDeposits,
  getAllVerifiedDeposits,
  getPendingDepositById,
  getVerifiedDepositById,
  approvedDeposit,
  rejectDeposit,
  getAllDeposits
} from "../controllers/transaction.controller.js";

// =============================================================================
// USER MANAGEMENT ROUTES
// =============================================================================

// User KPIs and Statistics
router.route("/get-users-kpi").get(veriftyJWT, isAdmin, getAlluserKpis);

// User Approval/Rejection
router.route("/approve-user").post(veriftyJWT, isAdmin, userapprove);
router.route("/reject-user").post(veriftyJWT, isAdmin, userreject);

// User Operations
router.route("/get-all-users").get(veriftyJWT, isAdmin, getAllUsers);
router.route("/get-user").get(veriftyJWT, isAdmin, getUserbyId);
router.route("/delete-user").delete(veriftyJWT, isAdmin, deleteUserById);

// =============================================================================
// TRANSACTION MANAGEMENT ROUTES
// =============================================================================

// General Transaction Operations
router.route("/transactions/:transactionId/status").patch(veriftyJWT, isAdmin, updateTransactionStatus);

// -----------------------------------------------------------------------------
// DEPOSIT ROUTES
// -----------------------------------------------------------------------------

// Deposit Lists
router.route("/get-all-deposits").get(veriftyJWT, isAdmin, getAllDeposits);
router.route("/get-all-pending-deposits").get(veriftyJWT, isAdmin, getAllPendingDeposits);
router.route("/get-all-verified-deposits").get(veriftyJWT, isAdmin, getAllVerifiedDeposits);

// Deposit Details by ID
router.route("/get-pending-deposit/:id").get(veriftyJWT, isAdmin, getPendingDepositById);
router.route("/get-verified-deposit/:id").get(veriftyJWT, isAdmin, getVerifiedDepositById);

// Deposit Actions
router.route("/approve-deposit/:id").patch(veriftyJWT, isAdmin, approvedDeposit);
router.route("/reject-deposit/:id").patch(veriftyJWT, isAdmin, rejectDeposit);

// -----------------------------------------------------------------------------
// WITHDRAWAL ROUTES
// -----------------------------------------------------------------------------

// Withdrawal Lists
router.route("/get-all-withdrawals").get(veriftyJWT, isAdmin, getAllWithdrawals);
router.route("/get-all-pending-withdrawals").get(veriftyJWT, isAdmin, getAllPendingWithdrawals);
router.route("/get-all-complete-withdrawals").get(veriftyJWT, isAdmin, getallCompletedWithdrawals);

// Withdrawal Details by ID
router.route("/get-pending-withdrawal").get(veriftyJWT, isAdmin, getPendingWithdrawalById);
router.route("/get-verified-withdrawal").get(veriftyJWT, isAdmin, getVerifiedWithdrawalById);

// Withdrawal Actions
router.route("/approve-withdrawal").post(veriftyJWT, isAdmin, approveWithdrawal);
router.route("/reject-withdrawal").post(veriftyJWT, isAdmin, rejectWithdrawal);

// =============================================================================
// TRADE MANAGEMENT ROUTES
// =============================================================================

// Trade History and Operations
router.route("/get-user-trade-history/:userId").get(veriftyJWT, isAdmin, getUserTradeHistory);
router.route("/create-trade").post(veriftyJWT, isAdmin, createTrade);
router.route("/update-trade/:tradeId").put(veriftyJWT, isAdmin, updateTrade);

// =============================================================================
// UPI/PAYMENT MANAGEMENT ROUTES
// =============================================================================

// UPI Operations
router.route("/get-all-upi").get(veriftyJWT, isAdmin, getAllUpi);
router.route("/add-upi").post(veriftyJWT, isAdmin, addUpi);
router.route("/delete-upi").delete(veriftyJWT, isAdmin, deleteUpiById);

// =============================================================================
// FUTURE ROUTES (COMMENTED FOR POTENTIAL USE)
// =============================================================================

/*
// Buy/Sell Order Management (if needed in future)
router.route("/get-all-sell-orders").get(veriftyJWT, isAdmin, getAllSellOrders);
router.route("/get-all-buy-orders").get(veriftyJWT, isAdmin, getAllBuyOrders);
router.route("/approve-buy").post(veriftyJWT, isAdmin, approveBuy);
router.route("/reject-buy").post(veriftyJWT, isAdmin, rejectBuy);
router.route("/approve-sell").post(veriftyJWT, isAdmin, approveSell);
router.route("/reject-sell").post(veriftyJWT, isAdmin, rejectSell);

// Loan Management (if loan feature is added back)
router.route("/get-all-loans").get(veriftyJWT, isAdmin, getAllLoans);
router.route("/get-all-loan-requests").get(veriftyJWT, isAdmin, getAllLoans);
router.route("/reject-loan").post(veriftyJWT, isAdmin, rejectLoan);
router.route("/approve-loan").post(veriftyJWT, isAdmin, approvedLoan);
*/

export default router;