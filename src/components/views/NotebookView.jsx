import React, { useState, useEffect } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

export default function NotebookView() {
    const { getStudentsByClass, getAllClasses } = useStudents();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedGroup, setSelectedGroup] = useState('2A');
    const [generalNotes, setGeneralNotes] = useState('');
    const [incidences, setIncidences] = useState([]);

    // Incidence Form State
    const [newIncidence, setNewIncidence] = useState({
        student: '',
        type: '',
        description: '',
        actions: '',
        agreements: ''
    });

    // Load data on mount/change
    useEffect(() => {
        const key = `notebook-${selectedDate}-${selectedGroup}`;
        const savedData = JSON.parse(localStorage.getItem(key) || '{"notes": "", "incidences": []}');
        setGeneralNotes(savedData.notes);
        setIncidences(savedData.incidences);
    }, [selectedDate, selectedGroup]);

    // Save data on change
    useEffect(() => {
        const key = `notebook-${selectedDate}-${selectedGroup}`;
        localStorage.setItem(key, JSON.stringify({ notes: generalNotes, incidences }));
    }, [generalNotes, incidences, selectedDate, selectedGroup]);

    const handleAddIncidence = (e) => {
        e.preventDefault();
        if (!newIncidence.type || !newIncidence.description) return;

        setIncidences([...incidences, { ...newIncidence, id: Date.now() }]);
        setNewIncidence({
            student: '',
            type: '',
            description: '',
            actions: '',
            agreements: ''
        });
    };

    const handleDeleteIncidence = (id) => {
        setIncidences(incidences.filter(inc => inc.id !== id));
    };

    const exportBitacora = () => {
        const data = [
            { Tipo: 'Nota General', Detalle: generalNotes, Alumno: 'N/A', Fecha: selectedDate, Grupo: selectedGroup },
            ...incidences.map(inc => ({
                Tipo: `Incidencia: ${inc.type}`,
                Detalle: `${inc.description} | Acciones: ${inc.actions} | Acuerdos: ${inc.agreements}`,
                Alumno: inc.student || 'Grupo',
                Fecha: selectedDate,
                Grupo: selectedGroup
            }))
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bitácora");
        XLSX.writeFile(wb, `Bitacora_${selectedGroup}_${selectedDate}.xlsx`);
    };

    const students = getStudentsByClass(selectedGroup);
    const allClasses = getAllClasses();

    return (
        <div className="animate-fade-in pb-20">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Bitácora Digital de Clase</h2>

                {/* Controls */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-6 bg-stone-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grupo</label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                            >
                                {allClasses.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={exportBitacora}
                        className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 text-sm flex items-center gap-2 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Exportar Bitácora
                    </button>
                </div>

                {/* General Notes */}
                <div className="mb-8">
                    <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-2">Notas Generales de la Clase</label>
                    <textarea
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Desarrollo de la clase, observaciones generales, tareas asignadas..."
                    ></textarea>
                </div>

                {/* Incidences */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Registro de Incidencias</h3>

                    {/* Add Incidence Form */}
                    <form onSubmit={handleAddIncidence} className="bg-stone-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <select
                                value={newIncidence.student}
                                onChange={(e) => setNewIncidence({ ...newIncidence, student: e.target.value })}
                                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Seleccione un alumno (Opcional)</option>
                                {students.map(student => (
                                    <option key={student} value={student}>{student}</option>
                                ))}
                            </select>
                            <select
                                value={newIncidence.type}
                                onChange={(e) => setNewIncidence({ ...newIncidence, type: e.target.value })}
                                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                required
                            >
                                <option value="">Tipo de Incidencia</option>
                                <option value="CI">Conducta Inapropiada</option>
                                <option value="AV">Agresión Verbal</option>
                                <option value="AF">Agresión Física</option>
                                <option value="Grupo">Incidencia Grupal</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="space-y-4 mb-4">
                            <input
                                type="text"
                                value={newIncidence.description}
                                onChange={(e) => setNewIncidence({ ...newIncidence, description: e.target.value })}
                                placeholder="Descripción breve de la situación"
                                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={newIncidence.actions}
                                    onChange={(e) => setNewIncidence({ ...newIncidence, actions: e.target.value })}
                                    placeholder="Acciones tomadas"
                                    className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    value={newIncidence.agreements}
                                    onChange={(e) => setNewIncidence({ ...newIncidence, agreements: e.target.value })}
                                    placeholder="Acuerdos y compromisos"
                                    className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 text-sm flex items-center gap-2 transition-colors">
                                <PlusIcon className="w-5 h-5" />
                                Agregar Incidencia
                            </button>
                        </div>
                    </form>

                    {/* Incidence List */}
                    <div className="space-y-3">
                        {incidences.length > 0 ? (
                            incidences.map((inc) => (
                                <div key={inc.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-l-4 border-gray-200 dark:border-gray-700 border-l-red-500 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-red-600 dark:text-red-400 text-sm px-2 py-0.5 bg-red-50 dark:bg-red-900/30 rounded-full">{inc.type}</span>
                                                <span className="font-semibold text-gray-800 dark:text-white">{inc.student || 'Incidencia Grupal'}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">{inc.description}</p>
                                            {(inc.actions || inc.agreements) && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-stone-50 dark:bg-gray-900 p-2 rounded">
                                                    {inc.actions && <p><span className="font-semibold">Acción:</span> {inc.actions}</p>}
                                                    {inc.agreements && <p><span className="font-semibold">Acuerdo:</span> {inc.agreements}</p>}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => handleDeleteIncidence(inc.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center italic py-4">No hay incidencias registradas para este día.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
