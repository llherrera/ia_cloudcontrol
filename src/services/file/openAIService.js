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

async function DoQuestionToQuery(messages) {
    const system_message = `
    Dado el siguiente esquema, escriba una consulta SQL en SQL Server que recupere la información de la solicitud.
    Devuelva la consulta SQL dentro de una estructura JSON con la clave "sql_query".
    <example>{{
        "sql_query": "SELECT * FROM users WHERE age > 18;"
        "original_query": "Show me all users older than 18 years old."
    }}</example>
    <schema>
    {'Table: Colorimeter
        - id_plan (int)
        - value_1 (int)
        - value_2 (int)
        - value_3 (int)
        - value_4 (int)
    Table: Evidences
        - id_evidence (int)
        - code (nvarchar(255))
        - neighborhood (nvarchar(255))
        - amount (int)
        - commune (nvarchar(255))
        - corregimiento (nvarchar(255))
        - activitiesDesc (nvarchar(255))
        - date (date)
        - date_file (date)
        - resource_font (nvarchar(255))
        - place (nvarchar(255))
        - name_file (nvarchar(255))
        - benefited_population_number (int)
        - benefited_population (nvarchar(255))
        - executed_resources (int)
        - unit (nvarchar(255))
        - vereda (nvarchar(255))
        - file_link (nvarchar(255))
        - state (int)
        - id_plan (int)
        - id_user (int)
    Table: Evidences_locations
        - id_evi_loc (int)
        - lat (float)
        - lng (float)
        - code (nvarchar(255))
        - id_evidence (int)
    Table: Levels
        - id_level (int)
        - name (nvarchar(255))
        - description (nvarchar(255))
        - id_plan (int)
    Table: Locations
        - name (nvarchar(50))
        - type (nvarchar(255))
        - lat (float)
        - lng (float)
        - id_plan (int)
        - id_location (int)
        - belongs (nvarchar(255))
    Table: Nodes
        - id_node (nvarchar(255))
        - name (nvarchar(255))
        - description (nvarchar(255))
        - parent (nvarchar(255))
        - id_level (int)
    Table: Plan
        - id_plan (int)
        - name (nvarchar(255))
        - start_date (date)
        - end_date (date)
        - description (nvarchar(255))
        - department (nvarchar(255))
        - municipality (nvarchar(50))
        - logo_link_plan (nvarchar(255))
        - logo_link_city (nvarchar(255))
        - id_municipality (nvarchar(255))
        - deadline (nvarchar(255))
        - uuid (uniqueidentifier)
    Table: Projects
        - id_project (int)
        - BPIM (bigint)
        - entity (nvarchar(255))
        - name (nvarchar(255))
        - year (int)
        - link (nvarchar(255))
        - id_plan (int)
    Table: Secretaries
        - id_secretary (int)
        - name (nvarchar(255))
        - id_plan (int)
        - email (nvarchar(255))
        - phone (bigint)
    Table: Unit_node
        - id_node (nvarchar(255))
        - id_plan (int)
        - code (nvarchar(255))
        - description (nvarchar(255))
        - indicator (nvarchar(255))
        - base_line (int)
        - goal (int)
        - responsible (nvarchar(255))
        - link_hv_indicator (nvarchar(255))
    Table: Unit_node_year
        - year (date)
        - code (nvarchar(255))
        - physical_programming (float)
        - physical_execution (float)
        - financial_execution (bigint)
        - modified_execution (bigint)
        - modified_date (date)
        - id_user (int)
    Table: Users
        - id_user (int)
        - name (nvarchar(255))
        - lastname (nvarchar(255))
        - password (nvarchar(255))
        - username (nvarchar(255))
        - email (nvarchar(255))
        - rol (nvarchar(255))
        - id_plan (int)
    Table: Weights
        - id_node (nvarchar(255))
        - weight (float)'}
    </schema>
    `;
    const system_info = `Algunas relaciones de las tablas y columnas de la base de datos.
        No usar la sentencia LIMIT, sql server no lo usa. Solo usar TOP para seleccionar una cantidad de filas.
        Si se está buscando mínimos, solo se permitiran valores superiores a 0.
        Recuerda que para las 'Metas', o Unit_node, los valores de las ejecuciones se encuentran en la tabla Unit_node_year.
        Cuando se habla de ejecuciones se refiere a la tabla 'Unit_node' y 'Unit_node_year'.
        Ten en cuenta que cuando hablamos de secretarias, para la tabla Unit_node nos referimos a los responsables de los nodos unitarios o Unit_node (metas). Por lo tanto, la relación de tablas es a través de la columna responsable de la tabla Unit_node y no de la columna id_plan, la tabla Secretaries tiene la columna Name que coincide con la columna Responsible de Unit_node. La relación también se puede hacer utilizando el nombre en la tabla secretarias y el responsable.
        Para la tabla de evidencias, la columna 'Unidad' hace referencia a la unidad de medida. Cuando se quiera acceder a las ejecuciones de las evidencias la columna 'Amount' es la ejecución física y columna 'executed_resources' a la ejecución financiera.
        Cuando se quiere información de las ejecuciones en las localidades se busca en la tabla de evidencias en las columnas 'commune' o 'neighborhood'
    `;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {"type": "json_object"},
            messages: [
                {"role": "system", "content": system_message},
                {"role": "system", "content": system_info},
                ...messages
            ],
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "END"
        });
        //console.log(63, response.choices[0].message.content);
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
        Dada la pregunta de un usuario y la respuesta de las filas SQL de la base de datos de la que el usuario desea obtener la respuesta,
        escriba una respuesta en un objeto JSON con 2 propiedades: HTML y OPTIONS.
        En la propiedad HTML se da respuesta a la pregunta del usuario utilizando etiquetas de contenido HTML. Si la respuesta incluye gráficos, se añade una etiqueta div con el id='chart-replace', sino no.
        En la propiedad OPTIONS si la respuesta incluye gráficos, se escribe JSON las opciones de configuración del gráfico para HighchartsReact. De lo contrario el valor es 'NULL'
        <user_question>{{
            ${msg}
        }}</user_question>
        <sql_response>{
            {HTML: ${JSON.stringify(data, null, 2)} },
            {OPTIONS: {
                title: {
                    text: title
                },
                accessibility: {
                    enabled: false,
                },
                plotOptions: {
                    series: {
                        dataLabels:[{
                            enabled: true,
                            format: '{point.percentage:.1f}%',
                        }],
                    },
                    pie: {
                        dataLabels: {
                            enabled: true,
                        },
                        showInLegend: true,
                    },
                    bar: {
                        dataLabels: {
                            enabled: true,
                        },
                        groupPadding: 0.1
                    },
                },
                xAxis: {
                    categories: data.map(x => x.toString()),
                    title: {
                        text: null
                    },
                    gridLineWidth: 1,
                    lineWidth: 0,
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: null,
                    },
                    labels: {
                        overflow: 'justify',
                    },
                    gridLineWidth: 0
                },
                series: data.map((info) => {
                    const dataUse = info.map((d, i) => {
                        return {
                            name: (yearSelect === 0 && years.length === info.length) ? years[i].toString() : data[i].toString(),
                            y: d
                        }
                    })
                    return {
                        name: 'Valor en M',
                        type: type!.valueOf() as any,
                        data: dataUse,
                        size: '100%',
                        innerSize: '80%',
                        dataLabels: {
                            enabled: false,
                            crop: false,
                        }
                    }
                })
            }}
        }</sql_response>
    `;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": human_res}
            ],
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: "END"
        });
        //console.log(92, response.choices[0].message.content);
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