"use client";

import { Search, Filter, BookOpen, Download, FileText, Loader2, X } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Resource {
    id: string;
    title: string;
    subject?: string;
    course: string;
    type: string;
    author: string;
    downloads: number;
    filename?: string;
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading Explore...</div>}>
            <ExploreContent />
        </Suspense>
    );
}

function ExploreContent() {
    const searchParams = useSearchParams();
    const urlSearch = searchParams.get('search') || '';

    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [filterSemester, setFilterSemester] = useState<string>('');
    const [filterYear, setFilterYear] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setSearchQuery(urlSearch);
    }, [urlSearch]);

    const availableCourses = ['CS101', 'CS202', 'CS204', 'CS301', 'CS302', 'EC201', 'BCA', 'B.Tech CS'];
    const resourceTypes = ['Notes', 'PYQ', 'Summary', 'Practical'];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
    const years = [2023, 2024, 2025, 2026];

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResources();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [selectedCourses, selectedTypes, filterSemester, filterYear, searchQuery]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCourses.length > 0) params.append('course', selectedCourses.join(','));
            if (selectedTypes.length > 0) params.append('type', selectedTypes.join(','));
            if (filterSemester) params.append('semester', filterSemester);
            if (filterYear) params.append('year', filterYear);
            if (searchQuery) params.append('search', searchQuery);

            const res = await fetch(`http://localhost:8000/api/resources?${params.toString()}`);
            const data = await res.json();
            setResources(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleDownload = async (res: any) => {
        if (!res.filename) {
            alert("This is a preview resource without a real file attachment.");
            return;
        }
        window.open(`http://localhost:8000/api/download/${res.filename}`, '_blank');
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-black font-heading text-gray-900 tracking-tight mb-2">Explore <span className="text-primary">Resources</span></h1>
                        <p className="text-text-secondary text-lg leading-relaxed font-medium">Find formula sheets, previous year papers, and curated study notes shared by your batchmates.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search by title, subject, or course..."
                                className="auth-input pl-12 h-12 w-full md:w-[350px] shadow-sm hover:border-primary transition-all bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 h-12 px-6 border-2 rounded-xl font-bold transition-all ${(showFilters || selectedCourses.length > 0 || selectedTypes.length > 0)
                                ? 'bg-primary text-white border-primary shadow-lg shadow-blue-200'
                                : 'bg-white border-border hover:border-primary hover:text-primary'
                                }`}
                        >
                            <Filter size={20} />
                            {(selectedCourses.length + selectedTypes.length) > 0 ? (
                                <span className="flex items-center gap-2">
                                    Filters
                                    <span className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-[10px]">{selectedCourses.length + selectedTypes.length}</span>
                                </span>
                            ) : 'Filters'}
                        </button>
                    </div>
                </div>

                {/* Tags View (Quick Access) */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {availableCourses.slice(0, 5).map(course => (
                        <button
                            key={course}
                            onClick={() => toggleFilter(selectedCourses, setSelectedCourses, course)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCourses.includes(course)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-border hover:bg-blue-50 hover:border-blue-200'
                                }`}
                        >
                            {course}
                        </button>
                    ))}
                    {selectedCourses.length > 0 || selectedTypes.length > 0 ? (
                        <button
                            onClick={() => {
                                setSelectedCourses([]);
                                setSelectedTypes([]);
                                setFilterSemester('');
                                setFilterYear('');
                            }}
                            className="px-4 py-1.5 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-1"
                        >
                            <X size={14} /> Clear All
                        </button>
                    ) : null}
                </div>
            </header>

            <div className="relative">
                {showFilters && (
                    <div className="mb-8 p-8 bg-white rounded-3xl border border-border shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-4">
                        <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase text-text-secondary tracking-widest flex items-center gap-2">
                                <Search size={14} /> Courses & Labs
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {availableCourses.map(course => (
                                    <button
                                        key={course}
                                        onClick={() => toggleFilter(selectedCourses, setSelectedCourses, course)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedCourses.includes(course)
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                                            }`}
                                    >
                                        {course}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase text-text-secondary tracking-widest flex items-center gap-2">
                                <FileText size={14} /> Resource Type
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {resourceTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedTypes.includes(type)
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase text-text-secondary tracking-widest flex items-center gap-2">
                                <Filter size={14} /> Academic Details
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    className="auth-input h-10 text-xs font-bold bg-gray-50 border-gray-100"
                                    value={filterSemester}
                                    onChange={(e) => setFilterSemester(e.target.value)}
                                >
                                    <option value="">Semester</option>
                                    {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
                                </select>
                                <select
                                    className="auth-input h-10 text-xs font-bold bg-gray-50 border-gray-100"
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(e.target.value)}
                                >
                                    <option value="">Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resources.map((res) => (
                            <div key={res.id} className="group bg-white rounded-3xl border border-border p-6 flex flex-col h-full hover:shadow-2xl hover:border-primary transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-blue-50 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 group-hover:rotate-6">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-black px-3 py-1 bg-gray-100 rounded-full text-text-secondary uppercase tracking-tight">
                                            {res.type}
                                        </span>
                                        {res.subject && (
                                            <span className="text-[9px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-md">
                                                {res.subject}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 cursor-pointer" onClick={() => handleDownload(res)}>
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg line-clamp-2 leading-tight mb-2">
                                        {res.title}
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-xs text-text-secondary font-bold flex items-center gap-1.5">
                                            <BookOpen size={12} className="text-gray-400" /> {res.course}
                                        </p>
                                        <p className="text-[10px] text-text-secondary">Uploaded by <span className="text-gray-900 font-bold">{res.author}</span></p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold">
                                        <Download size={14} className="text-primary" />
                                        {res.downloads}
                                    </div>
                                    <button
                                        onClick={() => handleDownload(res)}
                                        className="btn-primary py-2 px-4 text-xs font-bold rounded-xl flex items-center gap-2 group-hover:scale-105 transition-transform"
                                    >
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && resources.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No resources found</h3>
                        <p className="text-text-secondary max-w-sm mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                        <button
                            onClick={() => {
                                setSelectedCourses([]);
                                setSelectedTypes([]);
                                setFilterSemester('');
                                setFilterYear('');
                                setSearchQuery('');
                            }}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

