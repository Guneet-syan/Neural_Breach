"use client";

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface Exam {
    id: string;
    name: string;
    date: string;
}

export default function ExamTimer() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetch('http://localhost:8000/api/exams')
            .then(res => res.json())
            .then(data => setExams(data));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft: { [key: string]: string } = {};
            exams.forEach(exam => {
                const difference = +new Date(exam.date) - +new Date();
                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((difference / 1000 / 60) % 60);
                    const seconds = Math.floor((difference / 1000) % 60);
                    newTimeLeft[exam.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                } else {
                    newTimeLeft[exam.id] = "Exam Finished";
                }
            });
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [exams]);

    if (exams.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                <h3 className="text-red-700 font-bold flex items-center gap-2">
                    <Clock size={18} />
                    Exam Countdown
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full uppercase">Urgent</span>
            </div>
            <div className="p-4 space-y-4">
                {exams.map(exam => (
                    <div key={exam.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{exam.name}</p>
                            <p className="text-[10px] text-text-secondary">{new Date(exam.date).toLocaleDateString()} at {new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-mono font-bold text-primary">{timeLeft[exam.id] || "00d 00h 00m 00s"}</p>
                            <div className="w-full bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-1000" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
