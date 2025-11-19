import React, { useState, useEffect } from 'react';
import { curriculumData } from '../../data/curriculum';

export default function DailySummary() {
    const [todaysClass, setTodaysClass] = useState(null);

    useEffect(() => {
        // Simple logic to determine current trimester/week based on date
        // For prototype purposes, we'll mock this or use a simplified version of the original logic
        // This is a placeholder for the complex date logic
        const mockDate = new Date();
        // In a real app, we'd import the helper function to calculate this

        setTodaysClass({
            grade: '2º',
            week: 'Semana 1',
            topic: 'Conociendo mi Equipo',
            activity: 'Identificar partes de la computadora'
        });
    }, []);

    return (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Clase de Hoy</h2>
            <div className="text-center">
                {todaysClass ? (
                    <div>
                        <p className="text-lg font-semibold text-amber-600 dark:text-amber-500">{todaysClass.grade} - {todaysClass.week}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">{todaysClass.topic}</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{todaysClass.activity}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">No hay clases programadas para hoy.</p>
                )}
            </div>
        </div>
    );
}
