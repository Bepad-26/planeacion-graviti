import { useState, useCallback } from 'react';
import { curriculumData as defaultCurriculum } from '../data/curriculum';
import { getSchoolWeek } from '../utils/dateUtils';

export const useCurriculum = () => {
    const [curriculum] = useState(() => {
        const savedCurriculum = localStorage.getItem('custom_curriculum');
        return savedCurriculum ? { ...defaultCurriculum, ...JSON.parse(savedCurriculum) } : defaultCurriculum;
    });

    const [schoolSettings, setSchoolSettings] = useState(() => {
        const savedSettings = localStorage.getItem('school_settings');
        // Default to August 25, 2025 for the current testing context
        return savedSettings ? JSON.parse(savedSettings) : { startDate: '2025-08-25', selectedGrade: '2' };
    });

    const updateSchoolSettings = (newSettings) => {
        const updated = { ...schoolSettings, ...newSettings };
        setSchoolSettings(updated);
        localStorage.setItem('school_settings', JSON.stringify(updated));
    };

    const getCurrentPlanTopic = useCallback(() => {
        const { week, trimester } = getSchoolWeek(schoolSettings.startDate);
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon...

        // If weekend, return no class
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return {
                status: 'weekend',
                message: '¡Buen fin de semana! No hay clases programadas.'
            };
        }

        // Use configured grade or default to '2'
        const grade = schoolSettings.selectedGrade || '2';
        const gradeData = curriculum[grade];

        if (!gradeData || !gradeData.trimesters) {
            return { status: 'error', message: `Datos del plan de estudios (${grade}º) no encontrados.` };
        }

        // Trimester is 1-based, array is 0-based
        const trimesterData = gradeData.trimesters[trimester - 1];

        if (!trimesterData || !trimesterData.weeks) {
            return { status: 'error', message: 'Datos del trimestre no encontrados.' };
        }

        // Week is 1-based, array is 0-based
        const weekData = trimesterData.weeks[week - 1];

        if (!weekData) {
            return { status: 'error', message: 'Datos de la semana no encontrados.' };
        }

        // Determine class based on day
        // Mon-Wed = Class 1, Thu-Fri = Class 2
        const isFirstHalfOfWeek = dayOfWeek <= 3;
        const topic = isFirstHalfOfWeek ? 'Clase 1' : 'Clase 2';
        const activity = isFirstHalfOfWeek ? weekData.class1 : weekData.class2;

        return {
            status: 'active',
            grade: `${grade}º`,
            week: weekData.week,
            topic,
            activity,
            trimesterTitle: trimesterData.title,
            trimesterNumber: trimester
        };
    }, [curriculum, schoolSettings.startDate, schoolSettings.selectedGrade]);

    return {
        curriculum,
        schoolSettings,
        updateSchoolSettings,
        getCurrentPlanTopic
    };
};
