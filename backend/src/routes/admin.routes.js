import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import {
  getAllUsersForAdmin,
  addUserByAdmin,
  updateUserRoleByAdmin,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/", getAllUsersForAdmin);
router.get("/users", getAllUsersForAdmin);
router.post("/users", addUserByAdmin);
router.patch("/users/:userId/role", updateUserRoleByAdmin);

export default router;
