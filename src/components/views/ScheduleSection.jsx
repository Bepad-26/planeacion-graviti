import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function ScheduleSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Default schedule data
    const defaultSchedule = [
        { time: '7:40 - 8:00', mon: '', tue: '', wed: '', thu: '', fri: '' },
        { time: '8:00 - 8:55', mon: '', tue: '', wed: '', thu: '', fri: '' },
        { time: '8:55 - 9:50', mon: '4º B', tue: '2º A', wed: '5º B', thu: '', fri: '4º A' },
        { time: '9:50 - 10:20', mon: 'RECESO', tue: 'RECESO', wed: 'RECESO', thu: 'RECESO', fri: 'RECESO', isBreak: true },
        { time: '10:20 - 11:20', mon: '4º A', tue: '3º B', wed: '', thu: '', fri: '3º A' },
        { time: '11:20 - 12:15', mon: '2º B', tue: '5º A', wed: '5º A', thu: '3º B', fri: '2º B' },
        { time: '12:15 - 12:30', mon: 'RECREO', tue: 'RECREO', wed: 'RECREO', thu: 'RECREO', fri: 'RECREO', isBreak: true },
        { time: '12:30 - 1:30', mon: '2º A', tue: '3º A', wed: '4º B', thu: '5º B', fri: '' },
        { time: '1:30 - 2:25', mon: '', tue: '', wed: '', thu: '', fri: '' },
    ];

    // Load from localStorage or use default
    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem('class_schedule');
        return saved ? JSON.parse(saved) : defaultSchedule;
    });

    // Save to localStorage whenever schedule changes
    useEffect(() => {
        localStorage.setItem('class_schedule', JSON.stringify(schedule));
    }, [schedule]);

    const toggleAccordion = () => setIsOpen(!isOpen);
    const toggleEditMode = (e) => {
        e.stopPropagation();
        setIsEditMode(!isEditMode);
    };

    const handleCellChange = (rowIndex, day, value) => {
        const newSchedule = [...schedule];
        newSchedule[rowIndex][day] = value;
        setSchedule(newSchedule);
    };

    return (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <button
                onClick={toggleAccordion}
                className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mi Horario de Clases</h2>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 overflow-x-auto">
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={toggleEditMode}
                            className={`p-2 rounded-full transition-colors ${isEditMode ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'text-gray-500 hover:text-amber-600'}`}
                            title={isEditMode ? "Guardar cambios" : "Editar horario"}
                        >
                            {isEditMode ? <CheckIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    <table className="w-full border-collapse text-center min-w-[600px]">
                        <thead>
                            <tr className="bg-stone-50 dark:bg-gray-700">
                                <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Hora</th>
                                <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Lunes</th>
                                <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Martes</th>
                                <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Miércoles</th>
                                <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Jueves</th>
                                <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Viernes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="p-2 text-xs border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">{row.time}</td>
                                    {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => (
                                        <td
                                            key={day}
                                            className={`p-2 text-xs border dark:border-gray-600 ${row.isBreak ? 'bg-gray-100 dark:bg-gray-600 font-bold' : ''} ${isEditMode && !row.isBreak ? 'border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 cursor-text' : ''}`}
                                            contentEditable={isEditMode && !row.isBreak}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => handleCellChange(rowIndex, day, e.target.innerText)}
                                        >
                                            {row[day]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
