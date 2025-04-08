import { Router } from 'express';
import { 
  register,
  test,
  login,
  changePassword,
  dashboard,
  logout as logOut
 } from '../controllers/user.controller.js';

import { isAdmin, veriftyJWT } from '../middleware/auth.middleware.js';
const router = Router();  


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(veriftyJWT,logOut);
router.route('/change-password').post(veriftyJWT, changePassword);
router.route('/dashboard').get(veriftyJWT , dashboard);
router.route('/test').get(test);



export default router;