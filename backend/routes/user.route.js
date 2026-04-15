import express from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getAllUser, 
    changeStatus,
    updateAccountDetails,
    changeCurrentPassword,
    getUserDetails,
    deleteUser,
    refreshAccessToken
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// USER SELF-SERVICE (All logged-in users)
// Requirement 3.4: Users can manage their own profile only
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/me/update").patch(isAuthenticated, updateAccountDetails);
router.route("/me/change-password").patch(isAuthenticated, changeCurrentPassword);

//ADMIN & MANAGER ROUTES
// Requirement 3.4: View paginated, searchable list 
// Managers are allowed to view users and update non-admins
router.route('/all-users').get(isAuthenticated, authorizeRole('admin', 'manager'), getAllUser);

// Requirement 3.4: View details of a single user
router.route('/user/:userId').get(isAuthenticated, authorizeRole('admin', 'manager'), getUserDetails);

// ADMIN ONLY ROUTES
// Requirement 3.3: Only Admin can change roles or delete users
router.route('/user/update-status').patch(isAuthenticated, authorizeRole('admin'), changeStatus);

router.route('/user/delete/:userId').delete(isAuthenticated, authorizeRole('admin'), deleteUser);

export default router;