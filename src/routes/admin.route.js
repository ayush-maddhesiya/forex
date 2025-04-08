import { Router } from "express";


const router = Router();
const { isAdmin, veriftyJWT } = require("../middleware/auth.middleware.js");

import {
  approveWithdrawal,
  rejectWithdrawal,
  approvedLoan,
  rejectLoan,
  approveddeposit,
  rejectDeposit,
  approveBuy,
  rejectBuy,
  approveSell,
  rejectSell,
  getAllUsers,
  getAllDeposits,
  getAllWithdrawals,
  getAllLoans,
  getAllBuyOrders,
  getAllSellOrders,
  /*
  TODO: add more routes for admin
  some use get all manage
  get all deposits
  */
} from "../controllers/admin.controller.js";

router.route("/approve-withdrawal").post(veriftyJWT, isAdmin, approveWithdrawal);
router.route("/reject-withdrawal").post(veriftyJWT, isAdmin, rejectWithdrawal);
router.route("/approve-loan").post(veriftyJWT, isAdmin, approvedLoan);
router.route("/reject-loan").post(veriftyJWT, isAdmin, rejectLoan);
router.route("/approve-deposit").post(veriftyJWT, isAdmin, approveddeposit);
router.route("/reject-deposit").post(veriftyJWT, isAdmin, rejectDeposit);
router.route("/get-all-sell-orders").get(veriftyJWT, isAdmin, getAllSellOrders);
router.route("/get-all-buy-orders").get(veriftyJWT, isAdmin, getAllBuyOrders);
router.route("/approve-buy").post(veriftyJWT, isAdmin, approveBuy);
router.route("/reject-buy").post(veriftyJWT, isAdmin, rejectBuy);
router.route("/approve-sell").post(veriftyJWT, isAdmin, approveSell);
router.route("/reject-sell").post(veriftyJWT, isAdmin, rejectSell);
router.route("/get-all-users").get(veriftyJWT, isAdmin, getAllUsers);
router.route("/get-all-deposits").get(veriftyJWT, isAdmin, getAllDeposits);
router.route("/get-all-withdrawals").get(veriftyJWT, isAdmin, getAllWithdrawals);
router.route("/get-all-loans").get(veriftyJWT, isAdmin, getAllLoans);
router.route("/get-all-loan-requests").get(veriftyJWT, isAdmin, getAllLoans);


export default router;