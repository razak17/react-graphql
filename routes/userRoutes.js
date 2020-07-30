const express = require("express");
const cloudinary = require("cloudinary");
const { authCheck, authCheckMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", authCheck, (req, res) => {
  res.json({
    data: "you hit the endpoint.",
  });
});

router.post("/image-upload", authCheckMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.body.image,
    (result) => {
      const { secure_url, public_id } = result;
      res.send({
        url: secure_url,
        public_id,
      });
    },
    {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    }
  );
});

router.post("/image-remove", authCheckMiddleware, (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error)
      return res.json({
        sucess: false,
        message: error,
      });
    res.send("ok");
  });
});

module.exports = router;
