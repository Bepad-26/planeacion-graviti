import React from 'react';
import { HomeIcon, CalendarIcon, ClipboardDocumentListIcon, ChartBarIcon, BookOpenIcon, Cog6ToothIcon, StarIcon } from '@heroicons/react/24/outline';

export default function BottomNav({ activeView, onViewChange }) {
    const navItems = [
        { id: 'home', label: 'Inicio', icon: HomeIcon },
        { id: 'planner', label: 'Planeación', icon: CalendarIcon },
        { id: 'roll-call', label: 'Asistencia', icon: ClipboardDocumentListIcon },
        { id: 'evaluation', label: 'Evaluación', icon: ChartBarIcon },
        { id: 'notebook', label: 'Cuaderno', icon: BookOpenIcon },
        { id: 'subscription', label: 'Premium', icon: StarIcon },
        { id: 'settings', label: 'Ajustes', icon: Cog6ToothIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
            <div className="flex justify-around items-center h-16 overflow-x-auto px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 ${isActive ? 'text-amber-600 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
