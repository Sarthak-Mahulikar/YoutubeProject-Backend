import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
} from "../controllers/like.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(upload.none(), toggleVideoLike);
router.route("/toggle/c/:commentId").post(upload.none(), toggleCommentLike);
router.route("/toggle/t/:tweetId").post(upload.none(), toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
