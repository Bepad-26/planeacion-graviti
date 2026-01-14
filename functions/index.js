const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors')({ origin: true });

// Helper for robust JSON parsing (same as frontend)
const robustJSONParse = (text) => {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        return JSON.parse(cleanText);
    } catch (e) {
        const firstOpen = cleanText.search(/[\{\[]/);
        const lastClose = cleanText.search(/[\]\}](?!.*[\]\}])/);
        if (firstOpen !== -1 && lastClose !== -1) {
            const jsonCandidate = cleanText.substring(firstOpen, lastClose + 1);
            try {
                return JSON.parse(jsonCandidate);
            } catch (e2) {
                try {
                    const fixedJson = jsonCandidate.replace(/(?<!\\)\n/g, "\\n");
                    return JSON.parse(fixedJson);
                } catch (e3) {
                    throw new Error(`Failed to parse JSON: ${e.message}`);
                }
            }
        }
        throw new Error('No valid JSON found in response.');
    }
};

exports.processCurriculum = onRequest({ cors: true, secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
    // Enable CORS manually if needed, though {cors: true} option usually handles it
    cors(req, res, async () => {
        try {
            const { text } = req.body;

            if (!text) {
                res.status(400).json({ error: "Missing 'text' in request body" });
                return;
            }

            // Access the API key securely from Cloud Secret Manager
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                logger.error("GEMINI_API_KEY not found in environment variables");
                res.status(500).json({ error: "Server configuration error" });
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const prompt = `
            Actúa como un experto en educación y planificación curricular. Analiza el siguiente texto extraído de un PDF de planificación escolar y genera un JSON estructurado.

            TEXTO DEL PDF:
            "${text.substring(0, 100000)}" 

            OBJETIVO:
            Extraer el plan de estudios completo. Si el PDF contiene múltiples grados (ej: 2º, 3º, 4º, 5º), genera un ARRAY de objetos JSON, uno por cada grado. Si es un solo grado, genera un solo objeto.

            ESTRUCTURA JSON REQUERIDA (Ejemplo para múltiples grados):
            [
                {
                    "grade": "2º",
                    "trimesters": [ ... ]
                },
                {
                    "grade": "3º",
                    "trimesters": [ ... ]
                }
            ]

            ESTRUCTURA JSON REQUERIDA (Ejemplo para un solo grado):
            {
                "grade": "2º",
                "trimesters": [
                    {
                        "title": "Trimestre 1",
                        "weeks": [
                            {
                                "week": 1,
                                "title": "Tema de la semana",
                                "dateRange": "YYYY-MM-DD to YYYY-MM-DD",
                                "schedule": {
                                    "Monday": ["Materia 1", ...],
                                    "Tuesday": ["Materia 1", ...],
                                    "Wednesday": [...],
                                    "Thursday": [...],
                                    "Friday": [...]
                                },
                                "class1": "Resumen actividad principal",
                                "class2": "Resumen actividad secundaria"
                            }
                        ],
                        "concepts": "Resumen de conceptos clave",
                        "project": "Nombre del proyecto",
                        "evaluation": "Criterios de evaluación"
                    }
                ]
            }

            REGLAS CRÍTICAS DE FORMATO:
            1. **VALID JSON**: Asegúrate de que el JSON sea perfectamente válido.
            2. **ESCAPAR CARACTERES**: Escapa todas las comillas dobles dentro de los valores de cadena.
            3. **SIN COMENTARIOS**: No incluyas comentarios // en el JSON final.
            4. **MÚLTIPLES GRADOS**: Si detectas más de un grado, DEVUELVE UN ARRAY.
            5. **FECHAS**: Debes generar un \`dateRange\` válido para CADA semana.
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors')({ origin: true });

// Helper for robust JSON parsing (same as frontend)
const robustJSONParse = (text) => {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        return JSON.parse(cleanText);
    } catch (e) {
        const firstOpen = cleanText.search(/[\{\[]/);
        const lastClose = cleanText.search(/[\]\}](?!.*[\]\}])/);
        if (firstOpen !== -1 && lastClose !== -1) {
            const jsonCandidate = cleanText.substring(firstOpen, lastClose + 1);
            try {
                return JSON.parse(jsonCandidate);
            } catch (e2) {
                try {
                    const fixedJson = jsonCandidate.replace(/(?<!\\)\n/g, "\\n");
                    return JSON.parse(fixedJson);
                } catch (e3) {
                    throw new Error(`Failed to parse JSON: ${ e.message } `);
                }
            }
        }
        throw new Error('No valid JSON found in response.');
    }
};

exports.processCurriculum = onRequest({ cors: true, secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
    // Enable CORS manually if needed, though {cors: true} option usually handles it
    cors(req, res, async () => {
        try {
            const { text } = req.body;

            if (!text) {
                res.status(400).json({ error: "Missing 'text' in request body" });
                return;
            }

            // Access the API key securely from Cloud Secret Manager
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                logger.error("GEMINI_API_KEY not found in environment variables");
                res.status(500).json({ error: "Server configuration error" });
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const prompt = `
            Actúa como un experto en educación y planificación curricular.Analiza el siguiente texto extraído de un PDF de planificación escolar y genera un JSON estructurado.

            TEXTO DEL PDF:
            "${text.substring(0, 100000)}"

            OBJETIVO:
            Extraer el plan de estudios completo.Si el PDF contiene múltiples grados(ej: 2º, 3º, 4º, 5º), genera un ARRAY de objetos JSON, uno por cada grado.Si es un solo grado, genera un solo objeto.

            ESTRUCTURA JSON REQUERIDA(Ejemplo para múltiples grados):
            [
                {
                    "grade": "2º",
                    "trimesters": [... ]
                },
                {
                    "grade": "3º",
                    "trimesters": [... ]
                }
            ]

            ESTRUCTURA JSON REQUERIDA(Ejemplo para un solo grado):
            {
                "grade": "2º",
                    "trimesters": [
                        {
                            "title": "Trimestre 1",
                            "weeks": [
                                {
                                    "week": 1,
                                    "title": "Tema de la semana",
                                    "dateRange": "YYYY-MM-DD to YYYY-MM-DD",
                                    "schedule": {
                                        "Monday": ["Materia 1", ...],
                                        "Tuesday": ["Materia 1", ...],
                                        "Wednesday": [...],
                                        "Thursday": [...],
                                        "Friday": [...]
                                    },
                                    "class1": "Resumen actividad principal",
                                    "class2": "Resumen actividad secundaria"
                                }
                            ],
                            "concepts": "Resumen de conceptos clave",
                            "project": "Nombre del proyecto",
                            "evaluation": "Criterios de evaluación"
                        }
                    ]
            }

            REGLAS CRÍTICAS DE FORMATO:
            1. ** VALID JSON **: Asegúrate de que el JSON sea perfectamente válido.
            2. ** ESCAPAR CARACTERES **: Escapa todas las comillas dobles dentro de los valores de cadena.
            3. ** SIN COMENTARIOS **: No incluyas comentarios // en el JSON final.
            4. ** MÚLTIPLES GRADOS **: Si detectas más de un grado, DEVUELVE UN ARRAY.
            5. ** FECHAS **: Debes generar un `dateRange` válido para CADA semana.
            6. ** HORARIO **: El campo `schedule` es OBLIGATORIO.
            7. Devuelve SOLO el JSON.
            `;

            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();

            logger.info("AI Response received");

            const structuredData = robustJSONParse(responseText);
            res.json(structuredData);

        } catch (error) {
            logger.error("Error processing curriculum", error);
            res.status(500).json({ error: error.message });
        }
    });
});

exports.processStudentList = onRequest({ cors: true, secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
    cors(req, res, async () => {
        try {
            const { jsonData } = req.body;
            
            if (!jsonData) {
                res.status(400).json({ error: "Missing 'jsonData' in request body" });
                return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                res.status(500).json({ error: "Server configuration error" });
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const prompt = `
            Actúa como un experto en procesamiento de datos.Analiza el siguiente array de datos JSON que proviene de un archivo Excel con una lista de alumnos.

                Datos:
            ${ JSON.stringify(jsonData).substring(0, 30000) }

            Tu tarea es extraer los nombres de los alumnos y organizarlos por grado y grupo.
            Identifica columnas que parezcan nombres(ej: "Nombre", "Alumno", "Name"), grados(ej: "Grado", "Grade", "2") y grupos(ej: "Grupo", "A", "B").
            
            Si no encuentras grado / grupo explícito, trata de inferirlo o agrúpalos en "General".
            
            Devuelve un JSON con esta estructura EXACTA:
            {
                "2A": ["Nombre Alumno 1", "Nombre Alumno 2"],
                    "2B": ["Nombre Alumno 3", ...],
                        "3A": [...]
            }
            
            Usa claves como "2A", "3B", "4A", etc.Normaliza los nombres(Capitalize).
            Solo devuelve el JSON válido.
            `;

            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            const structuredData = robustJSONParse(responseText);
            res.json(structuredData);

        } catch (error) {
            logger.error("Error processing student list", error);
            res.status(500).json({ error: error.message });
        }
    });
});

exports.processText = onRequest({ cors: true, secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
    cors(req, res, async () => {
        try {
            const { text, action } = req.body;
            
            if (!text || !action) {
                res.status(400).json({ error: "Missing 'text' or 'action' in request body" });
                return;
            }

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                res.status(500).json({ error: "Server configuration error" });
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            let prompt = '';
            switch (action) {
                case 'summarize':
                    prompt = `Actúa como un asistente educativo.Resume el siguiente texto de manera concisa y clara: \n\n"${text}"`;
                    break;
                case 'correct':
                    prompt = `Actúa como un editor profesional.Corrige la ortografía y gramática del siguiente texto, manteniendo el tono original: \n\n"${text}"`;
                    break;
                case 'expand':
                    prompt = `Actúa como un asistente creativo.Expande las siguientes ideas con detalles relevantes y sugerencias prácticas para un contexto educativo: \n\n"${text}"`;
                    break;
                default:
                    res.status(400).json({ error: "Invalid action" });
                    return;
            }

            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            res.json({ result: responseText });

        } catch (error) {
            logger.error("Error processing text", error);
            res.status(500).json({ error: error.message });
        }
    });
});
