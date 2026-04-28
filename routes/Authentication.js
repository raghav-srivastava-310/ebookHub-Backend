import { Router } from "express";
import { getCaptcha, getUser, googleAuth, signin, signup } from "../controller/Authentication.js";
import {  signUpValidation } from "../middleware/Authvalidation.js";
import authUser from "../middleware/Authenticate.js";

const router = Router();
router.post('/signup',signUpValidation,signup);
router.post('/signin',signin);
router.post('/google',googleAuth);
router.get('/captcha',getCaptcha);
router.get('/get-me',authUser,getUser)
export default router;