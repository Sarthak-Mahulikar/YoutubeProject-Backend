import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
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

  console.log(req.files);
  const avatarLocalPath = req.files.avatar[0].path;
  const coverImageLocalPath = req.files.coverImage[0].path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  //createing the user

  console.log("from above create user");
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
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

export { registerUser };
