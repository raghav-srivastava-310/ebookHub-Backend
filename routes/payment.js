import { Router } from "express";
import authUser from "../middleware/Authenticate.js";
import { createOrder, verifyPayment } from "../controller/payment.js";

const router = Router();

router.post("/createOrder",authUser,createOrder);
router.post("/verifyPayment",authUser,verifyPayment);

export default router;