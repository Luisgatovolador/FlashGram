import express from "express";
import { createPost, getFeed } from "../controllers/postController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import { uploadSingleImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 👇 Aquí usamos el middleware seguro
router.post("/create", verifyJWT, uploadSingleImage, createPost);
router.get("/feed", getFeed);

export default router;
