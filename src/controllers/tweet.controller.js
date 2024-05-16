import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a new tweet
const createTweet = asyncHandler(async (req, res) => {
  // create a new tweet
});

//get User Tweets
const getUserTweets = asyncHandler(async (req, res) => {
  //get user Tweets
});

//update A Tweet
const updateTweet = asyncHandler(async (req, res) => {
  //update a tweet
});

//delete a Tweet
const deleteTweet = asyncHandler(async (req, res) => {
  //delete a Tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
