// const { Configuration, OpenAIApi } = require("openai");
import OpenAI from 'openai';

// const configuration = new Configuration({ apiKey: "..." });
// const configuration = new Configuration({apiKey: "..."});
// const openai = new OpenAIApi(configuration);
const openai = new OpenAI({
    apiKey: "..."
});

async function CreateFineTune(fileId) {
    console.log("aasdasd", fileId)

    try {
        const response = await openai.fineTuning.jobs.create({
            training_file: fileId,
            model: 'gpt-3.5-turbo',
            suffix: "cloud-control"

        });


        console.log(response)
        return response;
    } catch (e) {
        return { status: 400, data: e }
    }
}


async function ListFineTune() {

    try {
        const response = await openai.fineTuning.jobs.list();
        return response;
    } catch (e) {
        return { status: 400, data: e }
    }
}

async function RetrieveFineTune(fineTuneId) {

    try {
        const response = await openai.retrieveFineTune(fineTuneId);
        return response;
    } catch (e) {
        return { status: 400, data: e }
    }
}

async function CancelFineTune(fineTuneId) {

    try {
        const response = await openai.cancelFineTune(fineTuneId);
        return response;
    } catch (e) {
        return { status: 400, data: e }
    }
}

async function DeleteModelFineTune(model) {

    try {
        const response = await openai.deleteModel(model);
        return response;
    } catch (e) {
        return { status: 400, data: e }
    }
}


export {
    CreateFineTune,
    ListFineTune,
    RetrieveFineTune,
    CancelFineTune,
    DeleteModelFineTune
}




