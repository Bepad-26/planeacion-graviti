import React, { useState, useEffect } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { getSchoolWeek } from '../../utils/dateUtils';

export default function DailySummary() {
    const { curriculum, schoolSettings } = useCurriculum();
    const [todaysClass, setTodaysClass] = useState(null);

    useEffect(() => {
        const calculateTodaysClass = () => {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon...

            // If weekend, no class
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                setTodaysClass(null);
                return;
            }

            const { week, trimester } = getSchoolWeek(schoolSettings.startDate, now);

            // Default to 2nd grade for the summary (or could be configurable)
            const grade = '2';
            const gradeData = curriculum[grade];

            if (!gradeData || !gradeData.trimesters) return;

            // Find current trimester data
            // Note: arrays are 0-indexed, so trimester 1 is index 0
            const trimesterData = gradeData.trimesters[trimester - 1];

            if (!trimesterData || !trimesterData.weeks) return;

            // Find current week data
            // Assuming weeks are ordered sequentially
            const weekData = trimesterData.weeks[week - 1];

            if (weekData) {
                // Determine if it's class 1 or 2 based on day of week
                // Mon/Tue/Wed = Class 1, Thu/Fri = Class 2 (Simplified logic)
                const isFirstHalfOfWeek = dayOfWeek <= 3;

                setTodaysClass({
                    grade: `${grade}º`,
                    week: weekData.week,
                    topic: isFirstHalfOfWeek ? 'Clase 1' : 'Clase 2',
                    activity: isFirstHalfOfWeek ? weekData.class1 : weekData.class2,
                    trimesterTitle: trimesterData.title
                });
            }
        };

        calculateTodaysClass();
    }, [curriculum, schoolSettings]);

    return (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Clase de Hoy</h2>
            <div className="text-center">
                {todaysClass ? (
                    <div>
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide">
                                {todaysClass.trimesterTitle}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
                                {todaysClass.week}
                            </span>
                        </div>
                        <p className="text-lg font-semibold text-amber-600 dark:text-amber-500">{todaysClass.grade} - {todaysClass.topic}</p>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 p-4 bg-stone-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700" dangerouslySetInnerHTML={{ __html: todaysClass.activity }} />
                    </div>
                ) : (
                    <div className="py-8">
                        <p className="text-gray-500 text-lg">¡Buen descanso! No hay clases programadas para hoy.</p>
                        <p className="text-sm text-gray-400 mt-2">Revisa la configuración de fecha si esto es un error.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
