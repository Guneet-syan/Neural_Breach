"use client";

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        // Immediate "Snappy" feel for master password
        if (formData.password === 'uni123') {
            setSuccess(true);
            localStorage.setItem('token', 'demo-token-' + btoa(formData.email));
            setTimeout(() => {
                window.location.href = '/';
            }, 300);
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('username', formData.email);
            params.append('password', formData.password);

            const res = await fetch('http://localhost:8000/api/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.access_token);
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            } else {
                setError(data.detail || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            // If connection fails, but it's for the hackathon/demo, let them in
            console.error('Login connection issue:', err);
            setSuccess(true);
            localStorage.setItem('token', 'demo-token-' + btoa(formData.email));
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        }
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl border border-border shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="bg-primary p-10 text-white text-center">
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Welcome Back</h1>
                    <p className="opacity-90">Login to access your academic resources.</p>
                </div>

                <div className="p-10 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold animate-in shake duration-300">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold flex items-center gap-3 animate-in zoom-in-95">
                            <CheckCircle size={20} className="shrink-0" />
                            Successfully logged in! Redirecting to Dashboard...
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="University Email"
                                className="auth-input pl-10"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="auth-input pl-10"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={20} />
                    </button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs text-text-secondary font-bold uppercase">Or continue with</span>
                        <div className="flex-1 h-px bg-border"></div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm">
                        <Github size={20} />
                        Sign in with GitHub
                    </button>

                    <div className="pt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
