import { Router } from 'express';
import { 
  register,
  test,
  login,
  changePassword,
  dashboard,
  logOut
    
 } from '../controllers/user.controller.js';


const router = Router();  

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logOut);
router.route('/change-password').post(changePassword);
router.route('/dashboard').get(dashboard);
router.route('/test').get(test);


export default router;