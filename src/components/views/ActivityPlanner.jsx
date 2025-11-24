import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Sortable Item Component
function SortableItem({ id, activity }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white dark:bg-gray-800 p-3 mb-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow">
            <p className="font-medium text-gray-800 dark:text-white text-sm">{activity.title}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.duration} min</span>
        </div>
    );
}

// Droppable Column Component
function DayColumn({ day, activities }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl min-h-[300px]">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> {day}
            </h3>
            <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
                {activities.map(activity => (
                    <SortableItem key={activity.id} id={activity.id} activity={activity} />
                ))}
            </SortableContext>
            {activities.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    Arrastra actividades aquí
                </div>
            )}
        </div>
    );
}

export default function ActivityPlanner() {
    const [activities, setActivities] = useState(() => {
        const saved = localStorage.getItem('weekly_planner_activities');
        return saved ? JSON.parse(saved) : {
            'Lunes': [
                { id: '1', title: 'Matemáticas: Sumas', duration: 45 },
                { id: '2', title: 'Español: Lectura', duration: 30 }
            ],
            'Martes': [],
            'Miércoles': [],
            'Jueves': [],
            'Viernes': []
        };
    });

    React.useEffect(() => {
        localStorage.setItem('weekly_planner_activities', JSON.stringify(activities));
    }, [activities]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        // Find source and destination containers
        const findContainer = (id) => {
            if (id in activities) return id;
            return Object.keys(activities).find(key => activities[key].find(item => item.id === id));
        };

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Move item between containers
        setActivities(prev => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex(item => item.id === active.id);
            const overIndex = overItems.findIndex(item => item.id === over.id);

            let newIndex;
            if (overIndex === -1) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem = over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter(item => item.id !== active.id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, overItems.length)
                ]
            };
        });
    };

    return (
        <div className="animate-fade-in pb-24 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Planificador Semanal</h2>
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Nueva Actividad
                </button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
                    {Object.keys(activities).map(day => (
                        <DayColumn key={day} day={day} activities={activities[day]} />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
