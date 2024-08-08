import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI
});

async function GetMessage(message) {
    try {
        console.log(message);
        const response = await openai.createCompletion({
            model: "ft:gpt-3.5-turbo-0125:personal::9ssGcCR1",
            prompt: message,
            max_tokens: 50,
            temperature: 0,
            stop: "END"
        });
        console.log(response.status);
        console.log(response.data.choices);
        if (response.status == 200 && response.data.choices.length > 0)
            return response.data.choices[0].text;

        return "Lo siento, ocurrió un problema, inténtalo más tarde.";
    } catch (e) {
        console.log(e);
        return "Lo siento, ocurrió un problema, inténtalo más tarde.";
    }
}

async function DoQuestionToQuery(message) {
    const system_message = `
    Given the followin schema, write a SQL query to SQL Server that retrieves the request information.
    Return the SQL query inside a JSON structure with the key "sql_query".
    <example>{{
        "sql_query": "SELECT * FROM users WHERE age > 18;"
        "original_query": "Show me all users older than 18 years old."
    }}</example>
    <schema>
    {'Table: Colorimeter\n- id_plan (int)\n- value_1 (int)\n- value_2 (int)\n- value_3 (int)\n- value_4 (int)\nTable: Evidences\n- id_evidence (int)\n- code (nvarchar(255))\n- neighborhood (nvarchar(255))\n- amount (int)\n- commune (nvarchar(255))\n- corregimiento (nvarchar(255))\n- activitiesDesc (nvarchar(255))\n- date (date)\n- date_file (date)\n- resource_font (nvarchar(255))\n- place (nvarchar(255))\n- name_file (nvarchar(255))\n- benefited_population_number (int)\n- benefited_population (nvarchar(255))\n- executed_resources (int)\n- unit (nvarchar(255))\n- vereda (nvarchar(255))\n- file_link (nvarchar(255))\n- state (int)\n- id_plan (int)\n- id_user (int)\nTable: Evidences_locations\n- id_evi_loc (int)\n- lat (float)\n- lng (float)\n- code (nvarchar(255))\n- id_evidence (int)\nTable: Levels\n- id_level (int)\n- name (nvarchar(255))\n- description (nvarchar(255))\n- id_plan (int)\nTable: Locations\n- name (nvarchar(50))\n- type (nvarchar(255))\n- lat (float)\n- lng (float)\n- id_plan (int)\n- id_location (int)\n- belongs (nvarchar(255)) \nTable: Nodes\n- id_node (nvarchar(255))\n- name (nvarchar(255))\n- description (nvarchar(255))\n- parent (nvarchar(255))\n- id_level (int)\nTable: Plan\n- id_plan (int)\n- name (nvarchar(255))\n- start_date (date)\n- end_date (date)\n- description (nvarchar(255))\n- department (nvarchar(255))\n- municipality (nvarchar(50))\n- logo_link_plan (nvarchar(255))\n- logo_link_city (nvarchar(255))\n- id_municipality (nvarchar(255))\n- deadline (nvarchar(255))\n- uuid (uniqueidentifier)\nTable: Secretaries\n- id_secretary (int)\n- name (nvarchar(255))\n- id_plan (int)\n- email (nvarchar(255))\n- phone (bigint)\nTable: Unit_node\n- id_node (nvarchar(255))\n- id_plan (int)\n- code (nvarchar(255))\n- description (nvarchar(255))\n- indicator (nvarchar(255))\n- base_line (int)\n- goal (int)\n- responsible (nvarchar(255))\n- link_hv_indicator (nvarchar(255))\nTable: Unit_node_year\n- year (date)\n- code (nvarchar(255))\n- physical_programming (float)\n- physical_execution (float)\n- financial_execution (bigint)\nTable: Users\n- id_user (int)\n- name (nvarchar(255))\n- lastname (nvarchar(255))\n- password (nvarchar(255))\n- username (nvarchar(255))\n- email (nvarchar(255))\n- rol (nvarchar(255))\n- id_plan (int)\nTable: Weights\n- id_node (nvarchar(255))\n- weight (float)'}
    </schema>
    `;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {"type": "json_object"},
            messages: [
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ],
            temperature: 1,
            max_tokens: 512,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "END"
        });
        if (response.choices.length > 0)
            return response.choices[0].message.content;

        return "Lo siento, ocurrió un problema, inténtalo más tarde.";
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function BuildResponse(data, msg) {
    const human_res = `
        Given a users question and the SQL rows response from the database from which the user wants to get the answer,
        write a response to the user's question.
        <user_question>{{
            ${msg}
        }}</user_question>
        <sql_response>{
            ${JSON.stringify(data, null, 2)}
        }</sql_response>
    `;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": human_res}
            ],
            temperature: 1,
            max_tokens: 512,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "END"
        });
        if (response.choices.length > 0)
            return response.choices[0].message.content;

        throw new Error("Lo siento, ocurrió un problema, inténtalo más tarde.");
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export {
    GetMessage,
    DoQuestionToQuery,
    BuildResponse
}