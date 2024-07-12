import express from "express";
// Import controller functions
import { registerUser, loginUser, userLogout } from "../../controllers/authController.js";
import { isUser } from "../../middleware/validateTokenHandler.js";
const router = express.Router();

// User routes
router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.post('/logout', userLogout);


export default router;
