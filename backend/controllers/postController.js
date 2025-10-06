import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Imagen requerida" });

    const post = new Post({
      imageUrl: `/uploads/${req.file.filename}`,
      caption: req.body.caption || "",
      author: req.user.sub,
    });

    await post.save();
    res.status(201).json({ message: "Post creado con éxito", post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error creando el post" });
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "displayName")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error obteniendo el feed" });
  }
};
