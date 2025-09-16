import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/UserController.js";
import auth from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/:id",auth, getUserById);
router.put("/:id",auth, updateUser);
router.delete("/:id",auth, deleteUser);

export default router;
