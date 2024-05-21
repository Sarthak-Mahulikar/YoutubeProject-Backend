import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
// import multer from "multer";
// const storage = multer.memoryStorage(); // Store data in memory
// const upload = multer({ storage: storage });
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);

router.route("/createPlaylist").post(upload.none(), createPlaylist);

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router
  .route("/add/:videoId/:playlistId")
  .patch(upload.none(), addVideoToPlaylist);

router
  .route("/remove/:videoId/:playlistId")
  .patch(upload.none(), removeVideoFromPlaylist);

router.route("/user/:userId").patch(upload.none(), getUserPlaylists);

export default router;
