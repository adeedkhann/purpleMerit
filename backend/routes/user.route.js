import express from "express";
import { changeStatus, getAllUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import {isAuthenticated} from "../middlewares/isAuthenticated.js"
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router()


router.route("/register").post(registerUser)
router.route('/login').post(loginUser)
router.route("/logout").post(isAuthenticated , logoutUser)
router.route('/allusers').get(isAuthenticated,authorizeRole('admin'),getAllUser)
router.route('/user/update').post(isAuthenticated,authorizeRole("admin"),changeStatus)


export default router