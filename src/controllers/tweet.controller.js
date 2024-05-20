import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a new tweet
const createTweet = asyncHandler(async (req, res) => {
  // create a new tweet

  const { content } = req.body;

  const tweet = await Tweet.create({
    content,
    owner: req.user,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

//get User Tweets
const getUserTweets = asyncHandler(async (req, res) => {
  //get user Tweets
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet retrieved sucessfully"));
});

//update A Tweet
const updateTweet = asyncHandler(async (req, res) => {
  //update a tweet
  const { content } = req.body;
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );
  if (!tweet) {
    throw new ApiError(404, "Tweet Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Updated Sucessfully"));
});

//delete a Tweet
const deleteTweet = asyncHandler(async (req, res) => {
  //delete a Tweet
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet Not Found ");
  }
  await tweet.delete();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Deleted Sucessfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
