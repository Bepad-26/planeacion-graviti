import React, { useState } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function PlannerView() {
    const { curriculum } = useCurriculum();
    const [activeGrade, setActiveGrade] = useState('2');
    const [openTrimesters, setOpenTrimesters] = useState({});
    const [openWeeks, setOpenWeeks] = useState({});

    const currentCurriculum = curriculum[activeGrade];

    const toggleTrimester = (grade, index) => {
        const key = `${grade}-${index}`;
        setOpenTrimesters(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleWeek = (grade, trimIndex, weekIndex) => {
        const key = `${grade}-${trimIndex}-${weekIndex}`;
        setOpenWeeks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Planeación Didáctica</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Gestiona y visualiza el plan de estudios completo para cada grado.
                </p>
            </header>

            {/* Grade Selector */}
            <nav className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
                {['2', '3', '4', '5'].map((grade) => (
                    <button
                        key={grade}
                        onClick={() => setActiveGrade(grade)}
                        className={`text-sm md:text-base font-semibold py-2 px-4 rounded-full shadow-sm border transition-all ${activeGrade === grade
                            ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                            }`}
                    >
                        {grade}º
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            {currentCurriculum && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{currentCurriculum.title}</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{currentCurriculum.description}</p>
                    </div>

                    {currentCurriculum.trimesters.map((trim, trimIndex) => (
                        <div key={trimIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                            <button
                                onClick={() => toggleTrimester(activeGrade, trimIndex)}
                                className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
                            >
                                <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-500">{trim.title}</h3>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${openTrimesters[`${activeGrade}-${trimIndex}`] ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openTrimesters[`${activeGrade}-${trimIndex}`] ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 pt-0">
                                    <div className="text-sm space-y-2 mb-4 text-gray-700 dark:text-gray-300">
                                        <p><strong className="font-semibold text-gray-900 dark:text-white">Conceptos:</strong> {trim.concepts}</p>
                                        <p><strong className="font-semibold text-gray-900 dark:text-white">Proyecto:</strong> {trim.project}</p>
                                        <p><strong className="font-semibold text-gray-900 dark:text-white">Evaluación:</strong> {trim.evaluation}</p>
                                    </div>

                                    <div className="mt-4">
                                        <button className="w-full bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-300 flex justify-center items-center gap-2">
                                            <SparklesIcon className="w-5 h-5" />
                                            Generar Ideas de Proyectos
                                        </button>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Plan Semanal</h4>
                                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            {trim.weeks.map((week, weekIndex) => {
                                                const isOpen = openWeeks[`${activeGrade}-${trimIndex}-${weekIndex}`];
                                                return (
                                                    <div key={weekIndex} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                        <button
                                                            onClick={() => toggleWeek(activeGrade, trimIndex, weekIndex)}
                                                            className="w-full text-left p-4 focus:outline-none flex justify-between items-center bg-stone-50 dark:bg-gray-900 hover:bg-stone-100 dark:hover:bg-gray-800 transition-colors"
                                                        >
                                                            <span className="font-semibold text-gray-700 dark:text-gray-300">{week.week}</span>
                                                            <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white dark:bg-gray-800">
                                                                <div className="border-r-0 md:border-r border-gray-200 dark:border-gray-700 pr-0 md:pr-4 space-y-2">
                                                                    <div>
                                                                        <p className="font-semibold mb-1 text-amber-800 dark:text-amber-500">Clase 1</p>
                                                                        <p className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: week.class1 }} />
                                                                    </div>
                                                                    <div className="flex gap-2 flex-wrap">
                                                                        <button className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 font-semibold py-1 px-3 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors">✨ Detallar</button>
                                                                        <button className="text-xs bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100 font-semibold py-1 px-3 rounded-full hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors">✨ Cuestionario</button>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <p className="font-semibold mb-1 text-amber-800 dark:text-amber-500">Clase 2</p>
                                                                        <p className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: week.class2 }} />
                                                                    </div>
                                                                    <div className="flex gap-2 flex-wrap">
                                                                        <button className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 font-semibold py-1 px-3 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors">✨ Detallar</button>
                                                                        <button className="text-xs bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100 font-semibold py-1 px-3 rounded-full hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors">✨ Cuestionario</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
