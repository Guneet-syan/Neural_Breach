"use client";

import { useState, useEffect } from 'react';
import { FileText, Edit, Trash2, Eye, Award, Loader2, X } from 'lucide-react';

export default function MyResourcesPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingResource, setEditingResource] = useState<any>(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/resources');
            if (res.ok) {
                const data = await res.json();
                // Filter to show only Guneet's resources for "My Resources"
                setResources(data.filter((r: any) => r.author === 'Guneet'));
            }
        } catch (err) {
            console.error('Fetch resources failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            const res = await fetch(`http://localhost:8000/api/resources/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setResources(resources.filter(r => r.id !== id));
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleUpdate = async () => {
        if (!editingResource) return;
        try {
            const res = await fetch(`http://localhost:8000/api/resources/${editingResource.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingResource)
            });
            if (res.ok) {
                setResources(resources.map(r => r.id === editingResource.id ? editingResource : r));
                setEditingResource(null);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Resources</h1>
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <Award className="text-emerald-600" size={20} />
                    <span className="text-sm font-bold text-emerald-700">+{resources.length * 100 + 450} Contribution Points</span>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-border">
                    <Loader2 className="animate-spin text-primary mb-2" />
                    <p className="text-sm text-text-secondary">Loading your resources...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Resource</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Subject/Course</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {resources.length > 0 ? resources.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-primary rounded-lg">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{res.title}</p>
                                                <p className="text-[10px] text-text-secondary uppercase font-semibold">Added on {res.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-gray-700">{res.subject || 'General'}</p>
                                        <p className="text-[10px] text-text-secondary">{res.course}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingResource(res)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-text-secondary italic">
                                        You haven't uploaded any resources yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {editingResource && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Edit Resource</h2>
                            <button onClick={() => setEditingResource(null)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Title</label>
                                <input
                                    className="auth-input"
                                    value={editingResource.title}
                                    onChange={e => setEditingResource({ ...editingResource, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Subject</label>
                                <input
                                    className="auth-input"
                                    value={editingResource.subject}
                                    onChange={e => setEditingResource({ ...editingResource, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Description</label>
                                <textarea
                                    className="auth-input py-3 min-h-[100px]"
                                    value={editingResource.description}
                                    onChange={e => setEditingResource({ ...editingResource, description: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleUpdate}
                                className="w-full btn-primary py-3 font-bold text-lg rounded-xl mt-4"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
