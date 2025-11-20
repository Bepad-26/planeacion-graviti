import { GoogleGenerativeAI } from '@google/generative-ai';

export const processCurriculumWithAI = async (text, apiKey) => {
  if (!apiKey) throw new Error('API Key no proporcionada');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Actúa como un experto en educación y estructuración de datos. Analiza el siguiente texto extraído de un plan de estudios (PDF) y extrae la información para estructurarla en un formato JSON específico.

    El texto es:
    ${text.substring(0, 30000)} // Limit length to avoid token limits if PDF is huge

    Necesito que generes un JSON con la siguiente estructura EXACTA para un grado escolar (si hay varios, elige el principal o el primero que encuentres, o trata de inferir si es para 2, 3, 4 o 5 grado). Si no encuentras información específica, usa "Pendiente" o textos genéricos.

    Estructura JSON requerida:
    {
      "grade": "Xº", // Ejemplo: 2º, 3º
      "title": "Título del Grado",
      "description": "Descripción general del curso",
      "trimesters": [
        {
          "title": "Nombre del Trimestre 1",
          "theme": "Tema principal",
          "concepts": "Conceptos clave",
          "project": "Nombre del proyecto",
          "evaluation": "Criterios de evaluación",
          "weeks": [
            { 
              "week": "Semana 1", 
              "dateRange": "YYYY-MM-DD to YYYY-MM-DD", // INTENTA EXTRAER EL RANGO DE FECHAS SI EXISTE. Si no, usa null.
              "class1": "Tema clase 1", 
              "class2": "Tema clase 2" 
            },
            // ... resto de semanas
          ]
        }
        // ... resto de trimestres
      ]
    }

    Solo devuelve el JSON válido, sin bloques de código markdown ni texto adicional. Trata de inferir el año actual (2024-2025) para las fechas.
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
