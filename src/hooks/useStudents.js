import { useState } from 'react';
import { studentLists as defaultLists } from '../data/students';

export function useStudents() {
    const [studentLists, setStudentLists] = useState(() => {
        const savedLists = localStorage.getItem('custom_student_lists');
        if (savedLists) {
            try {
                return JSON.parse(savedLists);
            } catch (e) {
                console.error("Error parsing saved student lists", e);
                return defaultLists;
            }
        }
        return defaultLists;
    });

    const updateStudentLists = (newLists) => {
        setStudentLists(newLists);
        localStorage.setItem('custom_student_lists', JSON.stringify(newLists));
    };

    const getStudentsByClass = (className) => {
        return studentLists[className] || [];
    };

    const getAllClasses = () => {
        return Object.keys(studentLists);
    };

    const [studentDetails, setStudentDetails] = useState(() => {
        return JSON.parse(localStorage.getItem('student_details') || '{}');
    });

    const updateStudentDetail = (studentName, detail, value) => {
        setStudentDetails(prev => {
            const updated = {
                ...prev,
                [studentName]: {
                    ...prev[studentName],
                    [detail]: value
                }
            };
            localStorage.setItem('student_details', JSON.stringify(updated));
            return updated;
        });
    };

    const getStudentDetail = (studentName) => {
        return studentDetails[studentName] || {};
    };

    return {
        studentLists,
        updateStudentLists,
        getStudentsByClass,
        getAllClasses,
        studentDetails,
        updateStudentDetail,
        getStudentDetail
    };
}
