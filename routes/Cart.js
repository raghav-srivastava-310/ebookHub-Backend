import express from "express";
import authUser from "../middleware/Authenticate.js"
import { addToCart, getCart, removeItem } from "../controller/CartController.js";
const router = express.Router();

router.post("/addToCart",authUser,addToCart);
router.get("/getCart",authUser,getCart);
router.delete("/removeItem/:id",authUser,removeItem);

export default router;