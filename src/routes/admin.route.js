import { Router } from "express";


const router = Router();
import { isAdmin, veriftyJWT }  from  "../middleware/auth.middleware.js";

import {
  userapprove,
  approveWithdrawal,
  rejectWithdrawal,
  approveddeposit,
  rejectDeposit,
  approveBuy,
  rejectBuy,
  approveSell,
  rejectSell,
  getAllUsers,
  getAllDeposits,
  getAllWithdrawals,
  getAllBuyOrders,
  getAllSellOrders,
  /*
  TODO: add more routes for admin
  some use get all manage
  get all deposits
  */
 
} from "../controllers/admin.controller.js";

import {
  getAllUpi,
  addUpi,
  deleteUpiById,
}
from "../controllers/upi.controller.js";

import {
  getAllUsers,
  deleteUserById,
} from "../controllers/user.controller.js";

import { 
    getUserTradeHistory,
    addtradetobuy,
    addtradetosell,
} from "../controllers/orderhistory.controller.js";

import {
  getAlluserKpis,
  getUserbyId,
  userapprove,
  userreject
} from "../controllers/user.controller.js";


import {
  getAllPendingWithdrawals,   // for number of pending withdrawals [route]  .length()
  getPendingWithdrawalById,   
  getVerifiedWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
  getAllWithdrawals,  //from i can get total requests  .populate(user)
  getallCompletedWithdrawals, // for KPIs


  //--------deposits
  getAllPendingDeposits,
  getPendingDepositById,
  getVerifiedDepositById,
  approvedDeposit,
  rejectDeposit,
  getAllDeposits,
} from "../controllers/transaction.controller.js";



router.route("/get-all-sell-orders").get(veriftyJWT, isAdmin, getAllSellOrders);
router.route("/get-all-buy-orders").get(veriftyJWT, isAdmin, getAllBuyOrders);
router.route("/approve-buy").post(veriftyJWT, isAdmin, approveBuy);
router.route("/reject-buy").post(veriftyJWT, isAdmin, rejectBuy);
router.route("/approve-sell").post(veriftyJWT, isAdmin, approveSell);
router.route("/reject-sell").post(veriftyJWT, isAdmin, rejectSell);


// //to remove this  [loan section]
// router.route("/get-all-loans").get(veriftyJWT, isAdmin, getAllLoans);
// router.route("/get-all-loan-requests").get(veriftyJWT, isAdmin, getAllLoans);
// router.route("/reject-loan").post(veriftyJWT, isAdmin, rejectLoan);
// router.route("/approve-loan").post(veriftyJWT, isAdmin, approvedLoan);


//---------------New User Requests [Done]
//-------------------------Total Users , Pending Users, Approved Users, 
//-------------------------User Verification Requests
//----------------------------------Approve User/Reject User
router.route("/get-users-kpi").get(veriftyJWT, isAdmin, getAlluserKpis);
router.route("/approve-user").post(veriftyJWT, isAdmin, userapprove);
router.route("/reject-user").post(veriftyJWT, isAdmin, userreject);
router.route("/get-user").get(veriftyJWT, isAdmin, getUserbyId);



//------------------Deposit Requests[Done]
//------------------------------Pending Deposits
//---------------------------------------approve Deposit/Reject Deposit
//------------------------------Verified Deposits
//---------------------------------------all list
//---------------------------------------view by id
router.route("/get-all-pending-deposits").get(veriftyJWT, isAdmin, getAllPendingDeposits);
router.route("/get-pending-deposit").get(veriftyJWT, isAdmin, getPendingDepositById);
router.route("/get-verified-deposit").get(veriftyJWT, isAdmin, getVerifiedDepositById);
router.route("/approve-deposit").post(veriftyJWT, isAdmin, approvedDeposit);
router.route("/reject-deposit").post(veriftyJWT, isAdmin, rejectDeposit);
router.route("/get-all-deposits").get(veriftyJWT, isAdmin, getAllDeposits);


//------------------Withdrawal Requests[Done]
//-------------------------------------------------Total Requests, Pending Requests, total Amount,Completed Requests
//------------------------------Pending Withdrawals
// ---------------------------------------approve Withdrawal/Reject Withdrawal
//------------------------------Verified Withdrawals
// ---------------------------------------all list
// ---------------------------------------view by id
//needto add KPIs
router.route("/get-all-complete-withdrawals").get(veriftyJWT, isAdmin, getallCompletedWithdrawals); // get all user kpis
router.route("/get-all-pending-withdrawals").get(veriftyJWT, isAdmin, getAllPendingWithdrawals);
router.route("/get-pending-withdrawal").get(veriftyJWT, isAdmin, getPendingWithdrawalById);
router.route("/get-verified-withdrawal").get(veriftyJWT, isAdmin, getVerifiedWithdrawalById);
router.route("/approve-withdrawal").post(veriftyJWT, isAdmin, approveWithdrawal);
router.route("/reject-withdrawal").post(veriftyJWT, isAdmin, rejectWithdrawal);
router.route("/get-all-withdrawals").get(veriftyJWT, isAdmin, getAllWithdrawals);



//----------------------Trade  History( trade order history )[Done]
//-----------------------------select user( get all  user name )
//------------------------------------then able to Trading History  ( order history)
router.route("/get-user-trade-history").get(veriftyJWT, isAdmin, getUserTradeHistory);
router.route("/add-trade-to-buy").post(veriftyJWT, isAdmin, addtradetobuy);
router.route("/add-trade-to-sell").post(veriftyJWT, isAdmin, addtradetosell);


//----------------------Add Bank Account[Done]
//Todo: add model name Upi to Store all UPI details(CRUD)
//----------------------------Currently Activated UPI
//--------------------------------UPI List
router.route("/get-all-upi").get(veriftyJWT, isAdmin, getAllUpi);
router.route("/add-upi").post(veriftyJWT, isAdmin, addUpi);
router.route("/delete-upi").delete(veriftyJWT, isAdmin, deleteUpiById);


//-----------------------All User[Done] 
//------------------------------Total Users, New User , Active Users, Suspended Users
//-----------------------list of all users( name Status joined Last transaction)
//------------------------------ Deleted Users/ View by id 
//needto add KPIs
router.route("/get-all-users").get(veriftyJWT, isAdmin, getAllUsers);
// router.route("/get-user").get(veriftyJWT, isAdmin, getUserbyId);   go to line number 51
router.route("/delete-user").delete(veriftyJWT, isAdmin, deleteUserById); // To delete user by id




//Illgoical Account Settings
//-----------------------What is the account settings for admin( why is that needed)


export default router;