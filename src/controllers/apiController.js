import * as fileService from "../services/file/fileService";
import * as fineTuneService from "../services/file/fineTuneServices";
import * as openaiService from "../services/file/openAIService";

export async function Test(req, res) {
    res.send("test ok");
}

export async function TransformData(req, res) {
    await fileService.TransformData();
    res.send();
}

//#region File
export async function UploadFile(req, res) {
    const response = await fileService.UploadFile();
    console.log(response)
    console.log("hola")
    res.send(response);
}

export async function ListFiles(req, res) {
    const response = await fileService.ListFiles();
    console.log(response)
    res.send(response);
}

export async function RetrieveFile(req, res) {
    var fileId = req.query["fileId"];
    const response = await fileService.RetrieveFile(fileId);
    if (response == "fileId not found")
        res.status(404).send(response);

    res.status(response.status).send(response.data);

}

export async function DeleteFile(req, res) {
    var fileId = req.query["fileId"];
    const response = await fileService.DeleteFile(fileId);
    if (response == "fileId not found")
        res.status(404).send(response);

    res.send(response);

}
//#endregion

//#region FineTune
export async function CreateFineTune(req, res) {
    var fileId = req.query["fileId"];
    const response = await fineTuneService.CreateFineTune(fileId);
    console.log(response)
    res.send(response);
}

export async function ListFineTune(req, res) {
    const response = await fineTuneService.ListFineTune();
    res.send(response);
}

export async function RetrieveFineTune(req, res) {
    var fineTuneId = req.query["fineTuneId"];
    const response = await fineTuneService.RetrieveFineTune(fineTuneId);
    res.status(response.status).send(response.data);
}

export async function CancelFineTune(req, res) {
    var fineTuneId = req.query["fineTuneId"];
    const response = await fineTuneService.CancelFineTune(fineTuneId);
    res.status(response.status).send(response.data);
}

export async function DeleteModelFineTune(req, res) {
    var model = req.query["model"];
    const response = await fineTuneService.DeleteModelFineTune(model);
    res.status(response.status).send(response.data);
}

//#endregion

export async function GetMessage(req, res) {
    var message = req.query["message"];
    const response = await openaiService.GetMessage(message);
    res.send(response);
}
