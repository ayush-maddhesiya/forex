import { Router } from 'express';


import { 
    createDeposit,
    getallDeposit,
    getDepositById,
    createWithdrawal,
    getallWithdrawal,
    getWithdrawalById
} from '../controllers/transaction.controller.js';
  

const router = Router();

router.route('/deposit').post(createDeposit).get(getallDeposit);
router.route('/deposit/:id').get(getDepositById);
router.route('/withdrawal').post(createWithdrawal).get(getallWithdrawal);
router.route('/withdrawal/:id').get(getWithdrawalById);
router.route('/withdrawal/:id').get(getWithdrawalById);


export default router;