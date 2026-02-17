"use client";

import { Bell, Search, User, Menu, LogOut, LogIn, UserPlus, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [headerSearch, setHeaderSearch] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (headerSearch.trim()) {
            window.location.href = `/explore?search=${encodeURIComponent(headerSearch.trim())}`;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://127.0.0.1:8000/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => console.error(err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <button className="p-2 hover:bg-gray-100 rounded-full lg:hidden">
                    <Menu size={20} />
                </button>

                <form onSubmit={handleSearchSubmit} className="max-w-xl w-full relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for notes, past papers, or topics..."
                        className="block w-full pl-10 pr-3 py-2 border border-transparent bg-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm shadow-inner"
                        value={headerSearch}
                        onChange={(e) => setHeaderSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full text-text-secondary relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-border mx-2"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 rounded-full border border-transparent hover:border-border transition-all"
                    >
                        <div className="flex flex-col items-end mr-1 hidden sm:flex">
                            <span className="text-xs font-semibold leading-none">{user?.name || 'Guest Student'}</span>
                            <span className="text-[10px] text-text-secondary">
                                {user ? '2,450 Points' : 'Sign in to sync'}
                            </span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                            {user?.name ? user.name[0] : 'G'}
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-30"
                                onClick={() => setIsDropdownOpen(false)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-border py-2 z-40 animate-in zoom-in-95 origin-top-right">
                                {user ? (
                                    <>
                                        <div className="px-4 py-3 border-b border-border mb-1">
                                            <p className="text-sm font-bold truncate">{user.name}</p>
                                            <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                            {user.phone && <p className="text-[10px] text-text-secondary mt-1">Phone: {user.phone}</p>}
                                        </div>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <User size={18} className="text-text-secondary" />
                                            View Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-3 border-b border-border mb-1">
                                            <p className="text-sm font-bold">Welcome!</p>
                                            <p className="text-xs text-text-secondary">Sign in to save your progress</p>
                                        </div>
                                        <Link
                                            href="/login"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <LogIn size={18} className="text-text-secondary" />
                                            Login (Email, Pass)
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <UserPlus size={18} className="text-text-secondary" />
                                            Sign Up (Name, Email, Phone)
                                        </Link>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
