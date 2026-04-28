import { Router } from "express";
import { login } from "../../admin/controller/Authenticate.js"

const router = Router();

router.post("/login",login);

export default router;