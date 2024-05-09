import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccount,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
// console.log("hi before calling middleware");
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxcount: 1,
    },
    {
      name: "coverImage",
      maxcount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
//refresh access token route
router.route("/refresh_token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
// router.route("/login").post(login);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccount);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watchHistory").get(verifyJWT, getWatchHistory);

export default router;
