import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    console.log("🟡 BODY:", req.body);
    console.log("🟡 FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Imagen requerida" });
    }

    const post = new Post({
      image: `/uploads/${req.file.filename}`, // nombre igual que en el schema
      caption: req.body.caption || "",
      author: req.user.sub, // ID del usuario autenticado
    });

    await post.save();
    res.status(201).json({ message: "Post creado con éxito", post });
  } catch (err) {
    console.error("🔥 Error en createPost:", err);
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
