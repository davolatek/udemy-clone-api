import express from "express";

const router = express.Router();

import {
  register,
  login,
  logout,
  verifyUser,
  sendTestEmail,
} from "../controllers/auth";
import { requireSignIn } from "../middleware";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignIn, verifyUser);
router.get("/send-email", sendTestEmail);

module.exports = router;
