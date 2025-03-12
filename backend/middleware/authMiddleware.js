const jwt = require("jsonwebtoken");
const { User } = require("../models"); // ✅ Ensure models file uses CommonJS

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("YYY", token , process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DDDD",decoded)
    req.user = await User.findByPk(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
