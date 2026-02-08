import express from 'express';
import { getUserProfile, myProfile, updateProfilePic, updateUserProfile } from '../controllers/user.js';
import { isAuth } from '../middleware/auth.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/:userId", isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);
router.put("/update/pic", isAuth, uploadFile, updateProfilePic);

export default router;