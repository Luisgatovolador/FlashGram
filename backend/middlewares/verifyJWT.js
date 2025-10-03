const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token faltante" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
