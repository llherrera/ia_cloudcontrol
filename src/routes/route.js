import express from "express";
import * as apiController from "../controllers/index.js";
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
.post("/do-query", apiController.DoQuestionToQuery)
.post("/do-response", apiController.DoRowsToResponse)

export { router as ApiRouter };