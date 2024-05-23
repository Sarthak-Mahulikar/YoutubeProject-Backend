import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

//Toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    const like = await Like.create({
      likedBy: req.user,
      video: video,
    });

    return res.status(201).json(201, "liked video sucessfully");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//Toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    const like = await Like.create({
      comment: comment,
      likedBy: req.user,
    });
    console.log("like object: ", like);

    return res.status(201).json(201, like, "liked comment sucessfully");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "tweet not found");
    }
    const like = await Like.create({
      tweet: tweet,
      likedBy: req.user,
    });
    return res.status(201).json(201, like, "liked tweet sucessfully");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    //NEED TO APPLY PIPELINE FOR GETTING PROPER OUTPUT

    const likedVideos = await Like.find({ likedBy: req.user }).populate({
      path: "video",
    });
    console.log(likedVideos);
    return res
      .status(200)
      .json(200, likedVideos, "liked videos retrieved sucessfully");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
