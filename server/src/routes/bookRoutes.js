import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listBooks,
  createBook,
  updateBook,
  issueBook,
  returnBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = Router();

router.use(requireAuth);

router.get("/", listBooks);
router.post("/", createBook);
router.put("/:id", updateBook);
router.put("/:id/issue", issueBook);
router.put("/:id/return", returnBook);
router.delete("/:id", deleteBook);

export default router;