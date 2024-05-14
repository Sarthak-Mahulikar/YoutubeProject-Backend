import multer from "multer";

// console.log("assdasdasdasdasdad");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "/Ortigan learning/node js practice/node js course codes/youtube_project/public/temp"
    );
    // console.log(req);
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
