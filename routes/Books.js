import { Router } from "express";
import { createBooks, deleteBooks, getBooks, updateBook } from "../controller/ProductController.js";
import upload from "../middleware/upload.js";
const router = Router();

router.post("/addBooks",upload.fields([{name:"pdf",maxCount:1},{name:"image",maxCount:1}]), createBooks);
router.get("/getBooks",getBooks);
router.delete("/deleteBook/:id",deleteBooks)
router.put("/updateBook/:id",updateBook)

export default router;