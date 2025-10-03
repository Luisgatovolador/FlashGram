const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ email, passwordHash, displayName });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error interno" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Credenciales inválidas" });

    const payload = { sub: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error interno" });
  }
};

module.exports = { register, login };
