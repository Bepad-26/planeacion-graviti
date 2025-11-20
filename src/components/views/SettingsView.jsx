import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon, CloudArrowUpIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { extractTextFromPdf, extractDataFromExcel } from '../../utils/fileProcessor';
import { processCurriculumWithAI, processStudentListWithAI } from '../../services/aiService';

export default function SettingsView() {
    const [apiKey, setApiKey] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState(''); // 'success', 'error', 'info'

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key') || '';
        setApiKey(savedKey);
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setStatusMessage('API Key guardada correctamente.');
        setStatusType('success');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (!validTypes.includes(file.type)) {
            setStatusMessage('Por favor, sube un archivo PDF o Excel válido.');
            setStatusType('error');
            return;
        }

        if (!apiKey) {
            setStatusMessage('Primero debes guardar tu API Key de Gemini.');
            setStatusType('error');
            return;
        }

        setIsProcessing(true);
        setStatusMessage('Procesando archivo...');
        setStatusType('info');

        try {
            if (file.type === 'application/pdf') {
                // 1. Extract text from PDF
                const text = await extractTextFromPdf(file);
                setStatusMessage('Procesando plan de estudios con IA...');

                // 2. Process with Gemini
                const structuredData = await processCurriculumWithAI(text, apiKey);

                // 3. Update Local Storage
                const existingData = JSON.parse(localStorage.getItem('custom_curriculum') || '{}');
                const gradeKey = structuredData.grade.replace('º', '');
                const newData = { ...existingData, [gradeKey]: structuredData };
                localStorage.setItem('custom_curriculum', JSON.stringify(newData));

                setStatusMessage(`¡Éxito! Plan de estudios de ${structuredData.grade} actualizado.`);
            } else {
                // Excel processing
                setStatusMessage('Leyendo archivo Excel...');
                const excelData = await extractDataFromExcel(file);

                setStatusMessage('Procesando lista de alumnos con IA...');
                // Pass the raw object to AI
                const studentData = await processStudentListWithAI(excelData, apiKey);

                // Update students in localStorage
                // Expected format from AI: { "2A": ["Name 1", ...], "2B": ... }
                const existingStudents = JSON.parse(localStorage.getItem('students_by_class') || '{}');
                const newStudents = { ...existingStudents, ...studentData };
                localStorage.setItem('students_by_class', JSON.stringify(newStudents));

                setStatusMessage('¡Éxito! Lista de alumnos actualizada.');
            }

            setStatusType('success');
        } catch (error) {
            console.error(error);
            setStatusMessage(`Error: ${error.message}`);
            setStatusType('error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="animate-fade-in pb-20">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Cog6ToothIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Configuración</h2>
                </div>

                {/* API Key Section */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Gemini API Key
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Ingresa tu API Key aquí..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={handleSaveKey}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                        >
                            Guardar
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Necesaria para las funciones de IA y para importar planes desde PDF.
                    </p>
                </div>

                {/* School Settings Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Configuración Escolar</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Grade Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Grado Escolar
                            </label>
                            <select
                                id="schoolGrade"
                                defaultValue={JSON.parse(localStorage.getItem('school_settings') || '{}').selectedGrade || '2'}
                                onChange={(e) => {
                                    const currentSettings = JSON.parse(localStorage.getItem('school_settings') || '{}');
                                    const newSettings = { ...currentSettings, selectedGrade: e.target.value };
                                    localStorage.setItem('school_settings', JSON.stringify(newSettings));
                                    window.location.reload();
                                }}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="1">1º Grado</option>
                                <option value="2">2º Grado</option>
                                <option value="3">3º Grado</option>
                                <option value="4">4º Grado</option>
                                <option value="5">5º Grado</option>
                                <option value="6">6º Grado</option>
                            </select>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Selecciona el grado para ver la planeación correspondiente.
                            </p>
                        </div>

                        {/* Start Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Inicio del Ciclo Escolar
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    id="schoolStartDate"
                                    defaultValue={JSON.parse(localStorage.getItem('school_settings') || '{}').startDate || '2024-08-26'}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    onClick={() => {
                                        const date = document.getElementById('schoolStartDate').value;
                                        if (date) {
                                            const currentSettings = JSON.parse(localStorage.getItem('school_settings') || '{}');
                                            const newSettings = { ...currentSettings, startDate: date };
                                            localStorage.setItem('school_settings', JSON.stringify(newSettings));
                                            window.location.reload();
                                        }
                                    }}
                                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                                >
                                    Guardar
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Define cuándo inicia el ciclo para calcular la semana.
                            </p>
                        </div>
                    </div>
                </div>

                {/* File Import Section */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Importar Archivos</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        Sube un PDF para el plan de estudios o un Excel para la lista de alumnos. La IA procesará la información automáticamente.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                        <input
                            type="file"
                            accept=".pdf,.xlsx,.xls"
                            onChange={handleFileUpload}
                            disabled={isProcessing}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                            {isProcessing ? (
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
                            ) : (
                                <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
                            )}
                            <p className="text-gray-600 dark:text-gray-300 font-medium">
                                {isProcessing ? 'Procesando archivo...' : 'Haz clic o arrastra un PDF o Excel aquí'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Máximo 10MB</p>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {statusMessage && (
                        <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${statusType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                            statusType === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            }`}>
                            {statusType === 'success' && <CheckCircleIcon className="w-5 h-5" />}
                            {statusType === 'error' && <ExclamationCircleIcon className="w-5 h-5" />}
                            <span className="text-sm font-medium">{statusMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
