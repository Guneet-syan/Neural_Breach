"use client";

import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-text-secondary text-sm">Manage your account preferences and notification settings.</p>
            </div>

            <div className="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden">
                <SettingItem
                    icon={User}
                    title="Profile Information"
                    desc="Update your name, department, and university details."
                />
                <SettingItem
                    icon={Bell}
                    title="Notifications"
                    desc="Choose how you want to be alerted for new resources."
                />
                <SettingItem
                    icon={Palette}
                    title="Appearance"
                    desc="Switch between light and dark themes."
                />
                <SettingItem
                    icon={Shield}
                    title="Privacy & Security"
                    desc="Manage your data and account security."
                />
            </div>
        </div>
    );
}

function SettingItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl text-text-secondary group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-text-secondary">{desc}</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary" />
        </div>
    );
}

import { ChevronRight } from 'lucide-react';
