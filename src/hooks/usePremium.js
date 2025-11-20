import { useState, useEffect } from 'react';

export const usePremium = () => {
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        // Check local storage or remote status
        const status = localStorage.getItem('is_pro_active');
        setIsPro(status === 'true');
    }, []);

    const activatePro = () => {
        setIsPro(true);
        localStorage.setItem('is_pro_active', 'true');
    };

    const deactivatePro = () => {
        setIsPro(false);
        localStorage.removeItem('is_pro_active');
    };

    return {
        isPro,
        activatePro,
        deactivatePro
    };
};
