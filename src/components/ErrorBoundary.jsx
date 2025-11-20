import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
                        <p className="text-gray-700 mb-4">La aplicación ha encontrado un error crítico.</p>
                        <details className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
                            <summary className="font-semibold cursor-pointer mb-2">Ver detalles del error</summary>
                            <pre className="whitespace-pre-wrap text-red-800">
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
