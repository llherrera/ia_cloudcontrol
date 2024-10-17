import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENAI
});

const chatExamples = [
    {
        "role": "system", 
        "content": "Cloud-i es un chat corporativo para generar informes."
    }, {
        "role": "user", 
        "content": "Seleccionar las 5 ejecuciones físicas con mayor valor ejecutado en el año 2024. Para el plan con id: 6031. Si te menciono meta o metas productos tienes que traer la información de dicha meta y mostrar obligatoriamente el código de la meta, tambien devuelve el responsablie del nodo unidad."
    }, {
        "role": "assistant",
        "content": "'original_query': 'Seleccionar las 5 ejecuciones físicas con mayor valor ejecutado en el año 2024', 'sql_query': 'SELECT TOP 5 UN.code, UN.responsible, UNY.physical_execution FROM Unit_node UN JOIN Unit_node_year UNY ON UN.code = UNY.code WHERE UNY.year = '2024' AND UNY.physical_programming > 0 AND UN.id_plan = 6031 ORDER BY (UNY.physical_execution / UNY.physical_programming) DESC;'"
    }, {
        "role": "user", 
        "content": "Seleccionar la mayor ejecución financiera entre todos los años.para el plan con id: 6031.Si te menciono meta o metas productos tienes que traer la información de dicha meta y mostrar obligatoriamente el código de la meta, tambien devuelve el responsablie del nodo unidad."
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Seleccionar la mayor ejecución financiera entre todos los años', 'sql_query': 'SELECT TOP 1 UN.id_node, UN.description, UN.responsible, UNY.financial_execution FROM Unit_node UN JOIN Unit_node_year UNY ON UN.code = UNY.code WHERE UNY.year = (SELECT MAX(year) FROM Unit_node_year) AND UN.id_plan = 6031 ORDER BY UNY.financial_execution DESC;'"
    }, {
        "role": "user", 
        "content": "Seleccionar la secretaría que tenga menos ejecutado financieramente en el año 2025. Para el plan con id: 6031. Si te menciono meta o metas productos tienes que traer la información de dicha meta y mostrar obligatoriamente el código de la meta, tambien devuelve el responsablie del nodo unidad."
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Seleccionar la secretaría que tenga menos ejecutado financieramente en el año 2025', 'sql_query': 'SELECT TOP 1 s.name AS SecretaryName, un.code AS UnitNodeCode, un.responsible AS ResponsibleName, un.goal, (UNY.financial_execution / NULLIF(UNY.physical_programming, 0)) AS ExecutionPercentage FROM Unit_node un INNER JOIN Unit_node_year UNY ON un.code = UNY.code INNER JOIN Secretaries s ON s.name = un.responsible WHERE UNY.year = '2025' AND un.id_plan = 6031 ORDER BY UNY.financial_execution ASC;'"
    }, {
        "role": "user", 
        "content": "Mostrar la evidencia al máximo de con ejecución financiera. para el plan con id: 6031. Si te menciono meta o metas productos tienes que traer la información de dicha meta y mostrar obligatoriamente el código de la meta, tambien devuelve el responsablie del nodo unidad."
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Mostrar la evidencia al máximo de con ejecución financiera. para el plan con id: 6031.', 'sql_query': 'SELECT TOP 1 e.*, un.code AS unit_node_code, un.responsible AS unit_node_responsible FROM Evidences e INNER JOIN Unit_node un ON e.id_plan = un.id_plan WHERE e.executed_resources > 0 AND e.amount > 0 AND e.id_plan = 6031 ORDER BY e.executed_resources DESC;' "
    }, {
        "role": "user", 
        "content": "Seleccionar la localidad al mínimo de con ejecución física para el plan con id: 6031."
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Seleccionar la localidad al mínimo de con ejecución física para el plan con id: 6031.', 'sql_query': ' SELECT TOP 1 el.neighborhood, el.amount, el.executed_resources, un.code AS unit_code, un.responsible  FROM Evidences AS el  JOIN Unit_node AS un ON el.activitiesDesc = un.description  WHERE el.amount > 0 AND el.id_plan = 6031  ORDER BY el.amount DESC;' "
    }, {
        "role": "user", 
        "content": "Obtener los niveles, y nombres de estos, a los que pertenece la meta con id 9827.1.2.1.3.1"
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Obtener los niveles, y nombres de estos, a los que pertenece la meta con id 9827.1.2.1.3.1', 'sql_query': 'SELECT n.name AS nodo, l.name AS nivel FROM Nodes AS n JOIN Levels AS l ON l.id_level = n.id_level WHERE @id_node LIKE n.id_node+'%';'"
    }, {
        "role": "user", 
        "content": "Obtener las evidencias para la meta con código C.1.1.1.1.1.1 para el plan 6031"
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Obtener las evidencias para la meta con código C.1.1.1.1.1.1 para el plan 6031', 'sql_query': 'SELECT * FROM Evidences WHERE code = 'C.1.1.1.1.1.1' AND id_plan = 6031' "
    }, {
        "role": "user", 
        "content": "Obtener la ejecución física y programación de la meta 9284.1.1.1.1.4 para el año 2024"
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Obtener la ejecución física y programación de la meta 9284.1.1.1.1.4 para el año 2024', 'sql_query': ' SELECT Unit_node_year.physical_programming, Unit_node_year.physical_execution FROM Unit_node_year JOIN ( SELECT id_node, code FROM Unit_node WHERE id_node = '9284.1.1.1.1.4' ) as NodeCode ON NodeCode.id_node = Unit_node_year.id_node and '2024-01-01' = Unit_node_year.year'"
    }, {
        "role": "user", 
        "content": "Obtener las metas, y a donde pertenecen estas, de la secretaría de educación donde sea responsable. para el plan 6031"
    }, {
        "role": "assistant", 
        "content": "'original_query': 'Obtener las metas, y a donde pertenecen estas, de la secretaría de educación donde sea responsable. para el plan 6031', 'sql_query': 'SELECT nod.name, nod.id_node, nod.parent FROM ( SELECT un.responsible, un.id_node, nod.name, nod.parent FROM dbo.Nodes as nod JOIN dbo.Unit_node as un ON un.id_node = nod.id_node WHERE un.responsible = 'Secretaría de Educación' AND un.id_plan = 6031 ) AS res JOIN dbo.Nodes AS nod ON res.id_node LIKE nod.id_node+'.%' GROUP BY nod.name, nod.id_node, nod.parent UNION SELECT nod.name, un.id_node, nod.parent FROM dbo.Nodes AS nod JOIN dbo.Unit_node AS un ON un.id_node = nod.id_node WHERE un.responsible = 'Secretaría de Educación' AND un.id_plan = 6031 ORDER BY id_node'"
    }, {
        "role": "user",
        "content": "Secretaría con menor ejecución financiera mayor a cero"
    }, {
        "role": "assistant",
        "content": "'original_query': 'Secretaría con menor ejecución financiera mayor a cero' , 'sql_query': ' SELECT TOP 1 s.name AS SecretaryName, un.responsible AS ResponsibleName, SUM(UNY.financial_execution) AS TotalFinancialExecution FROM Unit_node un INNER JOIN Unit_node_year UNY ON un.code = UNY.code INNER JOIN Secretaries s ON s.name = un.responsible WHERE UNY.financial_execution > 0 AND un.id_plan = 6031 GROUP BY s.name, un.responsible ORDER BY TotalFinancialExecution ASC; '"
    }, {
        "role": "user",
        "content": "Seleccionar las 5 primeras ejecuciones ordenadas de mayor a menor en el 2024"
    }, {
        "role": "assistant",
        "content": "'original_query': 'Seleccionar las 5 primeras ejecuciones ordenadas de mayor a menor en el 2024' , 'sql_query': ' SELECT TOP 5 UN.code, UN.responsible, UNY.physical_execution, UNY.physical_programming FROM Unit_node UN JOIN Unit_node_year UNY ON UN.code = UNY.code WHERE UNY.year = '2024' AND UN.id_plan = 6031 AND UNY.physical_programming > 0 ORDER BY UNY.physical_execution DESC; '"
    }, {
        "role": "user",
        "content": "Seleccionar las 10 primeras ejecuciones ordenadas de mayor a menor"
    }, {
        "role": "assistant",
        "content": "'original_query': 'Seleccionar las 10 primeras ejecuciones ordenadas de mayor a menor' , 'sql_query': ' SELECT TOP 10 (UNY.physical_execution/UNY.physical_programming) as Percent_executed, UNY.*, UN.code AS unit_node_code FROM Unit_node_year UNY JOIN Unit_node UN ON UN.code = UNY.code WHERE UN.id_plan = 6031 AND UNY.physical_programming > 0 ORDER BY Percent_executed DESC; '"
    }, {
        "role": "user",
        "content": "Seleccionar las 10 primeras ejecuciones ordenadas de menor a mayor"
    }, {
        "role": "assistant",
        "content": "'original_query': 'Seleccionar las 10 primeras ejecuciones ordenadas de menor a mayor' , 'sql_query': ' SELECT TOP 10 (UNY.physical_execution/UNY.physical_programming) as Percent_executed, UNY.* FROM Unit_node_year UNY JOIN Unit_node UN ON UN.code = UNY.code WHERE UN.id_plan = 6031 AND uny.physical_programming > 0 AND uny.physical_execution > 0 ORDER BY Percent_executed ASC; '"
    }, {
        "role": "user",
        "content": "Seleccionar las 10 primeras ejecuciones financieras ordenadas de mayor a menor en el 2025"
    }, {
        "role": "assistant",
        "content": "'original_query': 'Seleccionar las 10 primeras ejecuciones financieras ordenadas de mayor a menor en el 2025' , 'sql_query': ' SELECT TOP 10 UN.code, UN.responsible, UNY.financial_execution FROM Unit_node UN JOIN Unit_node_year UNY ON UN.code = UNY.code WHERE UNY.year = '2025' AND UN.id_plan = 6031 AND UNY.financial_execution > 0 ORDER BY UNY.financial_execution DESC; '"
    }, {
        "role": "user",
        "content": "Seleccionar todas las ejecuciones no por año de la secretaría de las TIC"
    }, {
        "role": "assistant",
        "content": "'original_query': 'Seleccionar todas las ejecuciones no por año de la secretaría de las TIC' , 'sql_query': ' select * from Unit_node un where un.responsible = 'secretaría de las TIC' and un.id_plan = 6031 '"
    }
]

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
        - id_node (nvarchar(255))
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
        Si se pide valores mínimos, condicionar los valores a mayores que 0, porque los valores 0 se desprecian.
        Metas de producto = Nodo Unidad (Unit_node), ejecuciones de metas = Unit_node_year. Recuerda cuando se habla de mayor ejecución se debe hacer la operación de porcentaje (physical_execution / physical_programming) de ejecución y NO se multiplica por 100.
        Secretaría = Responsable de Nodo unidad. 
        Ten en cuenta que cuando hablamos de secretarias, para la tabla Unit_node nos referimos a los responsables de las Unit_node (metas). Por lo tanto, la relación de tablas es a través de la columna responsable de la tabla Unit_node y no de la columna id_plan, la tabla Secretaries tiene la columna Name que coincide con la columna Responsible de Unit_node. La relación también se puede hacer utilizando el nombre en la tabla secretarias y el responsable.
        Para la tabla de evidencias, la columna 'Unidad' hace referencia a la unidad de medida. 
        Cuando se quiera acceder a las ejecuciones de las evidencias la columna 'Amount' es la ejecución física y columna 'executed_resources' a la ejecución financiera. Cuando se quiere información de las ejecuciones en las localidades se busca en la tabla de evidencias en las columnas 'commune' o 'neighborhood'.
        IMPORTANTE: Para realizar respuestas mas completas, cuando se trate de metas (Unit_node) regresa la información de los nodos seleccionados. Si se trata de evidencias (evidences) regresa la información de las evidencias seleccionadas. Si se trata de ejecuciones (Unit_node_year), ten encuenta que las ejecuciones están asociadas a un nodo o meta de producto.
    `;
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: {"type": "json_object"},
            messages: [
                {"role": "system", "content": system_message},
                {"role": "system", "content": system_info},
                ...chatExamples,
                ...messages,
            ],
            temperature: 1,
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
        Dada la pregunta de un usuario y la respuesta de las filas SQL de la base de datos de la que el usuario desea obtener la respuesta.
        En todos los casos, omitir mostrar el dato del ID del plan.
        Escriba una respuesta en un objeto JSON con 2 propiedades: HTML y OPTIONS.
        En la propiedad HTML se da respuesta a la pregunta del usuario utilizando etiquetas de contenido HTML, procura dar respuestas amplias y usando la información de las tablas. Si la respuesta incluye gráficos, se añade una etiqueta div con el id='chart-replace' ademas de la descripción del gráfico, sino no.
        En la propiedad OPTIONS si la respuesta incluye gráficos, se escribe JSON las opciones de configuración del gráfico para HighchartsReact. De lo contrario el valor es 'NULL'.
        Recuerda que para las veces que se pida un grafico de porcentajes, usa los valores de los porcentajes.
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
        //console.log(278, response.choices[0].message.content);
        if (response.choices.length > 0)
            return response.choices[0].message.content;

        throw new Error("Lo siento, ocurrió un problema, inténtalo más tarde.");
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function AmperDoQuestionToQuery(messages) {
    const system_message = ``;
    const system_info = ``;
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: {"type": "json_object"},
            messages: [
                {"role": "system", "content": system_message},
                {"role": "system", "content": system_info},
                ...chatExamples,
                ...messages,
            ],
            temperature: 1,
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

async function AmperBuildResponse(data, msg) {
    const human_res = `
        <user_question>{{
            ${msg}
        }}</user_question>
        <sql_response>{
            data: {${data}}
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
        if (response.choices.length > 0)
            return response.choices[0].message.content;

        throw new Error("Lo siento, ocurrió un problema, inténtalo más tarde.");
    } catch (error) {
        console.log(e);
        throw e;
    }
}

export {
    GetMessage,
    DoQuestionToQuery,
    BuildResponse,
    AmperDoQuestionToQuery,
    AmperBuildResponse
}