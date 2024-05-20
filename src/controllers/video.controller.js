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
  const { title, description, duration } = req.body;
  // const { videoFile, thumbnail } = req.body;

  if ([title, description, duration].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;
  if (!videoLocalPath && !thumbnailLocalPath) {
    throw new ApiError(400, "videoFile and thumbnail required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile && !thumbnail) {
    throw new ApiError(400, "videoFile and thumbnail required");
  }

  const video = await Video.create({
    title,
    description,
    duration,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    owner: req.user,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video published sucessfully"));
});

//get video by Id
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video data retrieved sucessfully"));
});

//Update a Video
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, duration } = req.body;

  const videoCheck = await Video.findById(videoId);
  // console.log("videoCheck obj:", videoCheck);
  if (!videoCheck) {
    throw new ApiError(404, "Video Not Found");
  }
  // console.log("video check owners ID", videoCheck.owner._id);
  // console.log(req.user);
  // console.log("the if condition: ", req.user._id, "/t ", videoCheck.owner._id);

  if (req.user._id.valueOf() === videoCheck.owner._id.valueOf()) {
    // console.log("title", title);
    if (!(title || description || duration)) {
      throw new ApiError(400, "some fields are required");
    }

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
          duration,
        },
      },
      { new: true }
    );
    console.log("video data after Updation: ", video);

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video data Updated sucessfully"));
  } else {
    throw new ApiError(401, "You are not authorized to update this video");
  }
});

//delete a Video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const videoCheck = await Video.findById(videoId);
  if (!videoCheck) {
    throw new ApiError(404, "Video Not Found");
  }
  if (req.user._id.valueOf() === videoCheck.owner._id.valueOf()) {
    const video = await Video.findByIdAndDelete(videoId);
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video Deleted Sucessfully"));
  } else {
    throw new ApiError(401, "You are not authorized to delete this video");
  }
});

//toggle publish video status
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const videoCheck = await Video.findById(videoId);
  // console.log(videoCheck);

  if (!videoCheck) {
    throw new ApiError(404, "Video not found");
  }
  const publishStatus = videoCheck.isPublished;
  var video;
  if (videoCheck.owner._id.valueOf() === req.user._id.valueOf()) {
    if (publishStatus) {
      // videoCheck.isPublished = false;
      video = await Video.findByIdAndUpdate(
        videoId,
        {
          $set: {
            isPublished: false,
          },
        },
        {
          new: true,
        }
      );
    } else {
      // videoCheck.isPublished = true;
      video = await Video.findByIdAndUpdate(
        videoId,
        {
          $set: {
            isPublished: true,
          },
        },
        {
          new: true,
        }
      );
    }
  } else {
    throw new ApiError(401, "You are not authorized to toggle this video");
  }

  // console.log("hadsjkhjkahjasdh");
  return res.status(200).json(200, video, "toggled sucessfully");
});

export {
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
