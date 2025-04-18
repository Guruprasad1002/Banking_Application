  import express from "express";
  import { register, login } from "../Controllers/userController.js";
  import { protect, authorizeRoles } from "../Middleware/authMiddleware.js";

  const router = express.Router();

  router.post("/register", register);
  router.post("/login", login);

  router.get("/me", protect, (req, res) => {
    res.json({ message: "User profile info", user: req.user });
  });

  router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin!" });
  });

  router.get("/employee-only", protect, authorizeRoles("employee"), (req, res) => {
    res.json({ message: "Welcome Employee!" });
  });

  export default router;