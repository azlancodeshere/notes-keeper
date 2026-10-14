
import { Router } from "express";

import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.use(authMiddleware);


router.post("/create-note", createNote);


router.get("/getAll-notes", getNotes);


router.get("/getSingle-notes/:id", getNoteById);


router.patch("/edit-notes/:id", updateNote);


router.delete("/delete-notes/:id", deleteNote);

export default router;
