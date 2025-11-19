import React from 'react';
import DailySummary from './DailySummary';
import ScheduleSection from './ScheduleSection';
import FavoritesSection from './FavoritesSection';
import AiEditorSection from './AiEditorSection';

export default function HomeView() {
    return (
        <div className="animate-fade-in pb-20">
            <DailySummary />
            <ScheduleSection />
            <FavoritesSection />
            <AiEditorSection />
        </div>
    );
}
