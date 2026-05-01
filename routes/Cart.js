import express from "express";
import authUser from "../middleware/Authenticate.js"
import { addToCart, getCart, removeItem, updateQuantity } from "../controller/CartController.js";
const router = express.Router();

router.post("/addToCart",authUser,addToCart);
router.get("/getCart",authUser,getCart);
router.delete("/removeItem/:id",authUser,removeItem);
router.patch("/updateQuantity/:id",authUser,updateQuantity);

export default router;