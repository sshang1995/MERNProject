import express from "express";
const router = express.Router();
import {
  createUser,
  login,
  updateUser,
  forgotPassword,
  resetPassword,
} from "../controller/user.js";

router.post("/", createUser);
router.put("/", updateUser);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

export default router;
