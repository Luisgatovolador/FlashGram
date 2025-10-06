import express from "express";
import { createPost, getFeed } from "../controllers/postController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create", verifyJWT, upload.single("image"), createPost);
router.get("/feed", verifyJWT, getFeed);

export default router;
