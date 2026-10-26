import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listMembers } from "../controllers/memberController.js";

const router = Router();

router.use(requireAuth);
router.get("/", listMembers);

export default router;