export const notificationService = {
    requestPermission: async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return false;
        }

        if (Notification.permission === "granted") {
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    },

    sendNotification: (title, body, icon = '/vite.svg') => {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body,
                icon,
                vibrate: [200, 100, 200]
            });
        }
    },

    // Simple scheduler that checks every minute
    // In a real app, you might use a more robust background worker
    scheduleCheck: (checkFunction, interval = 60000) => {
        setInterval(checkFunction, interval);
    }
};
