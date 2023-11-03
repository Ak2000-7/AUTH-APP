import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  registerAdminUser,

} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { initiatePasswordReset } from '../controllers/passwordReset.js';

router.route('/').post(registerUser).get(protect, admin, getUsers)

router
.route('/register-admin')
.post(registerAdminUser)
// .get(protect, admin, );

router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

router.post('/reset-password/:token', initiatePasswordReset);



export default router