"use client";

import {
  FileText,
  ExternalLink,
  Clock,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Calendar,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExamTimer from '@/components/ExamTimer';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-3">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-blue-50 opacity-90 text-lg mb-6">
            {user?.course || 'Academic Resource Hub'} {user?.branch ? `• ${user.branch}` : ''} {user?.semester ? `• Semester ${user.semester}` : ''} {user?.college ? `• ${user.college}` : ''}
          </p>
          <div className="flex gap-3">
            <Link href="/explore" className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              Explore New Notes
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 hidden md:block opacity-20 transform translate-x-10 -translate-y-10 scale-150">
          <BookOpen size={200} />
        </div>
      </section>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Credits" value="2,450" change="+12% this week" icon={TrendingUp} color="text-emerald-500" />
        <StatCard title="Resources Shared" value="14" change="Rank #3 in CS" icon={FileText} color="text-blue-500" />
        <StatCard title="AI Summaries" value="89" change="Saved 4.5 hours" icon={Clock} color="text-purple-500" />
        <StatCard title="Collaborators" value="128" change="+5 today" icon={ExternalLink} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Resources */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Resources</h2>
            <Link href="/explore" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResourceCard
              title="Data Structures Cheat Sheet"
              course="CS101"
              author="Rohit S."
              type="Handwritten OCR"
              date="2h ago"
            />
            <ResourceCard
              title="Digital Electronics PYQ 2024"
              course="DE202"
              author="Admin"
              type="PDF"
              date="5h ago"
            />
            <ResourceCard
              title="Operating Systems Notes"
              course="CS301"
              author="Priya K."
              type="AI Summary"
              date="1d ago"
            />
            <ResourceCard
              title="Algorithms Lab Manual"
              course="CS101"
              author="Amit B."
              type="Word"
              date="2d ago"
            />
          </div>
        </div>

        {/* Up Next / Notifications */}
        <div className="space-y-4">
          <ExamTimer />

          <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Assignment Deadline</p>
                <p className="text-xs text-text-secondary">Theory of Computation - 11:59 PM</p>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Group Study Session</p>
                <p className="text-xs text-text-secondary">Library Block B - 4:00 PM</p>
              </div>
            </div>
            <Link href="/calendar">
              <button className="w-full py-2 text-sm font-semibold text-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                Go to Calendar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-[10px] text-emerald-600 font-medium px-1.5 py-0.5 bg-emerald-50 rounded-full inline-block mt-1">
          {change}
        </p>
      </div>
    </div>
  );
}

function ResourceCard({ title, course, author, type, date }: any) {
  return (
    <div className="glass p-5 group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-blue-50 text-primary rounded-lg">
          <FileText size={20} />
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-text-secondary uppercase">
          {type}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 truncate">
        {title}
      </h3>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[8px] font-bold uppercase">
            {author[0]}
          </div>
          <span className="text-xs text-text-secondary">{author}</span>
        </div>
        <span className="text-xs text-text-secondary">{date}</span>
      </div>
    </div>
  );
}

