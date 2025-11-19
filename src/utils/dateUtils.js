export const getSchoolWeek = (startDateStr, currentDate = new Date()) => {
    const start = new Date(startDateStr);
    const now = new Date(currentDate);

    // Reset hours to compare just dates
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If before start date
    if (now < start) return { week: 0, trimester: 0 };

    const weekNumber = Math.floor(diffDays / 7) + 1;

    // Approximate trimester calculation (12 weeks per trimester)
    let trimester = 1;
    if (weekNumber > 24) trimester = 3;
    else if (weekNumber > 12) trimester = 2;

    return { week: weekNumber, trimester };
};

export const getDaySchedule = (dayIndex) => {
    // 0 = Sunday, 1 = Monday, ...
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[dayIndex];
};

export const getCurrentTimeSlot = (schedule) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return schedule.find(slot => {
        const [start, end] = slot.time.split(' - ');
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);

        const startTotal = startHour * 60 + startMin;
        const endTotal = endHour * 60 + endMin;

        return currentMinutes >= startTotal && currentMinutes < endTotal;
    });
};
