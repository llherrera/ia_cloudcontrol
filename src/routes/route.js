const express = require("express");
const apiController = require("../controllers/apiController");
const router = express.Router();

router
.post("/test", apiController.Test)
.post("/transform-data", apiController.TransformData)
.post("/upload-file", apiController.UploadFile)
.get("/list-files", apiController.ListFiles)
.get("/retrieve-file", apiController.RetrieveFile)
.delete("/delete-file", apiController.DeleteFile)
.post("/create-fine-tune", apiController.CreateFineTune)
.get("/list-fine-tune", apiController.ListFineTune)
.get("/retrieve-fine-tune", apiController.RetrieveFineTune)
.post("/cancel-fine-tune", apiController.CancelFineTune)
.delete("/delete-model-fine-tune", apiController.DeleteModelFineTune)
.get("/get-message", apiController.GetMessage)

module.exports = router;