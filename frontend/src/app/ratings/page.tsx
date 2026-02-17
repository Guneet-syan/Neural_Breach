"use client";

import { Star, Send, User, MessageSquare, CheckCircle, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Teacher {
    name: string;
    subject: string;
}

interface Rating {
    id?: string;
    teacher_name: string;
    subject: string;
    rating: number;
    feedback: string;
    date: string;
}

export default function RatingsPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeachers();
        fetchRatings();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/teachers');
            const data = await res.json();
            setTeachers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRatings = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/ratings');
            const data = await res.json();
            setRatings(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacher || ratingValue === 0) return;

        const newRating: Rating = {
            id: 'temp-' + Date.now(),
            teacher_name: selectedTeacher.name,
            subject: selectedTeacher.subject,
            rating: ratingValue,
            feedback: feedback,
            date: new Date().toISOString().split('T')[0]
        };

        // Optimistic Update
        setRatings([newRating, ...ratings]);
        setIsSuccess(true);
        const savedFeedback = feedback;
        const savedTeacher = selectedTeacher;
        const savedRating = ratingValue;

        // Reset form immediately for "instant" feel
        setRatingValue(0);
        setFeedback('');
        setSelectedTeacher(null);
        setTimeout(() => setIsSuccess(false), 2000);

        try {
            const res = await fetch('http://localhost:8000/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacher_name: savedTeacher.name,
                    subject: savedTeacher.subject,
                    rating: savedRating,
                    feedback: savedFeedback
                })
            });

            if (!res.ok) {
                // Rollback if failed
                setRatings(prev => prev.filter(r => r.id !== newRating.id));
                alert("Failed to submit rating. Please try again.");
            } else {
                fetchRatings(); // Refresh to get real ID
            }
        } catch (err) {
            console.error(err);
            setRatings(prev => prev.filter(r => r.id !== newRating.id));
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-in slide-in-from-bottom-4 duration-500">
            <header className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-black font-heading text-gray-900 tracking-tight mb-2">Teacher <span className="text-primary">Ratings</span></h1>
                        <p className="text-text-secondary text-lg leading-relaxed font-medium">Share your experience and help improve campus learning quality through anonymous feedback.</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Rating Form */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-white rounded-3xl border border-border p-8 shadow-xl relative overflow-hidden">
                        {isSuccess && (
                            <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                                <CheckCircle size={64} className="text-emerald-500 mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-gray-900">Feedback Shared!</h3>
                                <p className="text-text-secondary">Thank you for your rating.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase text-text-secondary tracking-widest block">1. Select Teacher</label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search teacher..."
                                        className="auth-input pl-10 h-10 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                                    {filteredTeachers.map(teacher => (
                                        <button
                                            key={teacher.name}
                                            type="button"
                                            onClick={() => setSelectedTeacher(teacher)}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all group ${selectedTeacher?.name === teacher.name
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-blue-100'
                                                : 'bg-gray-50 border-transparent hover:border-blue-200'
                                                }`}
                                        >
                                            <p className="font-bold text-sm leading-tight group-hover:translate-x-1 transition-transform">{teacher.name}</p>
                                            <p className={`text-[10px] ${selectedTeacher?.name === teacher.name ? 'text-blue-100' : 'text-text-secondary'}`}>{teacher.subject}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="text-xs font-black uppercase text-text-secondary tracking-widest block">2. Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRatingValue(star)}
                                            className="transition-all hover:scale-110"
                                        >
                                            <Star
                                                size={32}
                                                className={`${ratingValue >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="text-xs font-black uppercase text-text-secondary tracking-widest block">3. Detailed Feedback</label>
                                <textarea
                                    placeholder="Tell us more about the teaching style, material quality, etc..."
                                    className="auth-input min-h-[120px] py-4 text-sm"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedTeacher || ratingValue === 0}
                                className="btn-primary w-full py-4 text-sm font-black flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Submit Rating <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </section>
                </div>

                {/* Recent Ratings Wall */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <MessageSquare className="text-primary" size={24} /> Recent Wall of Feedback
                        </h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-text-secondary bg-gray-50 px-4 py-2 rounded-full cursor-help hover:bg-gray-100 transition-colors">
                            <CheckCircle size={14} className="text-emerald-500" /> Anonymous
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ratings.length === 0 ? (
                            <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-text-secondary font-medium">No feedback yet. Be the first to share!</p>
                            </div>
                        ) : (
                            ratings.map(r => (
                                <div key={r.id} className="bg-white p-6 rounded-3xl border border-border hover:shadow-xl transition-all group overflow-hidden relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className={`${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-100'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-text-secondary font-bold">{r.date}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">{r.teacher_name}</h4>
                                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{r.subject}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed italic">"{r.feedback}"</p>
                                    </div>
                                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                                        <MessageSquare size={100} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
