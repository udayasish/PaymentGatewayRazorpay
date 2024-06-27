import { Router } from "express";
import {
  registerUser,
  showRegisterPage,
  showLoginPage,
  loginUser,
} from "../controllers/user.controller.js";

const router = Router();

// Route to display the registration form
router.get("/register", showRegisterPage);

// Route to handle registration form submission
router.post("/register", registerUser);

// router.get("/login/:userId", showLoginPage);
router.get("/login", showLoginPage);
router.post("/login", loginUser);

export default router;
