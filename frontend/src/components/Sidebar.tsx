"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Upload,
  Calendar,
  Settings,
  BookOpen,
  Users,
  Award,
  MapPin
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Teacher Ratings', href: '/ratings' },
  { icon: MapPin, label: 'Find Library', href: '/find-library' },
  { icon: Upload, label: 'Downloads', href: '/downloads' },
  { icon: Upload, label: 'Upload', href: '/upload' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
];

const classes = [
  { id: 1, name: 'Computer Science 101' },
  { id: 2, name: 'Digital Electronics' },
  { id: 3, name: 'Data Structures' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-white h-screen sticky top-0 flex flex-col pt-4 overflow-y-auto">
      <div className="px-6 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Award size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">Hub</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 pr-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={isActive ? 'nav-item-active' : 'nav-item'}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-6 pb-2 px-6">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Enrolled Classes
          </p>
        </div>

        {classes.map((cls) => (
          <Link
            key={cls.id}
            href={`/class/${cls.id}`}
            className="nav-item group"
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
              <span className="text-[10px] font-bold text-primary">{cls.name[0]}</span>
            </div>
            <span className="truncate">{cls.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto space-y-2">
        <Link href="/login" className="nav-item">
          <Users className="mr-3" size={20} />
          Login
        </Link>
        <Link href="/signup" className="nav-item">
          <Award className="mr-3" size={20} />
          Sign Up
        </Link>
        <Link href="/settings" className="nav-item">
          <Settings className="mr-3" size={20} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
