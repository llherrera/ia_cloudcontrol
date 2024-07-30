import xlsx from "xlsx";
import fs from 'fs';
// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//     apiKey: "..."
// });


// const configuration = new Configuration({apiKey: ""});
// const openai = new OpenAIApi(configuration);


const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: "..."
});
async function TransformData() {
    try {
        // Leer el archivo Excel
        const workbook = xlsx.readFile("src/shared/data-set.xlsx");
        const sheetNameList = workbook.SheetNames;
        const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

        // Inicializar el archivo de salida
        await fs.writeFile("src/shared/data-set.jsonl", '', "utf8");

        // Iterar sobre los datos y escribir en el archivo JSONL
        for (const item of xlData) {
            const object = {
                messages: [
                    { "role": "system", "content": "Marv is a factual chatbot that is also sarcastic." },
                    { "role": "user", "content": item.Question },
                    { "role": "assistant", "content": item.Answer }
                ]
            };
            await fs.appendFile("src/shared/data-set.jsonl", JSON.stringify(object) + "\n", "utf8");
        }

        console.log("Datos transformados y guardados en data-set.jsonl");
    } catch (error) {
        console.error("Error al transformar los datos:", error);
    }
}

async function UploadFile() {
    const response = await openai.files.create({ file: fs.createReadStream("src/shared/data-set-copy.jsonl"), purpose: 'fine-tune' });

    return response;
}

async function ListFiles() {
    const response = await openai.files.list();
    return response;
}

async function RetrieveFile(fileId) {

    try {
        const response = await openai.retrieveFile(fileId);
        return response;
    } catch (e) {
        return "fileId not found";
    }
}

async function DeleteFile(fileId) {

    try {
        const response = await openai.files.del(fileId);
        return response;
    } catch (e) {
        return "fileId not found";
    }
}


module.exports = {
    TransformData,
    UploadFile,
    ListFiles,
    RetrieveFile,
    DeleteFile
}