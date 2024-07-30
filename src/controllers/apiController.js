const fileService = require("../services/file/fileService");
const fineTuneService = require("../services/file/fineTuneServices");
const openaiService = require("../services/file/openAIService");

async function Test(req, res) {
    res.send("test ok");
}

async function TransformData(req, res) {
    await fileService.TransformData();
    res.send();
}

//#region File
async function UploadFile(req, res) {
    const response = await fileService.UploadFile();
    console.log(response)
    console.log("hola")
    res.send(response);
}

async function ListFiles(req, res) {
    const response = await fileService.ListFiles();
    console.log(response)
    res.send(response);
}

async function RetrieveFile(req, res) {
    var fileId = req.query["fileId"];
    const response = await fileService.RetrieveFile(fileId);
    if (response == "fileId not found")
        res.status(404).send(response);

    res.status(response.status).send(response.data);

}

async function DeleteFile(req, res) {
    var fileId = req.query["fileId"];
    const response = await fileService.DeleteFile(fileId);
    if (response == "fileId not found")
        res.status(404).send(response);

    res.send(response);

}
//#endregion

//#region FineTune
async function CreateFineTune(req, res) {
    var fileId = req.query["fileId"];
    const response = await fineTuneService.CreateFineTune(fileId);
    console.log(response)
    res.send(response);
}

async function ListFineTune(req, res) {
    const response = await fineTuneService.ListFineTune();
    res.send(response);
}

async function RetrieveFineTune(req, res) {
    var fineTuneId = req.query["fineTuneId"];
    const response = await fineTuneService.RetrieveFineTune(fineTuneId);
    res.status(response.status).send(response.data);
}

async function CancelFineTune(req, res) {
    var fineTuneId = req.query["fineTuneId"];
    const response = await fineTuneService.CancelFineTune(fineTuneId);
    res.status(response.status).send(response.data);
}

async function DeleteModelFineTune(req, res) {
    var model = req.query["model"];
    const response = await fineTuneService.DeleteModelFineTune(model);
    res.status(response.status).send(response.data);
}

//#endregion

async function GetMessage(req, res) {
    var message = req.query["message"];
    const response = await openaiService.GetMessage(message);
    res.send(response);
}

module.exports = {
    Test,
    TransformData,
    UploadFile,
    ListFiles,
    RetrieveFile,
    DeleteFile,
    CreateFineTune,
    ListFineTune,
    RetrieveFineTune,
    CancelFineTune,
    DeleteModelFineTune,
    GetMessage
}