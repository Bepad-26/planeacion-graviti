import React from 'react';
import BottomNav from './BottomNav';
import { useTheme } from '../../hooks/useTheme';
import { useOffline } from '../../hooks/useOffline';
import { SunIcon, MoonIcon, WifiIcon } from '@heroicons/react/24/outline';

export default function Layout({ children, activeView, onViewChange }) {
    const { theme, toggleTheme } = useTheme();
    const isOffline = useOffline();

    return (
        <div className="min-h-screen bg-[#FDFBF8] dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
            {/* Offline Banner */}
            {isOffline && (
                <div className="bg-red-500 text-white text-center py-1 text-sm font-medium flex justify-center items-center gap-2 animate-fade-in">
                    <WifiIcon className="w-4 h-4" />
                    Sin conexión a internet. Trabajando en modo offline.
                </div>
            )}

            <div className="container mx-auto p-4 md:p-8 max-w-7xl pb-24">
                {/* Header with Theme Toggle */}
                {activeView === 'home' && (
                    <header className="text-center mb-8 relative">
                        <div className="flex justify-center items-center gap-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">Inicio</h1>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="w-6 h-6" />
                                ) : (
                                    <MoonIcon className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Bienvenido, aquí tienes un resumen de tu día.</p>
                    </header>
                )}

                <main>
                    {children}
                </main>
            </div>
            <BottomNav activeView={activeView} onViewChange={onViewChange} />
        </div>
    );
}
