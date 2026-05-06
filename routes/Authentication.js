import { Router } from "express";
import {  getUser, googleAuth, logout, signin, signup } from "../controller/Authentication.js";
import {  signUpValidation } from "../middleware/Authvalidation.js";
import authUser from "../middleware/Authenticate.js";

const router = Router();
router.post('/signup',signUpValidation,signup);
router.post('/signin',signin);
router.post('/google',googleAuth);
router.post('/logout',logout);
router.get('/get-me',authUser,getUser)
export default router;