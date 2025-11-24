import React from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { ChevronDownIcon, ClockIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function ScheduleSection() {
    const { getCurrentPlanTopic } = useCurriculum();
    const planData = getCurrentPlanTopic();
    const [isOpen, setIsOpen] = React.useState(true);
    const [manualActivities, setManualActivities] = React.useState([]);

    React.useEffect(() => {
        const savedActivities = JSON.parse(localStorage.getItem('weekly_planner_activities') || '{}');
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const today = days[new Date().getDay()];

        if (savedActivities[today] && savedActivities[today].length > 0) {
            setManualActivities(savedActivities[today].map(a => a.title));
        }
    }, []);

    const toggleAccordion = () => setIsOpen(!isOpen);

    // Use manual activities if available, otherwise fallback to AI plan
    const subjects = manualActivities.length > 0 ? manualActivities : (planData.subjects || []);

    // Only hide if NO data source has info (and it's not a weekend/error for AI)
    if (subjects.length === 0 && (planData.status === 'weekend' || planData.status === 'error')) {
        return null;
    }

    return (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <button
                onClick={toggleAccordion}
                className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                        <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Horario de Hoy</h2>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0">
                    {subjects.length > 0 ? (
                        <div className="space-y-3">
                            {subjects.map((subject, index) => (
                                <div key={index} className="flex items-center p-4 bg-stone-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-amber-200 dark:hover:border-amber-500/50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm mr-4 border border-gray-100 dark:border-gray-500">
                                        <span className="font-bold text-amber-600 dark:text-amber-400">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{subject}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Sesión {index + 1}</p>
                                    </div>
                                    <BookOpenIcon className="w-5 h-5 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            No hay materias específicas detectadas para hoy.
                        </p>
                    )}

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                            Este horario se genera automáticamente basado en tu Plan de Estudios (PDF).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
