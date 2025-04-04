import express from 'express';
import { signUpUser, signInUser } from '../controller/userController.js';

const router = express.Router();

router.post('/signin', signInUser);
router.post('/signup', signUpUser);

export default router;
