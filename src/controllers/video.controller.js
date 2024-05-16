import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

//Fetch all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

//publish a Video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
});

//get video by Id
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

//Update a Video
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
});

//delete a Video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

//toggle publish video status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
