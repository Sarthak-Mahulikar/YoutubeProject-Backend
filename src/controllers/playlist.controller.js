import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

//create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  try {
    const playlist = await Playlist.create({
      name: name,
      description: description,
      owner: req.user,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "playlist created sucessfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//get User Playlists
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    console.log(req.params);
    const playlists = await Playlist.find({
      owner: userId,
    });
    if (playlists.length == 0) {
      throw new ApiError(404, "playlist not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlists,
          "playlists of user retrieved sucessfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "playlistById",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          owner: 1,
          playlistById: {
            username: 1,
            email: 1,
            fullName: 1,
            avatar: 1,
            coverImage: 1,
            watchHistory: 1,
          },
        },
      },
      {
        $unwind: "$playlistById",
      },
    ]);
    if (!playlist) {
      throw new ApiError(404, "playlist not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "playlist retrieved sucessfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "video not found");
    }
    console.log(video._id);
    const checkPlaylist = await Playlist.findById(playlistId);
    if (!checkPlaylist) {
      throw new ApiError(404, "playlist not found");
    }
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $push: {
          videos: video._id,
        },
      },
      { new: true }
    );
    // await checkPlaylist.findByIdAndUpdate(
    //   playlistId,
    //   {
    //     $push: {
    //       videos: video._id,
    //     },
    //   },
    //   { new: true }
    // // );
    // const playlist = await Playlist.findById(playlistId);

    // const dataToReturn = await Playlist.findById(playlistId);
    // console.log(dataToReturn);
    return res.status(200).json(200, "video added to playlist");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  try {
    const checkPLaylist = await Playlist.findById(playlistId);
    if (!checkPLaylist) {
      throw new ApiError(404, "Playlist not found");
    }
    const video = await Video.findById(videoId);

    // Playlist.save();
    return res
      .status(200)
      .json(200, "deleted video from playlist successfully");
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
});

//update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
