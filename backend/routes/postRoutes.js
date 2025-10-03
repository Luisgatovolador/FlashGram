const express = require("express");
const router = express.Router();
const { createPost, getFeed } = require("../controllers/postController");
const verifyJWT = require("../middlewares/verifyJWT");
const upload = require("../middlewares/uploadMiddleware");

router.post("/create", verifyJWT, upload.single("image"), createPost);
router.get("/feed", verifyJWT, getFeed);

module.exports = router;
