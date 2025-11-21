import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { CameraIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function CameraScanner({ onCapture, onClose }) {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    }, [webcamRef]);

    const handleRetake = () => {
        setImage(null);
    };

    const handleConfirm = () => {
        if (onCapture) {
            onCapture(image);
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-700"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {image ? (
                    <img src={image} alt="Captured" className="w-full h-auto" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-auto"
                        videoConstraints={{ facingMode: 'environment' }}
                    />
                )}

                <div className="p-6 flex justify-center gap-6 bg-gray-900">
                    {image ? (
                        <>
                            <button
                                onClick={handleRetake}
                                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white"
                            >
                                <div className="p-3 rounded-full border border-gray-600">
                                    <XMarkIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xs">Reintentar</span>
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex flex-col items-center gap-1 text-green-400 hover:text-green-300"
                            >
                                <div className="p-3 rounded-full bg-green-900/30 border border-green-600">
                                    <CheckIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xs">Guardar</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={capture}
                            className="p-4 rounded-full bg-white text-black hover:bg-gray-200 transition-transform active:scale-95"
                        >
                            <CameraIcon className="w-8 h-8" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
