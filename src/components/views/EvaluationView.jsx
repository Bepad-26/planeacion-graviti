
import React, { useState, useEffect } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { processStudentListWithAI } from '../../services/aiService';
import { ArrowLeftIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function EvaluationView() {
    const { studentLists, updateStudentLists, getAllClasses, updateStudentDetail, getStudentDetail } = useStudents();
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

    // Load student data from localStorage or initialize
    const [studentData, setStudentData] = useState(() => {
        const saved = localStorage.getItem('student_evaluations');
        return saved ? JSON.parse(saved) : {};
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('student_evaluations', JSON.stringify(studentData));
    }, [studentData]);

    const getStudentEvaluation = (studentName) => {
        if (!studentData[studentName]) {
            // Initialize default structure if not exists
            return {
                trimesters: [
                    { id: 1, attendance: 0, activities: 0, exam: 0, final: 0 },
                    { id: 2, attendance: 0, activities: 0, exam: 0, final: 0 },
                    { id: 3, attendance: 0, activities: 0, exam: 0, final: 0 },
                ],
                final: 0
            };
        }
        return studentData[studentName];
    };

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
    const handleGradeChange = (studentName, trimesterId, field, value) => {
        const currentData = getStudentEvaluation(studentName);
        const newTrimesters = currentData.trimesters.map(t => {
            if (t.id === trimesterId) {
                const updatedTrimester = { ...t, [field]: parseFloat(value) || 0 };
                // Recalculate final for trimester: 50% activities + 50% exam (simplified logic)

                const activitiesScore = updatedTrimester.activities > 10 ? updatedTrimester.activities / 10 : updatedTrimester.activities;
                const examScore = updatedTrimester.exam > 10 ? updatedTrimester.exam / 10 : updatedTrimester.exam;

                updatedTrimester.final = ((activitiesScore * 0.5) + (examScore * 0.5)) * 10; // Scale to 10
                updatedTrimester.final = Math.round(updatedTrimester.final * 10) / 10; // Round to 1 decimal

                return updatedTrimester;
            }
            return t;
        });

        // Recalculate global final
        const totalFinal = newTrimesters.reduce((acc, curr) => acc + curr.final, 0) / 3;

        setStudentData(prev => ({
            ...prev,
            [studentName]: {
                ...currentData,
                trimesters: newTrimesters,
                final: Math.round(totalFinal * 10) / 10
            }
        }));
    };

    const renderStudentDetail = () => {
        const data = getStudentEvaluation(selectedStudent);
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

                            {/* Birthday Input */}
                            <div className="mt-2 flex items-center gap-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Cumpleaños:</label>
                                <input
                                    type="date"
                                    className="text-xs p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={getStudentDetail(selectedStudent).birthday || ''}
                                    onChange={(e) => updateStudentDetail(selectedStudent, 'birthday', e.target.value)}
                                />
                            </div>
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
                                    <th className="py-3 px-6">Actividades (0-100)</th>
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
                                        <td className="py-4 px-6">
                                            <input
                                                type="number"
                                                className="w-20 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                                value={trim.attendance}
                                                onChange={(e) => handleGradeChange(selectedStudent, trim.id, 'attendance', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <input
                                                type="number"
                                                className="w-20 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                                value={trim.activities}
                                                onChange={(e) => handleGradeChange(selectedStudent, trim.id, 'activities', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <input
                                                type="number"
                                                className="w-20 p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                                                value={trim.exam}
                                                onChange={(e) => handleGradeChange(selectedStudent, trim.id, 'exam', e.target.value)}
                                            />
                                        </td>
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

