import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//get all comments for a video

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

//add a comment to a video
const addComment = asyncHandler(async (req, res) => {});

//update a comment
const updateComment = asyncHandler(async (req, res) => {});

//delete a comment
const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComments, addComment, updateComment, deleteComment };
