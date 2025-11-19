import { useState, useEffect } from 'react';
import { curriculumData as defaultCurriculum } from '../data/curriculum';
import { getSchoolWeek } from '../utils/dateUtils';

export const useCurriculum = () => {
    const [curriculum, setCurriculum] = useState(defaultCurriculum);
    const [schoolSettings, setSchoolSettings] = useState({
        startDate: '2024-08-26' // Default start date
    });

    useEffect(() => {
        // Load custom curriculum and settings from local storage
        const savedCurriculum = localStorage.getItem('custom_curriculum');
        const savedSettings = localStorage.getItem('school_settings');

        if (savedCurriculum) {
            setCurriculum(prev => ({
                ...prev,
                ...JSON.parse(savedCurriculum)
            }));
        }

        if (savedSettings) {
            setSchoolSettings(JSON.parse(savedSettings));
        }
    }, []);

    const updateSchoolSettings = (newSettings) => {
        const updated = { ...schoolSettings, ...newSettings };
        setSchoolSettings(updated);
        localStorage.setItem('school_settings', JSON.stringify(updated));
    };

    const getCurrentPlanning = () => {
        const { week, trimester } = getSchoolWeek(schoolSettings.startDate);
        return { week, trimester };
    };

    return {
        curriculum,
        schoolSettings,
        updateSchoolSettings,
        getCurrentPlanning
    };
};
