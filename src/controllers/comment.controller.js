import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

//get all comments for a video

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
  } catch (error) {
    throw new ApiError(error.message);
  }
});

//add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Couldn't find Video");
    }
    const comment = await Comment.create({
      content: content,
      video: video,
      owner: req.user,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, comment, "comment added successfully"));
  } catch (error) {
    throw new ApiError(error.message);
  }
});

//update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;
  const { content } = req.body;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Couldn't find video");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Couldn't find comment");
    }

    if (comment.owner._id.valueOf() === req.user._id.valueOf()) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $set: {
            content: content,
          },
        },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedComment, "Comment updated Successfully")
        );
    } else {
      throw new ApiError(401, "you are not authorized to update this comment");
    }
  } catch (error) {
    throw new ApiError(error.message);
  }
});

//delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "video not found");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "comment not found");
    }

    if (comment.owner._id.valueOf() === req.user._id.valueOf()) {
      console.log("inside the if of the user");
      const deleteComment = await Comment.findByIdAndDelete(commentId);
      return res
        .status(200)
        .json(
          new ApiResponse(200, deleteComment, "comment deleted successfully")
        );
    } else {
      throw new ApiError(401, "you are not authorized to delete this comment");
    }
  } catch (error) {
    throw new ApiError(error.message);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
