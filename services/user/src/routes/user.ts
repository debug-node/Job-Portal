import express from 'express';
import { myProfile } from '../controllers/user.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get("/me", isAuth, myProfile);
export default router;