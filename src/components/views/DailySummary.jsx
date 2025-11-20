import React, { useState, useEffect } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';

export default function DailySummary() {
    const { getCurrentPlanTopic } = useCurriculum();
    const [todaysClass, setTodaysClass] = useState(null);

    useEffect(() => {
        const plan = getCurrentPlanTopic();
        setTodaysClass(plan);
    }, [getCurrentPlanTopic]);

    return (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Clase de Hoy</h2>
            <div className="text-center">
                {todaysClass && todaysClass.status === 'active' ? (
                    <div>
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide">
                                {todaysClass.trimesterTitle}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
                                Semana {todaysClass.week}
                            </span>
                        </div>
                        <p className="text-lg font-semibold text-amber-600 dark:text-amber-500">{todaysClass.grade} - {todaysClass.topic}</p>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 p-4 bg-stone-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700" dangerouslySetInnerHTML={{ __html: todaysClass.activity }} />
                    </div>
                ) : (
                    <div className="py-8">
                        <p className="text-gray-500 text-lg">
                            {todaysClass?.message || "Cargando..."}
                        </p>
                        {todaysClass?.status === 'error' && (
                            <p className="text-sm text-gray-400 mt-2">Revisa la configuración de fecha si esto es un error.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
