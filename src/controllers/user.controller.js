import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

//generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    // console.log("access token: " + accessToken);
    const refreshToken = user.generateRefreshToken();
    // console.log(refreshToken);
    user.refreshToken = refreshToken;
    // console.log(user.refreshToken);
    // await user.save({ validateBeforeSave: false });
    // console.log(user);
    // await user.save();
    try {
      user.save();
    } catch (error) {
      throw new ApiError(500, error.message);
    }

    console.log("after saving ");
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      // "something went wrong while generating access and refresh token"
      error.message
    );
  }
};

//Register user method
const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation -not empty
  //check if user already exists-email,username
  //check for images,avtar
  //upload them to cloudinary
  //create user object-create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return res

  const { fullName, email, username, password } = req.body;
  console.log(fullName, email, username);
  // if (fullName === "") {
  //   throw new apiError(400, "Full Name is required");
  // }

  //checking for empty fields from input
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("djfsbanj");
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // console.log(req.files);
  // const avatarLocalPath = req.files.avatar[0].path;
  // const coverImageLocalPath = req.files.coverImage[0].path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // if (!avatar) {
  //   throw new ApiError(400, "Avatar is required");
  // }
  //createing the user

  console.log("from above create user");
  const user = await User.create({
    fullName,
    // avatar: avatar.url,
    // coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });
  console.log("bfhdsbfjksha");
  //checking created user
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //if user is not created due to any issue then throwing the error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "USER REGISTERED SUCCESSFULLY"));
});

//login method below
const loginUser = asyncHandler(async (req, res) => {
  //req body data
  //username or email
  //find the user
  //password check
  // access and refresh token
  //send cookie
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  console.log("dfjsbfjdsbj");
  console.log(user._id);
  //getting access token and refresh token
  var { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  console.log("Refresh token" + refreshToken);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("logged in" + loggedInUser);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(new ApiResponse(200, {}, "User Logged out successfully"));
});

//Refresh users access token method
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refresh_token || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed Sucessfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

//change password of user
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password Changed Sucessfully"));
});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(200, req.user, "current user fetched successfully");
});

//update account method

const updateAccount = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "account details updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccount,
};
