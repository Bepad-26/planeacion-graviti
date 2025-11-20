import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { purchaseProduct } from '../../services/payments';
import { usePremium } from '../../hooks/usePremium';

export default function SubscriptionView() {
    const { isPro, activatePro } = usePremium();

    const handlePurchase = async () => {
        try {
            await purchaseProduct('plan_anual');
            activatePro();
            alert('¡Suscripción activada con éxito!');
        } catch {
            alert('Error al procesar la compra.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Mejora tu Experiencia</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">Desbloquea todo el potencial de tu Asistente Docente</p>
            </div>

            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-amber-200 dark:border-amber-900">
                <div className="bg-amber-500 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Plan Anual</h2>
                    <p className="text-amber-100 mt-2">Acceso total a todas las funciones</p>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white">$499</span>
                        <span className="text-gray-500 dark:text-gray-400">/año</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {[
                            'Exportación a PDF, Excel y Word',
                            'Análisis avanzado con IA',
                            'Credenciales con código QR',
                            'Reportes detallados',
                            'Respaldo en la nube'
                        ].map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handlePurchase}
                        disabled={isPro}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${isPro
                            ? 'bg-green-100 text-green-800 cursor-default'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isPro ? '¡Ya eres Pro!' : 'Suscribirme Ahora'}
                    </button>

                    {!isPro && (
                        <p className="text-xs text-center text-gray-400 mt-4">
                            Pago seguro procesado por Google Play
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
