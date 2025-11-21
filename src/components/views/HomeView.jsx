import React, { useEffect } from 'react';
import DailySummary from './DailySummary';
import ScheduleSection from './ScheduleSection';
import FavoritesSection from './FavoritesSection';
import AiEditorSection from './AiEditorSection';
import { notificationService } from '../../services/notificationService';
import { useStudents } from '../../hooks/useStudents';
import { useCurriculum } from '../../hooks/useCurriculum';

export default function HomeView() {
    const { getAllClasses, getStudentsByClass, getStudentDetail } = useStudents();
    const { getCurrentPlanTopic } = useCurriculum();

    useEffect(() => {
        const initNotifications = async () => {
            const hasPermission = await notificationService.requestPermission();
            if (!hasPermission) return;

            // Check for Birthdays
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            const classes = getAllClasses();
            const birthdayStudents = [];

            classes.forEach(cls => {
                const students = getStudentsByClass(cls);
                students.forEach(student => {
                    const details = getStudentDetail(student);
                    if (details.birthday && details.birthday.endsWith(dateKey)) {
                        birthdayStudents.push(`${student} (${cls})`);
                    }
                });
            });

            if (birthdayStudents.length > 0) {
                const lastNotified = localStorage.getItem('last_birthday_notification');
                const todayStr = today.toDateString();

                if (lastNotified !== todayStr) {
                    notificationService.sendNotification(
                        '🎂 ¡Cumpleaños hoy!',
                        `Hoy celebran: ${birthdayStudents.join(', ')}`
                    );
                    localStorage.setItem('last_birthday_notification', todayStr);
                }
            }

            // Daily Briefing (Classes)
            const plan = getCurrentPlanTopic();
            if (plan.status === 'active' && plan.subjects && plan.subjects.length > 0) {
                const lastBriefing = localStorage.getItem('last_daily_briefing');
                const todayStr = today.toDateString();

                if (lastBriefing !== todayStr) {
                    notificationService.sendNotification(
                        '📅 Clases de Hoy',
                        `Tienes ${plan.subjects.length} clases: ${plan.subjects.join(', ')}`
                    );
                    localStorage.setItem('last_daily_briefing', todayStr);
                }
            }
        };

        initNotifications();
    }, [getAllClasses, getStudentsByClass, getStudentDetail, getCurrentPlanTopic]);

    const isWidgetVisible = (widgetName) => {
        const hidden = JSON.parse(localStorage.getItem('hidden_widgets') || '[]');
        return !hidden.includes(widgetName);
    };

    return (
        <div className="animate-fade-in pb-20">
            {isWidgetVisible('DailySummary') && <DailySummary />}
            {isWidgetVisible('ScheduleSection') && <ScheduleSection />}
            {isWidgetVisible('FavoritesSection') && <FavoritesSection />}
            {isWidgetVisible('AiEditorSection') && <AiEditorSection />}
        </div>
    );
}
