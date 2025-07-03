import express from 'express';
import { getUserDashboardData , getalltransationhistory } from '../controllers/dashboard.controller.js';
import  {veriftyJWT}  from '../middleware/auth.middleware.js';
import { historyTransaction } from "../controllers/transaction.controller.js"

const router = express.Router();

// GET /api/dashboard/user - Get dashboard data for the logged-in user
router.get('/user', veriftyJWT, getUserDashboardData);
router.get('/transation', veriftyJWT, historyTransaction);


export default router; 