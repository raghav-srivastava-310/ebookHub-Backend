import { Router } from "express";
import { getAdminDetails, login } from "../../admin/controller/Authenticate.js"
import AuthenticateAdmin from "../middleware/AuthenticatAdmin.js";

const router = Router();

router.post("/login",login);
router.get("/get-admin",AuthenticateAdmin,getAdminDetails);

export default router;