import express from "express";

import {
  signIn,
  signUp,
  confirmEmail,
  retryConfirm,
  validateLink,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.patch("/confirm-email", confirmEmail);
router.patch("/retry-confirm", retryConfirm);
router.get("/forgot-password", validateLink);
router.patch("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

export default router;
