import React, { useState, useEffect } from 'react';
import { FolderIcon, PlusIcon, TrashIcon, MagnifyingGlassIcon, LinkIcon, DocumentIcon, CameraIcon } from '@heroicons/react/24/outline';
import CameraScanner from './CameraScanner';
import { useStudents } from '../../hooks/useStudents';

export default function ResourcesView() {
    const { getAllClasses } = useStudents();
    const [resources, setResources] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', type: 'link', url: '', description: '', class: 'General' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        const savedResources = localStorage.getItem('educational_resources');
        if (savedResources) {
            setResources(JSON.parse(savedResources));
        }
    }, []);

    const saveResources = (updatedResources) => {
        setResources(updatedResources);
        localStorage.setItem('educational_resources', JSON.stringify(updatedResources));
    };

    const handleAddResource = () => {
        if (!newResource.title) return;
        const updated = [...resources, { ...newResource, id: Date.now(), date: new Date().toISOString() }];
        saveResources(updated);
        setShowAddModal(false);
        setNewResource({ title: '', type: 'link', url: '', description: '', class: 'General' });
    };

    const handleDelete = (id) => {
        const updated = resources.filter(r => r.id !== id);
        saveResources(updated);
    };

    const handleCameraCapture = (imageSrc) => {
        const updated = [...resources, {
            id: Date.now(),
            title: `Escaneo ${new Date().toLocaleDateString()}`,
            type: 'image',
            url: imageSrc, // Storing base64 directly (careful with storage limits)
            description: 'Documento escaneado',
            class: 'General',
            date: new Date().toISOString()
        }];
        saveResources(updated);
        setShowCamera(false);
    };

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || r.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="animate-fade-in pb-24 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Biblioteca de Recursos</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCamera(true)}
                        className="bg-gray-800 text-white p-2 rounded-xl hover:bg-gray-700 transition-colors"
                        title="Escanear Documento"
                    >
                        <CameraIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-amber-600 text-white p-2 rounded-xl hover:bg-amber-700 transition-colors"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <div className="relative flex-1 min-w-[200px]">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar recursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">Todos</option>
                    <option value="link">Enlaces</option>
                    <option value="file">Archivos</option>
                    <option value="image">Escaneos</option>
                </select>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(resource => (
                    <div key={resource.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                                {resource.type === 'link' && <LinkIcon className="w-6 h-6" />}
                                {resource.type === 'file' && <DocumentIcon className="w-6 h-6" />}
                                {resource.type === 'image' && <CameraIcon className="w-6 h-6" />}
                            </div>
                            <button onClick={() => handleDelete(resource.id)} className="text-gray-400 hover:text-red-500">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-1">{resource.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{resource.description}</p>

                        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {resource.class || 'General'}
                            </span>
                            {resource.type === 'link' ? (
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 hover:underline font-medium">
                                    Abrir Link
                                </a>
                            ) : resource.type === 'image' ? (
                                <button onClick={() => {
                                    const w = window.open("");
                                    w.document.write(`<img src="${resource.url}" style="max-width:100%"/>`);
                                }} className="text-sm text-amber-600 hover:underline font-medium">
                                    Ver Imagen
                                </button>
                            ) : (
                                <span className="text-xs text-gray-400">Archivo Local</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Nuevo Recurso</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Título"
                                value={newResource.title}
                                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <select
                                value={newResource.type}
                                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="link">Enlace Web</option>
                                <option value="file">Referencia a Archivo</option>
                            </select>
                            {newResource.type === 'link' && (
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={newResource.url}
                                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            )}
                            <textarea
                                placeholder="Descripción"
                                value={newResource.description}
                                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Clase / Materia"
                                value={newResource.class}
                                onChange={(e) => setNewResource({ ...newResource, class: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300">Cancelar</button>
                            <button onClick={handleAddResource} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Modal */}
            {showCamera && (
                <CameraScanner
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </div>
    );
}
