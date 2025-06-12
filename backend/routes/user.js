
import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/user.js';
import verifyToken from '../middlewares/authentication.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

 

export default router;
