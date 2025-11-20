import { GoogleGenerativeAI } from '@google/generative-ai';

export const processCurriculumWithAI = async (text, apiKey) => {
  if (!apiKey) throw new Error('API Key no proporcionada');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Actúa como un experto en educación y planificación curricular. Analiza el siguiente texto extraído de un PDF de planificación escolar (que puede ser un calendario, una tabla o una lista) y extrae la información estructurada.

    TEXTO DEL PDF:
    "${text}"

    OBJETIVO:
    Generar un JSON válido con la estructura exacta que se describe a continuación. Debes inferir el grado escolar si es posible, si no, usa "General".
    Es CRÍTICO que extraigas el rango de fechas exacto para cada semana y el horario de clases específico para cada día si está disponible.

    ESTRUCTURA JSON REQUERIDA:
    {
        "grade": "2º", // O el grado que detectes
        "trimesters": [
            {
                "title": "Trimestre 1",
                "weeks": [
                    {
                        "week": 1,
                        "title": "Nombre del tema o proyecto de la semana",
                        "dateRange": "YYYY-MM-DD to YYYY-MM-DD", // EJEMPLO: "2025-08-25 to 2025-08-29". INFIERE EL AÑO 2024-2025.
                        "schedule": { // Horario específico detectado o inferido
                            "Monday": ["Matemáticas", "Español"],
                            "Tuesday": ["Ciencias", "Historia"],
                            "Wednesday": ["Matemáticas", "Arte"],
                            "Thursday": ["Español", "Ed. Física"],
                            "Friday": ["Repaso", "Club"]
                        },
                        "class1": "Descripción detallada de la actividad principal o Clase 1",
                        "class2": "Descripción detallada de la actividad secundaria o Clase 2"
                    }
                ]
            }
        ]
    }

    REGLAS:
    1. Si el texto menciona fechas (ej. "Semana del 26 al 30 de Agosto"), conviértelas a formato "YYYY-MM-DD to YYYY-MM-DD" asumiendo el ciclo escolar actual (2024-2025 o 2025-2026 según corresponda).
    2. Si no hay horario explícito, genera uno genérico basado en las materias mencionadas en el texto.
    3. Devuelve SOLO el JSON, sin markdown, sin bloques de código, sin texto adicional.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Improved JSON extraction: find the first '{' and the last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró un JSON válido en la respuesta de la IA.');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error processing with AI:', error);
    throw new Error('Error al procesar el plan de estudios con IA: ' + error.message);
  }
};

export const processStudentListWithAI = async (jsonData, apiKey) => {
  if (!apiKey) throw new Error('API Key no proporcionada');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Actúa como un experto en procesamiento de datos. Analiza el siguiente array de datos JSON que proviene de un archivo Excel con una lista de alumnos.
    
    Datos:
    ${JSON.stringify(jsonData).substring(0, 30000)}

    Tu tarea es extraer los nombres de los alumnos y organizarlos por grado y grupo.
    Identifica columnas que parezcan nombres (ej: "Nombre", "Alumno", "Name"), grados (ej: "Grado", "Grade", "2") y grupos (ej: "Grupo", "A", "B").
    
    Si no encuentras grado/grupo explícito, trata de inferirlo o agrúpalos en "General".
    
    Devuelve un JSON con esta estructura EXACTA:
    {
      "2A": ["Nombre Alumno 1", "Nombre Alumno 2"],
      "2B": ["Nombre Alumno 3", ...],
      "3A": [...]
    }
    
    Usa claves como "2A", "3B", "4A", etc. Normaliza los nombres (Capitalize).
    Solo devuelve el JSON válido.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró un JSON válido en la respuesta de la IA.');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error processing student list with AI:', error);
    throw new Error('Error al procesar la lista de alumnos con IA: ' + error.message);
  }
};
