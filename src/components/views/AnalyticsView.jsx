import React, { useMemo } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsView() {
    const { getAllClasses, getStudentsByClass } = useStudents();

    // Helper to get student data (mocking the structure from EvaluationView logic)
    const getStudentData = (studentName) => {
        const saved = localStorage.getItem('student_evaluations');
        const data = saved ? JSON.parse(saved) : {};
        return data[studentName] || { final: 0 };
    };

    const analyticsData = useMemo(() => {
        const classes = getAllClasses();
        const classStats = [];
        const atRiskStudents = [];
        let totalStudents = 0;
        let passingStudents = 0;

        classes.forEach(cls => {
            const students = getStudentsByClass(cls);
            let classTotal = 0;
            let studentCount = 0;

            students.forEach(student => {
                const data = getStudentData(student);
                const grade = parseFloat(data.final) || 0;

                classTotal += grade;
                studentCount++;
                totalStudents++;

                if (grade >= 6) passingStudents++;
                if (grade < 6 && grade > 0) { // Only count if they have a grade
                    atRiskStudents.push({ name: student, class: cls, grade });
                }
            });

            classStats.push({
                name: cls,
                average: studentCount > 0 ? (classTotal / studentCount).toFixed(1) : 0
            });
        });

        return { classStats, atRiskStudents, totalStudents, passingStudents };
    }, [getAllClasses, getStudentsByClass]);

    const pieData = [
        { name: 'Aprobados', value: analyticsData.passingStudents },
        { name: 'En Riesgo', value: analyticsData.totalStudents - analyticsData.passingStudents }
    ];

    const COLORS = ['#10B981', '#EF4444'];

    return (
        <div className="animate-fade-in pb-24 p-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Analítico</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Alumnos</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{analyticsData.totalStudents}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">En Riesgo</p>
                    <p className="text-3xl font-bold text-red-500">{analyticsData.atRiskStudents.length}</p>
                </div>
            </div>

            {/* Class Averages Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Promedio por Grupo</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.classStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="average" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Promedio" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* At Risk List */}
            {analyticsData.atRiskStudents.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-8">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">⚠️ Atención Requerida</h3>
                    <div className="space-y-2">
                        {analyticsData.atRiskStudents.map((student, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.class}</p>
                                </div>
                                <span className="font-bold text-red-600">{student.grade}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
