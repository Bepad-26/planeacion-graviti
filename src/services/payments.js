import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';

export const initializeStore = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Web platform: Skipping store initialization');
        return;
    }

    try {
        // Use a placeholder API key for now. User will need to replace this.
        await Purchases.configure({ apiKey: "goog_placeholder_api_key" });
        console.log('Store initialized with RevenueCat');
    } catch (error) {
        console.error('Store initialization failed', error);
    }
};

export const purchaseProduct = async (productId) => {
    if (!Capacitor.isNativePlatform()) {
        console.log(`Web platform: Simulating purchase of ${productId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, transactionId: 'simulated-trans-id' };
    }

    try {
        // RevenueCat flow: get offerings -> purchase package
        // For simplicity in this scaffold, we'll try to purchase by product ID if possible,
        // but RevenueCat prefers Packages.
        // We'll assume the user sets up an Offering with a Package that matches the ID or just use the raw product.
        // Actually, purchaseProduct in RC takes a generic product identifier string in some versions, 
        // but typically you purchase a Package.
        // Let's try to get offerings first.

        const offerings = await Purchases.getOfferings();
        if (offerings.current && offerings.current.availablePackages.length > 0) {
            const packageToBuy = offerings.current.availablePackages.find(pkg => pkg.product.identifier === productId) || offerings.current.availablePackages[0];
            const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToBuy });
            return { success: true, customerInfo };
        } else {
            // Fallback or error
            console.warn("No offerings found");
            throw new Error("No offerings found");
        }
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
        const { customerInfo } = await Purchases.restorePurchases();
        return customerInfo;
    } catch (error) {
        console.error('Restore failed', error);
        throw error;
    }
};

export const checkSubscriptionStatus = async () => {
    if (!Capacitor.isNativePlatform()) {
        return false;
    }
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        // Check if "pro" entitlement is active
        return typeof customerInfo.entitlements.active['pro'] !== "undefined";
    } catch (error) {
        console.error("Error checking status", error);
        return false;
    }
};
