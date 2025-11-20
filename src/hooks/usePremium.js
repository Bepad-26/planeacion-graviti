import { useState } from 'react';

export const usePremium = () => {
    const [isPro, setIsPro] = useState(() => {
        return localStorage.getItem('is_pro_active') === 'true';
    });

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
