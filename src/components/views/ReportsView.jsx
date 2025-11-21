import React, { useState } from 'react';
import { DocumentArrowDownIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useStudents } from '../../hooks/useStudents';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ReportsView() {
    const { getAllClasses, getStudentsByClass, getStudentDetail } = useStudents();
    const [selectedClass, setSelectedClass] = useState(getAllClasses()[0] || '');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [reportMessage, setReportMessage] = useState('Estimados padres de familia, les compartimos el reporte de progreso académico.');
    const [isGenerating, setIsGenerating] = useState(false);

    const students = selectedClass ? getStudentsByClass(selectedClass) : [];

    const generatePDF = () => {
        setIsGenerating(true);
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text('Reporte de Progreso Académico', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Escuela: Nombre de la Escuela`, 20, 35);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 42);

        // Student Info
        if (selectedStudent) {
            doc.text(`Alumno: ${selectedStudent}`, 20, 55);
            doc.text(`Grado y Grupo: ${selectedClass}`, 20, 62);
        } else {
            doc.text(`Grado y Grupo: ${selectedClass}`, 20, 55);
        }

        // Message
        doc.setFontSize(10);
        doc.text(reportMessage, 20, 75, { maxWidth: 170 });

        // Grades Table (Mock Data for now, should pull from EvaluationView storage)
        const grades = JSON.parse(localStorage.getItem('student_grades') || '{}');

        let tableData = [];
        if (selectedStudent) {
            const studentGrades = grades[selectedStudent] || {};
            tableData = Object.entries(studentGrades).map(([subject, score]) => [subject, score]);
        } else {
            // Class Average Report
            tableData = students.map(student => {
                const studentGrades = grades[student] || {};
                const average = Object.values(studentGrades).reduce((a, b) => Number(a) + Number(b), 0) / (Object.values(studentGrades).length || 1);
                return [student, average.toFixed(1)];
            });
        }

        doc.autoTable({
            startY: 90,
            head: [selectedStudent ? ['Materia', 'Calificación'] : ['Alumno', 'Promedio General']],
            body: tableData.length ? tableData : [['Sin datos', '-']],
        });

        // Footer
        doc.setFontSize(10);
        doc.text('Firma del Maestro(a)', 105, 250, { align: 'center' });
        doc.line(70, 245, 140, 245);

        doc.save(`Reporte_${selectedStudent || selectedClass}_${new Date().toISOString().split('T')[0]}.pdf`);
        setIsGenerating(false);
    };

    return (
        <div className="animate-fade-in pb-24 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generador de Reportes</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">

                {/* Selection Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clase</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => {
                                setSelectedClass(e.target.value);
                                setSelectedStudent('');
                            }}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            {getAllClasses().map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alumno (Opcional)</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Todos (Reporte Grupal)</option>
                            {students.map(student => (
                                <option key={student} value={student}>{student}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Message Template */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensaje para Padres</label>
                    <textarea
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="Escribe un mensaje personalizado..."
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={generatePDF}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 font-bold transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
                        ) : (
                            <DocumentArrowDownIcon className="w-6 h-6" />
                        )}
                        {isGenerating ? 'Generando...' : 'Descargar PDF'}
                    </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3">
                    <PrinterIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p>
                        Este generador creará un archivo PDF listo para imprimir o enviar por WhatsApp.
                        Incluye el logo de la escuela (si está configurado), los datos del alumno y el mensaje personalizado.
                    </p>
                </div>
            </div>
        </div>
    );
}
