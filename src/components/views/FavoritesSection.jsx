import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function FavoritesSection() {
    const [isOpen, setIsOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Load favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
    }, []);

    const toggleAccordion = () => setIsOpen(!isOpen);

    return (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <button
                onClick={toggleAccordion}
                className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mis Favoritos</h2>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 space-y-4">
                    {favorites.length > 0 ? (
                        favorites.map((fav) => (
                            <div key={fav.id} className="p-4 bg-stone-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-amber-800 dark:text-amber-500">{fav.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{fav.context}</p>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3" dangerouslySetInnerHTML={{ __html: fav.content }} />
                                    </div>
                                    <StarIconSolid className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center italic">
                            Aún no tienes favoritos guardados. Marca actividades o comunicaciones con la estrella para verlas aquí.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
