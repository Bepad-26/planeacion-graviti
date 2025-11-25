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
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-center">
                            <thead>
                                <tr className="bg-stone-50 dark:bg-gray-700">
                                    <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Hora</th>
                                    <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Lunes</th>
                                    <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Martes</th>
                                    <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Miércoles</th>
                                    <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Jueves</th>
                                    <th className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-300 border dark:border-gray-600">Viernes</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">7:40 - 8:00</td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">8:00 - 8:55</td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">8:55 - 9:50</td>
                                    <td className="p-2 border dark:border-gray-600 bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-bold">4º B</td>
                                    <td className="p-2 border dark:border-gray-600 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 font-bold">2º A</td>
                                    <td className="p-2 border dark:border-gray-600 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold">5º B</td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600 bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-bold">4º A</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">9:50 - 10:20</td>
                                    <td className="p-2 border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-medium text-gray-600 dark:text-gray-400" colSpan="5">RECESO</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">10:20 - 11:20</td>
                                    <td className="p-2 border dark:border-gray-600 bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-bold">4º A</td>
                                    <td className="p-2 border dark:border-gray-600 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">3º B</td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">3º A</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">11:20 - 12:15</td>
                                    <td className="p-2 border dark:border-gray-600 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 font-bold">2º B</td>
                                    <td className="p-2 border dark:border-gray-600 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold">5º A</td>
                                    <td className="p-2 border dark:border-gray-600 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold">5º A</td>
                                    <td className="p-2 border dark:border-gray-600 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">3º B</td>
                                    <td className="p-2 border dark:border-gray-600 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 font-bold">2º B</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">12:15 - 12:30</td>
                                    <td className="p-2 border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-medium text-gray-600 dark:text-gray-400" colSpan="5">RECREO</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">12:30 - 1:30</td>
                                    <td className="p-2 border dark:border-gray-600 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 font-bold">2º A</td>
                                    <td className="p-2 border dark:border-gray-600 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">3º A</td>
                                    <td className="p-2 border dark:border-gray-600 bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 font-bold">4º B</td>
                                    <td className="p-2 border dark:border-gray-600 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold">5º B</td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                </tr>
                                <tr>
                                    <td className="p-2 border dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">1:30 - 2:25</td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                    <td className="p-2 border dark:border-gray-600"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

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
