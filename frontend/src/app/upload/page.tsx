"use client";

import { Upload, File as FileIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

export default function UploadPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        title: '',
        subject: '',
        course: '',
        semester: '',
        year: '',
        type: 'Notes',
        description: '',
        privacy: 'public'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setMetadata({ ...metadata, title: file.name.split('.')[0] });
            setUploadStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', metadata.title);
        formData.append('subject', metadata.subject);
        formData.append('course', metadata.course || 'GENERAL');
        formData.append('author', 'Guneet');
        formData.append('type', metadata.type);
        formData.append('privacy', metadata.privacy);
        formData.append('semester', metadata.semester);
        formData.append('year', metadata.year);
        formData.append('description', metadata.description);
        formData.append('college', 'Global Institute of Tech');

        try {
            const response = await fetch('http://localhost:8000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setSelectedFile(null);
                setMetadata({
                    title: '',
                    subject: '',
                    course: '',
                    semester: '',
                    year: '',
                    type: 'Notes',
                    description: '',
                    privacy: 'public'
                });
            } else {
                setUploadStatus('error');
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 font-heading">Upload Resource</h1>
                <p className="text-text-secondary">Share your knowledge and earn credits. Your contributions help the community grow.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-white rounded-2xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center group transition-colors cursor-pointer h-full ${selectedFile ? 'border-primary bg-blue-50/30' : 'border-border hover:border-primary'
                        }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${selectedFile ? 'bg-primary text-white' : 'bg-blue-50 text-primary group-hover:scale-110'
                        }`}>
                        {isUploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                    </div>

                    {selectedFile ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <p className="font-bold text-lg mb-1 truncate max-w-[250px]">{selectedFile.name}</p>
                            <p className="text-sm text-text-secondary mb-2">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                className="text-xs font-bold text-red-500 hover:underline"
                            >
                                Remove File
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="font-bold text-lg mb-1">Click to upload or drag and drop</p>
                            <p className="text-sm text-text-secondary mb-6">PDF, PNG, JPG or DOCX (max. 50MB)</p>
                            <button className="btn-primary">Select Files</button>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-border p-8 space-y-4">
                    <h2 className="text-xl font-bold">Resource Details</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Resource Title</label>
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="e.g. Data Structures Notes"
                                value={metadata.title}
                                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Subject</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="e.g. Algorithms"
                                    value={metadata.subject}
                                    onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Course Name</label>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="e.g. B.Tech CS"
                                    value={metadata.course}
                                    onChange={(e) => setMetadata({ ...metadata, course: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Semester</label>
                                <select
                                    className="auth-input"
                                    value={metadata.semester}
                                    onChange={(e) => setMetadata({ ...metadata, semester: e.target.value })}
                                >
                                    <option value="">Select Sem</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Resource Type</label>
                                <select
                                    className="auth-input"
                                    value={metadata.type}
                                    onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
                                >
                                    <option value="Notes">Notes</option>
                                    <option value="PYQ">Previous Year Ques</option>
                                    <option value="Summary">Summary</option>
                                    <option value="Practical">Practical Lab</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Year</label>
                                <select
                                    className="auth-input"
                                    value={metadata.year}
                                    onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
                                >
                                    <option value="">Select Year</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Privacy</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setMetadata({ ...metadata, privacy: 'public' })}
                                        className={`flex-1 py-2 rounded-lg border text-[10px] font-bold transition-all ${metadata.privacy === 'public' ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        Public
                                    </button>
                                    <button
                                        onClick={() => setMetadata({ ...metadata, privacy: 'private' })}
                                        className={`flex-1 py-2 rounded-lg border text-[10px] font-bold transition-all ${metadata.privacy === 'private' ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-100'}`}
                                    >
                                        Private
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-text-secondary mb-1">Description (Optional)</label>
                            <textarea
                                className="auth-input min-h-[80px] py-3"
                                placeholder="Tell us more about this resource..."
                                value={metadata.description}
                                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        className="w-full btn-primary py-3 text-lg font-bold shadow-lg shadow-blue-100"
                        disabled={isUploading || !selectedFile}
                    >
                        {isUploading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                Uploading...
                            </div>
                        ) : 'Publish Resource'}
                    </button>
                </div>
            </div>

            {uploadStatus === 'success' && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center gap-4 text-emerald-800 animate-in slide-in-from-top-4 shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <p className="font-extrabold text-lg">Upload Successful!</p>
                        <p className="text-sm opacity-90">Your resource has been published and is now visible to others.</p>
                    </div>
                </div>
            )}
        </div>
    );
}


