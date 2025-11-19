import React, { useState, useEffect } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { CheckCircleIcon, XCircleIcon, ClockIcon, NoSymbolIcon } from '@heroicons/react/24/solid';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function RollCallView() {
    const { getStudentsByClass, getAllClasses } = useStudents();
    const [selectedClass, setSelectedClass] = useState('2A');
    const [selectedTrimester, setSelectedTrimester] = useState('1');
    const [attendance, setAttendance] = useState({});

    // Load attendance from local storage on mount
    useEffect(() => {
        const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '{}');
        setAttendance(savedAttendance);
    }, []);

    // Save attendance to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('attendance', JSON.stringify(attendance));
    }, [attendance]);

    const handleAttendanceClick = (studentName, status) => {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const key = `${selectedClass}-${selectedTrimester}-${date}`;

        setAttendance(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [studentName]: status
            }
        }));
    };

    const getStudentStatus = (studentName) => {
        const date = new Date().toISOString().split('T')[0];
        const key = `${selectedClass}-${selectedTrimester}-${date}`;
        return attendance[key]?.[studentName] || null;
    };

    const students = getStudentsByClass(selectedClass);
    const allClasses = getAllClasses();

    const exportToExcel = () => {
        const date = new Date().toISOString().split('T')[0];
        const data = students.map(student => ({
            Nombre: student,
            Estado: getStudentStatus(student) || 'No registrado',
            Fecha: date,
            Clase: selectedClass,
            Trimestre: selectedTrimester
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
        XLSX.writeFile(wb, `Asistencia_${selectedClass}_${date}.xlsx`);
    };

    return (
        <div className="animate-fade-in pb-20">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Pase de Lista Rápido</h2>

                {/* Controls */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trimestre</label>
                            <select
                                value={selectedTrimester}
                                onChange={(e) => setSelectedTrimester(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clase</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                            >
                                {allClasses.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={exportToExcel}
                        className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 text-sm flex items-center gap-2 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Exportar Lista
                    </button>
                </div>

                {/* Student List */}
                <div className="space-y-2">
                    {students.map((student, index) => {
                        const status = getStudentStatus(student);
                        return (
                            <div key={index} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mr-4">{student}</span>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleAttendanceClick(student, 'A')}
                                        className={`p-1 rounded-full transition-colors ${status === 'A' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        title="Asistencia"
                                    >
                                        <CheckCircleIcon className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => handleAttendanceClick(student, 'R')}
                                        className={`p-1 rounded-full transition-colors ${status === 'R' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        title="Retardo"
                                    >
                                        <ClockIcon className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => handleAttendanceClick(student, 'F')}
                                        className={`p-1 rounded-full transition-colors ${status === 'F' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        title="Falta"
                                    >
                                        <XCircleIcon className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={() => handleAttendanceClick(student, 'J')}
                                        className={`p-1 rounded-full transition-colors ${status === 'J' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        title="Justificado"
                                    >
                                        <NoSymbolIcon className="w-8 h-8" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
