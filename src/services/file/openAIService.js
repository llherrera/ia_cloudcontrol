// const {Configuration, OpenAIApi} = require("openai");
// const configuration = new Configuration({apiKey: "..."});
// const openai = new OpenAIApi(configuration);
const OpenAI = require('openai');
// const openai = new OpenAIApi(configuration);
const openai = new OpenAI({
    apiKey: "..."
});
async function GetMessage(message) {
    try {
        const response = await openai.createCompletion({
            model: "davinci:ft-personal:question-answer-01-2023-05-01-22-10-08",
            prompt: message,
            max_tokens: 50,
            temperature: 0,
            stop: "END"
        });
        if (response.status == 200 && response.data.choices.length > 0)
            return response.data.choices[0].text;

        return "Lo siento, ocurrió un problema, inténtalo más tarde.";
    } catch (e) {
        return "Lo siento, ocurrió un problema, inténtalo más tarde.";
    }
}

module.exports = {
    GetMessage
}