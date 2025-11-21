import React, { useState } from 'react';
import { SparklesIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import { usePremium } from '../../hooks/usePremium';
import { processTextWithAI } from '../../services/aiService';

export default function AiEditorSection() {
    const { isPro, activatePro } = usePremium();
    const [note, setNote] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Tu navegador no soporta la entrada de voz. Intenta usar Chrome.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setNote(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.start();
    };

    const handleAiAction = async (action) => {
        if (!isPro) {
            setAiResult("Esta función requiere la versión Pro. ¿Deseas activarla?");
            return;
        }

        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setAiResult("Error: No has configurado tu API Key de Gemini en Ajustes.");
            return;
        }

        setIsLoading(true);
        setAiResult('');

        try {
            const result = await processTextWithAI(note, action, apiKey);
            setAiResult(result);
        } catch (error) {
            setAiResult(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cuaderno de Notas con IA</h2>
                {!isPro && (
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase">Gratis</span>
                )}
                {isPro && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase">Pro Activo</span>
                )}
            </div>

            <div className="relative">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-colors pr-12"
                    placeholder="Escribe tus notas, ideas o una comunicación para un padre de familia aquí..."
                ></textarea>
                <button
                    onClick={handleVoiceInput}
                    className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300'}`}
                    title="Dictar nota"
                >
                    <MicrophoneIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                <button
                    onClick={() => handleAiAction('summarize')}
                    disabled={!note || isLoading}
                    className="flex items-center gap-1 bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 text-sm disabled:opacity-50 transition-colors"
                >
                    <SparklesIcon className="w-4 h-4" /> Resumir
                </button>
                <button
                    onClick={() => handleAiAction('correct')}
                    disabled={!note || isLoading}
                    className="flex items-center gap-1 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 text-sm disabled:opacity-50 transition-colors"
                >
                    <SparklesIcon className="w-4 h-4" /> Corregir
                </button>
                <button
                    onClick={() => handleAiAction('expand')}
                    disabled={!note || isLoading}
                    className="flex items-center gap-1 bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-700 text-sm disabled:opacity-50 transition-colors"
                >
                    <SparklesIcon className="w-4 h-4" /> Expandir
                </button>
            </div>

            {(aiResult || isLoading) && (
                <div className="mt-4 p-4 bg-stone-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 min-h-[50px] border border-stone-200 dark:border-gray-700">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-amber-600 rounded-full border-t-transparent"></div>
                            <span>Procesando con IA...</span>
                        </div>
                    ) : (
                        <div>
                            <p>{aiResult}</p>
                            {aiResult.includes('requiere la versión Pro') && (
                                <button
                                    onClick={activatePro}
                                    className="mt-2 text-amber-600 font-bold hover:underline"
                                >
                                    Activar Pro (Simulación)
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
