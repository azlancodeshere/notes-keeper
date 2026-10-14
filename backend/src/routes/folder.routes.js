
import { Router } from "express";

import {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder
} from "../controllers/folder.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.use(authMiddleware);


router.post("/create-folder", createFolder);


router.get("/get-folders", getFolders);


router.patch("/:folderId", renameFolder);

router.delete("/:folderId", deleteFolder);

export default router;
