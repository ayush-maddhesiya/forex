import { Router } from 'express';
import { 
  openOrderHistory,
  
} from '../controllers/orderhistory.controller.js';

const router = Router();

router.route('/').get(getOrderHistory).post(createOrderHistory);

export default router;