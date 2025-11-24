import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function for robust JSON parsing
const robustJSONParse = (text) => {
  // 1. Remove markdown code blocks
  let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn('Direct JSON parse failed, trying regex extraction...', e);
    // 2. Try to extract JSON object or array
    const jsonMatch = cleanText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        throw new Error('Failed to parse extracted JSON: ' + e2.message);
      }
    }
    throw new Error('No valid JSON found in response.');
  }
};

// Helper function for AI calls with retry
const callAIWithRetry = async (model, prompt, retries = 1) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      if (i === retries) throw error;
      console.warn(`AI call failed, retrying (${i + 1}/${retries})...`, error);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
    }
  }
};

export const processCurriculumWithAI = async (text, apiKey) => {
  if (!apiKey) throw new Error('API Key no proporcionada');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
    Actúa como un experto en educación y planificación curricular. Analiza el siguiente texto extraído de un PDF de planificación escolar y genera un JSON estructurado.

    TEXTO DEL PDF:
    "${text}"

    OBJETIVO:
    Extraer el plan de estudios completo, incluyendo rangos de fechas EXACTOS para cada semana y el horario de clases.

    ESTRUCTURA JSON REQUERIDA:
    {
        "grade": "2º", // Infiere el grado
        "trimesters": [
            {
                "title": "Trimestre 1",
                "weeks": [
                    {
                        "week": 1,
                        "title": "Tema de la semana",
                        "dateRange": "YYYY-MM-DD to YYYY-MM-DD", // CRÍTICO: Infiere el año actual (2024-2025) si no está explícito. Ej: "2025-08-25 to 2025-08-29".
                        "schedule": { // Horario DETALLADO. Si no hay horario por día, genera uno lógico basado en las materias del texto.
                            "Monday": ["Materia 1", "Materia 2", ...],
                            "Tuesday": ["Materia 1", ...],
                            "Wednesday": [...],
                            "Thursday": [...],
                            "Friday": [...]
                        },
                        "class1": "Resumen actividad principal",
                        "class2": "Resumen actividad secundaria"
                    }
                ]
            }
        ]
    }

    REGLAS CRÍTICAS:
    1. **FECHAS**: Debes generar un \`dateRange\` válido para CADA semana. Si el texto dice "Semana 1", asume que empieza en la fecha más lógica mencionada en el documento o a finales de Agosto.
    2. **HORARIO**: El campo \`schedule\` es OBLIGATORIO. Si el PDF tiene un horario general, repítelo en todas las semanas. Si varía, adáptalo. NO dejes días vacíos.
    3. **AÑO**: Si el PDF no tiene año, asume el ciclo escolar actual (2025-2026 o el que corresponda a la fecha actual).
    4. Devuelve SOLO el JSON.
  `;

  try {
    const textResponse = await callAIWithRetry(model, prompt);
    console.log('AI Raw Response (Curriculum):', textResponse);
    return robustJSONParse(textResponse);
  } catch (error) {
    console.error('Error processing curriculum with AI:', error);
    throw new Error('Error al procesar el plan de estudios con IA: ' + error.message);
  }
};

export const processStudentListWithAI = async (jsonData, apiKey) => {
  if (!apiKey) throw new Error('API Key no proporcionada');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

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
    const textResponse = await callAIWithRetry(model, prompt);
    console.log('AI Raw Response (Students):', textResponse);
    return robustJSONParse(textResponse);
  } catch (error) {
    throw new Error('Error al procesar la lista de alumnos con IA: ' + error.message);
  }
};

export const processTextWithAI = async (text, action, apiKey) => {
  if (!apiKey) throw new Error('API Key no proporcionada');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let prompt = '';
  switch (action) {
    case 'summarize':
      prompt = `Actúa como un asistente educativo. Resume el siguiente texto de manera concisa y clara:\n\n"${text}"`;
      break;
    case 'correct':
      prompt = `Actúa como un editor profesional. Corrige la ortografía y gramática del siguiente texto, manteniendo el tono original:\n\n"${text}"`;
      break;
    case 'expand':
      prompt = `Actúa como un asistente creativo. Expande las siguientes ideas con detalles relevantes y sugerencias prácticas para un contexto educativo:\n\n"${text}"`;
      break;
    default:
      throw new Error('Acción no válida');
  }

  try {
    return await callAIWithRetry(model, prompt);
  } catch (error) {
    console.error('Error processing text with AI:', error);
    throw new Error('Error al procesar texto con IA: ' + error.message);
  }
};
