"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Event {
    id: string;
    title: string;
    type: string;
    date: string;
    status: 'upcoming' | 'due' | 'late';
}

export default function CalendarPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [newEvent, setNewEvent] = useState({ title: '', date: '2026-02-15', type: 'Assignment' });

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                // Fetch both events and exams
                const [eventsRes, examsRes] = await Promise.all([
                    fetch('http://localhost:8000/api/events').then(r => r.ok ? r.json() : []),
                    fetch('http://localhost:8000/api/exams').then(r => r.ok ? r.json() : [])
                ]);

                // Format exams into event format
                const formattedExams = (examsRes || []).map((exam: any) => ({
                    id: `exam-${exam.id}`,
                    title: `EXAM: ${exam.name}`,
                    date: exam.date.split('T')[0],
                    type: 'Exam',
                    status: 'due'
                }));

                // Fallback sample events if everything remains empty
                const sampleEvents: Event[] = [
                    { id: 's1', title: 'Start of Semester', date: '2026-02-02', type: 'Academic', status: 'upcoming' },
                    { id: 's2', title: 'CS101 Lab Submission', date: '2026-02-12', type: 'Assignment', status: 'upcoming' },
                ];

                const merged = [...(eventsRes || []), ...formattedExams];
                setEvents(merged.length > 0 ? merged : sampleEvents);
            } catch (err) {
                console.error('Calendar load error:', err);
                // Fallback to sample data instead of hanging loader
                setEvents([
                    { id: 's1', title: 'Start of Semester', date: '2026-02-02', type: 'Academic', status: 'upcoming' },
                    { id: 's2', title: 'CS101 Lab Submission', date: '2026-02-12', type: 'Assignment', status: 'upcoming' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.date) return;
        const tempId = Math.random().toString();
        const eventToAdd: Event = { ...newEvent, id: tempId, status: 'upcoming' } as any;

        // Optimistic update
        setEvents(prev => [...prev, eventToAdd]);
        setShowAddModal(false);

        try {
            await fetch('http://localhost:8000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventToAdd)
            });
        } catch (err) {
            console.error('Add event error:', err);
        }
    };

    const getDayEvents = (day: number) => {
        const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarIcon className="text-primary" />
                        Academic Calendar
                    </h1>
                    <p className="text-sm text-text-secondary mt-1">Manage your academic schedule and upcoming exams.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Event
                </button>
            </div>

            {loading ? (
                <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border border-border mt-6">
                    <Loader2 className="animate-spin text-primary mb-4" size={40} />
                    <p className="text-text-secondary animate-pulse font-medium">Loading academic schedules...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-700">February 2026</h2>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg border border-border"><ChevronLeft size={20} /></button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg border border-border"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 bg-gray-50 border-b border-border">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center text-xs font-bold text-text-secondary uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 h-[650px] bg-white">
                            {Array.from({ length: 28 }).map((_, i) => {
                                const day = i + 1;
                                const dayEvents = getDayEvents(day);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedDay(day)}
                                        className={`border-r border-b border-border p-2 hover:bg-blue-50/30 transition-all relative group cursor-pointer ${selectedDay === day ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <span className={`text-sm font-bold ${dayEvents.some(e => e.type === 'Exam') ? 'text-red-600' : 'text-gray-500'}`}>{day}</span>
                                        <div className="mt-1 space-y-1">
                                            {dayEvents.map(event => (
                                                <div
                                                    key={event.id}
                                                    title={event.title}
                                                    className={`p-1 text-[9px] font-bold rounded truncate border shadow-sm ${event.type === 'Exam' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            event.status === 'due' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                                                                'bg-blue-50 text-blue-700 border-blue-200'
                                                        }`}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Plus size={18} className="text-primary" />
                                {selectedDay ? `Events for Feb ${selectedDay}` : 'Quick Select'}
                            </h3>
                            {selectedDay ? (
                                <div className="space-y-3">
                                    {getDayEvents(selectedDay).length > 0 ? (
                                        getDayEvents(selectedDay).map(e => (
                                            <div key={e.id} className="p-3 bg-gray-50 rounded-xl border border-border">
                                                <p className="font-bold text-sm text-gray-900">{e.title}</p>
                                                <p className="text-xs text-text-secondary mt-1 uppercase font-semibold tracking-tighter">{e.type}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-text-secondary italic text-sm">
                                            No events scheduled for this day
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setNewEvent(prev => ({ ...prev, date: `2026-02-${selectedDay.toString().padStart(2, '0')}` }));
                                            setShowAddModal(true);
                                        }}
                                        className="w-full py-2 border-2 border-dashed border-primary/30 text-primary text-xs font-bold rounded-xl hover:bg-blue-50 transition-colors"
                                    >
                                        + Schedule Here
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-text-secondary text-center py-4">Click a date on the calendar to view or manage events.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Add Academic Event</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-light">×</button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary tracking-widest mb-2">Event Title</label>
                                <input
                                    type="text"
                                    className="auth-input py-3"
                                    placeholder="e.g. Physics Midterm Prep"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary tracking-widest mb-2">Event Date</label>
                                <input
                                    type="date"
                                    className="auth-input py-3"
                                    value={newEvent.date}
                                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-text-secondary tracking-widest mb-2">Category</label>
                                <select
                                    className="auth-input py-3"
                                    value={newEvent.type}
                                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                >
                                    <option value="Assignment">Assignment</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Project">Project</option>
                                    <option value="Academic">General Academic</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                                <button onClick={handleAddEvent} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:opacity-90 transition-opacity">Record Event</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

