import React, { useState } from 'react';
import { SparklesIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { processTextWithAI } from '../../services/aiService';
import jsPDF from 'jspdf';

export default function ExamGenerator() {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('2º');
    const [numQuestions, setNumQuestions] = useState(5);
    const [generatedExam, setGeneratedExam] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;

        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setGeneratedExam("Error: No has configurado tu API Key de Gemini en Ajustes.");
            return;
        }

        setIsGenerating(true);
        setGeneratedExam('');

        const prompt = `Genera un examen de ${numQuestions} preguntas de opción múltiple para alumnos de ${grade} grado de primaria sobre el tema: "${topic}". 
        Incluye la clave de respuestas al final. Formato claro y listo para imprimir.`;

        try {
            // We reuse processTextWithAI but treat 'expand' as a generic generation action or add a new case if needed.
            // For simplicity, we'll use 'expand' which is close enough (creative generation) or we could update the service.
            // Let's use 'expand' for now as it prompts for creative expansion/generation.
            // Ideally, we should add a 'generate' case to aiService, but 'expand' works for "Expand on this topic by creating an exam".
            // Actually, let's just use the prompt directly via a new service method or modify the existing one.
            // Since I cannot modify aiService in this step, I will use 'expand' and prepend the instruction in the prompt passed.

            // Wait, processTextWithAI wraps the prompt. I should probably add a 'generate_exam' case to aiService for better results.
            // For this iteration, I will use 'expand' and frame the input to force the behavior.

            const result = await processTextWithAI(prompt, 'expand', apiKey);
            setGeneratedExam(result);
        } catch (error) {
            setGeneratedExam(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Examen: ${topic}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Grado: ${grade}`, 20, 30);

        const splitText = doc.splitTextToSize(generatedExam, 170);
        doc.text(splitText, 20, 40);

        doc.save(`Examen_${topic}.pdf`);
    };

    return (
        <div className="animate-fade-in pb-24 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generador de Exámenes IA</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tema del Examen</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="Ej. El Sistema Solar, Sumas y Restas..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grado</label>
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option>1º</option>
                                <option>2º</option>
                                <option>3º</option>
                                <option>4º</option>
                                <option>5º</option>
                                <option>6º</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preguntas</label>
                            <select
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="5">5 Preguntas</option>
                                <option value="10">10 Preguntas</option>
                                <option value="15">15 Preguntas</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 font-bold flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
                        ) : (
                            <SparklesIcon className="w-5 h-5" />
                        )}
                        {isGenerating ? 'Generando Examen...' : 'Generar con IA'}
                    </button>
                </div>

                {generatedExam && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Vista Previa</h3>
                            <button
                                onClick={handleDownloadPDF}
                                className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-sm font-medium"
                            >
                                <DocumentArrowDownIcon className="w-5 h-5" /> Descargar PDF
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono">
                            {generatedExam}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
