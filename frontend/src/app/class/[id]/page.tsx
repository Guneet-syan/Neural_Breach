"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, Clock, Download, Zap, AlertCircle } from 'lucide-react';

const classesData = {
    "1": { name: 'Computer Science 101', code: 'CS101', instructor: 'Dr. Smith', syllabus: 'syllabus_cs101.pdf', quickSheet: 'quick_sheet_cs101.pdf' },
    "2": { name: 'Digital Electronics', code: 'EC201', instructor: 'Prof. Joshi', syllabus: 'syllabus_ec201.pdf', quickSheet: 'quick_sheet_cs101.pdf' },
    "3": { name: 'Data Structures', code: 'CS202', instructor: 'Dr. Sharma', syllabus: 'syllabus_cs202.pdf', quickSheet: 'quick_sheet_cs101.pdf' },
};

export default function ClassPage() {
    const params = useParams();
    const id = params.id as string;
    const classInfo = classesData[id as keyof typeof classesData] || { name: 'Course Not Found', code: 'N/A', instructor: 'N/A' };

    const [exams, setExams] = useState<any[]>([]);
    const [isExamWindow, setIsExamWindow] = useState(false);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/exams');
                if (res.ok) {
                    const data = await res.json();
                    setExams(data);

                    // Logic: Check if today (Feb 17, 2026) is within 14 days of any exam
                    const today = new Date('2026-02-17');
                    const windowActive = data.some((exam: any) => {
                        const examDate = new Date(exam.date);
                        const diffTime = Math.abs(examDate.getTime() - today.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays <= 14; // Before or After 14 days
                    });
                    setIsExamWindow(windowActive);
                }
            } catch (err) {
                console.error('Exam check failed:', err);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm relative overflow-hidden">
                {isExamWindow && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-6 py-1 font-bold text-[10px] uppercase tracking-widest rotate-0 ml-auto flex items-center gap-1 rounded-bl-xl shadow-lg animate-pulse">
                        <AlertCircle size={12} /> Exam Season Active
                    </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-primary font-bold text-sm tracking-widest uppercase">{classInfo.code}</span>
                        <h1 className="text-3xl font-bold mt-1">{classInfo.name}</h1>
                        <p className="text-text-secondary mt-2 flex items-center gap-2">
                            <Users size={18} /> Shared with 156 students
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.open(`http://localhost:8000/api/download/${(classInfo as any).syllabus || 'syllabus.pdf'}`, '_blank')}
                            className="btn-secondary"
                        >
                            View Syllabus
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Recent Materials</h2>
                        {isExamWindow && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200 uppercase tracking-tighter">New Exam Resources Added</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { id: 1, title: 'Lecture 1 Notes', filename: 'cs101_notes.pdf', isExamRelevant: true },
                            { id: 2, title: 'Lecture 2 Notes', filename: 'cs302_notes.pdf', isExamRelevant: true },
                            { id: 3, title: 'Exam Prep PYQ', filename: 'de202_pyq.pdf', isExamRelevant: true },
                            { id: 4, title: 'General Overview', filename: 'cs101_notes.pdf', isExamRelevant: false },
                        ].map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `http://localhost:8000/api/download/${item.filename}`;
                                    link.target = '_blank';
                                    link.download = item.filename;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className={`bg-white p-4 rounded-xl border transition-all group cursor-pointer shadow-sm relative ${isExamWindow && item.isExamRelevant ? 'border-red-200 bg-red-50/10 hover:border-red-400' : 'border-border hover:border-primary'}`}
                            >
                                {isExamWindow && item.isExamRelevant && (
                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-0.5 rounded-lg text-[8px] font-black shadow-lg border border-white z-10 animate-bounce">
                                        EXAM
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isExamWindow && item.isExamRelevant ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold truncate">{item.title}</h3>
                                            <Download size={14} className={`${isExamWindow && item.isExamRelevant ? 'text-red-600' : 'text-primary'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                                            <Clock size={12} /> Uploaded 2 days ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* NEW QUICK SHEET SECTION */}
                    <div className="mt-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="text-amber-500 fill-amber-500" size={24} />
                            <h2 className="text-xl font-bold italic tracking-tighter">Fast-Track Quick Sheets</h2>
                        </div>
                        <div
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = `http://localhost:8000/api/download/${(classInfo as any).quickSheet}`;
                                link.target = '_blank';
                                link.download = (classInfo as any).quickSheet;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 rounded-2xl cursor-pointer group hover:scale-[1.01] transition-all shadow-xl shadow-orange-100"
                        >
                            <div className="bg-white p-6 rounded-[14px] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <Zap size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight">THE ULTIMATE FORMULA SHEET</h3>
                                        <p className="text-sm text-text-secondary">Everything you need for the {classInfo.code} exam in one page.</p>
                                    </div>
                                </div>
                                <button className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-amber-200 group-hover:bg-amber-600 transition-colors">
                                    Grab It Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Course Info</h2>
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <Users size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary">Instructor</p>
                                <p className="font-semibold text-sm">{classInfo.instructor}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <Clock size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary">Schedule</p>
                                <p className="font-semibold text-sm">Mon, Wed 10:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <BookOpen size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary">Office</p>
                                <p className="font-semibold text-sm">Room 302, Academic Block</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
