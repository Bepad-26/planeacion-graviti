import { Capacitor } from '@capacitor/core';
import { Purchase } from '@capgo/capacitor-purchase';

export const initializeStore = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Web platform: Skipping store initialization');
        return;
    }

    try {
        await Purchase.initialize({
            apiKey: 'ignored_on_android', // Android doesn't use this, but iOS might need it or the plugin expects it
        });
        console.log('Store initialized');
    } catch (error) {
        console.error('Store initialization failed', error);
    }
};

export const purchaseProduct = async (productId) => {
    if (!Capacitor.isNativePlatform()) {
        console.log(`Web platform: Simulating purchase of ${productId}`);
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, transactionId: 'simulated-trans-id' };
    }

    try {
        const result = await Purchase.purchase({ productId });
        return result;
    } catch (error) {
        console.error('Purchase failed', error);
        throw error;
    }
};

export const restorePurchases = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Web platform: Simulating restore purchases');
        return;
    }

    try {
        await Purchase.restore();
    } catch (error) {
        console.error('Restore failed', error);
        throw error;
    }
};

export const checkSubscriptionStatus = async () => {
    // In a real app, you would validate the receipt with your backend here.
    // For this standalone version, we might rely on local storage or the plugin's active entitlements.
    return false;
};
