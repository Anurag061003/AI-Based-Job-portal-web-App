import express from "express";
import { login, logout, register, sendOTPforSignup, updateProfile } from "../controllers/UserController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route('/send/otp/for/signup').post(sendOTPforSignup),
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;

