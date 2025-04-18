import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  const token = jwt.sign({ id: User._id }, JWT_SECRET, { expiresIn: "7d" });

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }
      next();
    };
  };
  
