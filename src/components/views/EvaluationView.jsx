
import React, { useState, useEffect } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { processStudentListWithAI } from '../../services/aiService';
import { ArrowLeftIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function EvaluationView() {
    const { studentLists, updateStudentLists, getAllClasses } = useStudents();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedClass, setSelectedClass] = useState(getAllClasses()[0] || '2A');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    // Update selected class if lists change and current selection is invalid
    useEffect(() => {
        const classes = getAllClasses();
        if (classes.length > 0 && !classes.includes(selectedClass)) {
            setSelectedClass(classes[0]);
        }
    }, [studentLists, selectedClass, getAllClasses]);

    // Mock data for evaluation - in a real app this would be more complex and persistent
    const getStudentData = (student) => ({
        name: student,
        attendance: 95,
        activities: 85,
        exam: 9.0,
        final: 9.2,
        trimesters: [
            { id: 1, attendance: 98, activities: 90, exam: 9.5, final: 9.4 },
            { id: 2, attendance: 92, activities: 80, exam: 8.5, final: 8.8 },
            { id: 3, attendance: 95, activities: 85, exam: 9.0, final: 9.2 },
        ]
    });

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadMessage('Leyendo Excel...');

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setUploadMessage('Procesando con IA...');
            const apiKey = localStorage.getItem('gemini_api_key');

            if (!apiKey) {
                throw new Error('No se encontró API Key. Ve a Ajustes para configurarla.');
            }

            const organizedStudents = await processStudentListWithAI(jsonData, apiKey);

            updateStudentLists(organizedStudents);
            setUploadMessage('¡Listas actualizadas correctamente!');
            setTimeout(() => setUploadMessage(''), 3000);

        } catch (error) {
            console.error(error);
            setUploadMessage(`Error: ${error.message} `);
        } finally {
            setIsUploading(false);
        }
    };

    const renderStudentList = () => (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Seguimiento y Evaluación</h2>

                {/* Excel Upload Button */}
                <div className="relative">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'bg-gray-300 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                        <CloudArrowUpIcon className="w-5 h-5" />
                        {isUploading ? 'Procesando...' : 'Importar Lista (Excel)'}
                    </button>
                </div>
            </div>

            {uploadMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${uploadMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {uploadMessage}
                </div>
            )}

            {/* Class Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccionar Grupo</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {getAllClasses().map(cls => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedClass === cls
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                } `}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
            </div>

            {/* Criteria Section */}
            <section className="mb-8 bg-stone-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Criterios de Evaluación</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-amber-700 dark:text-amber-500 w-16">50%</span>
                                <span className="text-gray-600 dark:text-gray-300 text-sm">Evaluación continua: prácticas, actividades, participación.</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-amber-700 dark:text-amber-500 w-16">50%</span>
                                <span className="text-gray-600 dark:text-gray-300 text-sm">Exámenes o presentaciones finales.</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Escala de Actividades</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Excelente (4)</span>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Bueno (3)</span>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Aceptable (2)</span>
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">Insuficiente (1)</span>
                        </div>
                    </div>
                </div>
            </section>

            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Alumnos - {selectedClass}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(studentLists[selectedClass] || []).map((student) => (
                    <button
                        key={student}
                        onClick={() => setSelectedStudent(student)}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-amber-500 dark:hover:border-amber-500 transition-all text-left"
                    >
                        <div className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{student}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedClass}</div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStudentDetail = () => {
        const data = getStudentData(selectedStudent);
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedStudent(null)}
                    className="flex items-center text-amber-700 dark:text-amber-500 font-semibold hover:underline mb-6"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" /> Volver a la lista
                </button>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedStudent}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{selectedClass} - Primaria</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-1">
                                <DocumentTextIcon className="w-4 h-4" /> Reporte
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-stone-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="py-3 px-6">Trimestre</th>
                                    <th className="py-3 px-6">Asistencia (%)</th>
                                    <th className="py-3 px-6">Actividades (Pts)</th>
                                    <th className="py-3 px-6">Examen (0-10)</th>
                                    <th className="py-3 px-6">Calificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.trimesters.map((trim) => (
                                    <tr key={trim.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                            Trimestre {trim.id}
                                        </td>
                                        <td className="py-4 px-6">{trim.attendance}%</td>
                                        <td className="py-4 px-6">{trim.activities}</td>
                                        <td className="py-4 px-6">{trim.exam}</td>
                                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{trim.final}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-semibold text-gray-900 dark:text-white bg-amber-50 dark:bg-amber-900/20">
                                <tr>
                                    <td colSpan="4" className="text-right py-3 px-6">Promedio Final</td>
                                    <td className="py-3 px-6 text-lg">{data.final}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="pb-20">
            {selectedStudent ? renderStudentDetail() : renderStudentList()}
        </div>
    );
}

