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
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon...
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDayName = days[dayOfWeek];

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

        // Find the current week and trimester based on DATE MATCHING first
        let foundWeek = null;
        let foundTrimester = null;
        let foundTrimesterIndex = 0;

        // Iterate through all trimesters and weeks to find the date match
        for (let tIndex = 0; tIndex < gradeData.trimesters.length; tIndex++) {
            const trimester = gradeData.trimesters[tIndex];
            if (!trimester.weeks) continue;

            const weekMatch = trimester.weeks.find(w => {
                if (!w.dateRange) return false;
                const [startStr, endStr] = w.dateRange.split(' to ');
                if (!startStr || !endStr) return false;

                const start = new Date(startStr);
                const end = new Date(endStr);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);

                return now >= start && now <= end;
            });

            if (weekMatch) {
                foundWeek = weekMatch;
                foundTrimester = trimester;
                foundTrimesterIndex = tIndex + 1;
                break;
            }
        }

        // Fallback to calculated week if no date match found
        if (!foundWeek) {
            const { week, trimester } = getSchoolWeek(schoolSettings.startDate);
            // Trimester is 1-based, array is 0-based
            foundTrimester = gradeData.trimesters[trimester - 1];
            if (foundTrimester && foundTrimester.weeks) {
                foundWeek = foundTrimester.weeks[week - 1];
            }
            foundTrimesterIndex = trimester;
        }

        if (!foundWeek) {
            return { status: 'error', message: 'No se encontró planificación para la fecha actual.' };
        }

        // Determine class/activity for the day
        let dailyActivity = "Actividad general";
        let dailySubjects = [];

        // If we have a specific schedule from AI
        if (foundWeek.schedule && foundWeek.schedule[currentDayName]) {
            dailySubjects = foundWeek.schedule[currentDayName];
            dailyActivity = `Clases de hoy: ${dailySubjects.join(', ')}`;
        } else {
            // Fallback to class1/class2 logic
            const isFirstHalfOfWeek = dayOfWeek <= 3;
            dailyActivity = isFirstHalfOfWeek ? foundWeek.class1 : foundWeek.class2;
            dailySubjects = [isFirstHalfOfWeek ? "Bloque 1" : "Bloque 2"];
        }

        return {
            status: 'active',
            grade: `${grade}º`,
            week: foundWeek.week,
            topic: foundWeek.title || `Semana ${foundWeek.week}`,
            activity: dailyActivity,
            subjects: dailySubjects, // New field for the list of subjects
            trimesterTitle: foundTrimester ? foundTrimester.title : `Trimestre ${foundTrimesterIndex}`,
            trimesterNumber: foundTrimesterIndex
        };
    }, [curriculum, schoolSettings.startDate, schoolSettings.selectedGrade]);

    return {
        curriculum,
        schoolSettings,
        updateSchoolSettings,
        getCurrentPlanTopic
    };
};
