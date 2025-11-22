import express from "express";
import {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();
router.get("/list", getUsers);
router.get("/get/:user_id", getUserById);
router.get("/get_by_username/:username", getUserByUsername);
router.post("/create", createUser);
router.put("/update/:user_id", updateUser);

export = router;
