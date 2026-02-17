"use client";

import { Download, FileText, Trash2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DownloadedFile {
    id: string;
    title: string;
    course: string;
    filename: string;
    date: string;
}

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState<DownloadedFile[]>([]);

    useEffect(() => {
        // In a real app, this might come from local storage or user profile
        const mockDownloads: DownloadedFile[] = [
            { id: '1', title: 'CS101 Lecture 1 Notes', course: 'CS101', filename: 'cs101_notes.pdf', date: '2026-02-15' },
            { id: '2', title: 'Digital Electronics PYQ', course: 'DE202', filename: 'de202_pyq.pdf', date: '2026-02-16' },
        ];
        setDownloads(mockDownloads);
    }, []);

    const handleOpen = (filename: string) => {
        window.open(`http://localhost:8000/api/download/${filename}`, '_blank');
    };

    const handleDelete = (id: string) => {
        setDownloads(downloads.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Download className="text-primary" />
                    My Downloads
                </h1>
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">File Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Course</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Date Downloaded</th>
                                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {downloads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-text-secondary">
                                        No downloads yet. Explore resources to start downloading!
                                    </td>
                                </tr>
                            ) : (
                                downloads.map((file) => (
                                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 text-primary rounded flex items-center justify-center">
                                                    <FileText size={18} />
                                                </div>
                                                <button
                                                    onClick={() => handleOpen(file.filename)}
                                                    className="font-bold text-sm text-gray-700 hover:text-primary hover:underline transition-colors"
                                                >
                                                    {file.title}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                                {file.course}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            {file.date}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpen(file.filename)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Open File"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    title="Remove from List"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
