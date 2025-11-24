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
        return savedSettings ? JSON.parse(savedSettings) : { startDate: '', selectedGrade: '2' };
    });

    const updateSchoolSettings = (newSettings) => {
        const updated = { ...schoolSettings, ...newSettings };
        setSchoolSettings(updated);
        localStorage.setItem('school_settings', JSON.stringify(updated));
    };

    // Auto-detect start date from curriculum if not set or if curriculum updates
    if (curriculum && (!schoolSettings.startDate || schoolSettings.autoDetected)) {
        const grade = schoolSettings.selectedGrade || Object.keys(curriculum)[0];
        if (grade && curriculum[grade]) {
            const firstTrimester = curriculum[grade].trimesters[0];
            if (firstTrimester && firstTrimester.weeks && firstTrimester.weeks.length > 0) {
                const firstWeek = firstTrimester.weeks[0];
                if (firstWeek.dateRange) {
                    const startDate = firstWeek.dateRange.split(' to ')[0];
                    if (startDate && startDate !== schoolSettings.startDate) {
                        console.log('Auto-detecting start date from curriculum:', startDate);
                        updateSchoolSettings({ startDate, autoDetected: true });
                    }
                }
            }
        }
    }

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

                // Create dates using local time components to avoid UTC shifts
                const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
                const [eYear, eMonth, eDay] = endStr.split('-').map(Number);

                const start = new Date(sYear, sMonth - 1, sDay, 0, 0, 0);
                const end = new Date(eYear, eMonth - 1, eDay, 23, 59, 59);

                return now >= start && now <= end;
            });

            if (weekMatch) {
                console.log('Found matching week:', weekMatch);
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
            subjects: dailySubjects,
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
