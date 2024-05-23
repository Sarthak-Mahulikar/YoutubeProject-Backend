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
  const { userId } = req.params;
  const tweets = await Tweet.find({ owner: userId });
  console.log(tweets);
  if (!tweets) {
    throw new ApiError(404, "Tweet not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweet retrieved sucessfully"));
});

//update A Tweet
const updateTweet = asyncHandler(async (req, res) => {
  //update a tweet
  const { content } = req.body;
  const { tweetId } = req.params;
  console.log(tweetId);
  try {
    const tweetCheck = await Tweet.findById(tweetId);
    if (!tweetCheck) {
      throw new ApiError(404, "Tweet Not Found");
    }
    if (req.user._id.valueOf() === tweetCheck.owner._id.valueOf()) {
      const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
          $set: {
            content,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet Updated Sucessfully"));
    } else {
      throw new ApiError(401, "you are not authorized to update this tweet");
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

//delete a Tweet
const deleteTweet = asyncHandler(async (req, res) => {
  //delete a Tweet
  try {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "Tweet Not Found ");
    }
    if (tweet.owner._id.valueOf() === req.user._id.valueOf()) {
      const deleteTweet = await Tweet.findByIdAndDelete(tweetId);

      return res
        .status(200)
        .json(new ApiResponse(200, deleteTweet, "Tweet Deleted Sucessfully"));
    } else {
      throw new ApiError(401, "you are not authorized to delete this tweet");
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
