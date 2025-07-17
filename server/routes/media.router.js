const express = require("express");
const { upload } = require("../middlewares/upload.middleware");
const fs = require("fs");
const path = require("path");
const mediaController = require("../controllers/media.controller");
const router = express.Router();

// Upload media route
router.post("/upload", upload.single("file"), mediaController.uploadMedia);

// Delete media route
router.delete("/delete/:filename", mediaController.deleteMedia);

module.exports = router;