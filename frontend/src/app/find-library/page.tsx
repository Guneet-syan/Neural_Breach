"use client";

import { useState, useMemo } from 'react';
import { Search, MapPin, Navigation, Clock, Users, Star, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const LibraryMap = dynamic(() => import('@/components/LibraryMap'), {
    ssr: false,
    loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-xl" />
});

const MOCK_LIBRARIES = [
    {
        id: 1,
        name: 'Central University Library',
        address: 'Campus Block A, Main Circle',
        coords: [28.6139, 77.2090],
        status: 'Open',
        capacity: 85,
        rating: 4.8,
        distance: '0.4 km'
    },
    {
        id: 2,
        name: 'Engineering Faculty Library',
        address: 'Block E, Sector 4',
        coords: [28.6200, 77.2200],
        status: 'Open',
        capacity: 40,
        rating: 4.5,
        distance: '1.2 km'
    },
    {
        id: 3,
        name: 'Science Research Center',
        address: 'Innovation Hub, East Wing',
        coords: [28.6100, 77.2300],
        status: 'Closed',
        capacity: 0,
        rating: 4.9,
        distance: '2.1 km'
    },
    {
        id: 4,
        name: 'City Public Library',
        address: 'Main Street, 2nd Cross',
        coords: [28.6300, 77.2100],
        status: 'Open',
        capacity: 65,
        rating: 4.2,
        distance: '3.5 km'
    },
];

export default function FindLibraryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCenter, setSelectedCenter] = useState<[number, number]>([28.6139, 77.2090]);
    const [isSearching, setIsSearching] = useState(false);

    const filteredLibraries = useMemo(() => {
        return MOCK_LIBRARIES.filter(lib =>
            lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lib.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        try {
            // Use OpenStreetMap Nominatim API for geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setSelectedCenter([parseFloat(lat), parseFloat(lon)]);
            } else if (filteredLibraries.length > 0) {
                setSelectedCenter(filteredLibraries[0].coords as [number, number]);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLibrary = (lib: any) => {
        setSelectedCenter(lib.coords);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MapPin className="text-primary" />
                        Find Nearby Library
                    </h1>
                    <p className="text-text-secondary text-sm">Find the perfect study spot during your exams.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary border border-blue-100 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                        <Navigation size={18} />
                        Use Current Location
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Sidebar Results */}
                <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <form onSubmit={handleSearch} className="relative group flex-shrink-0">
                        {isSearching ? (
                            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-primary animate-spin" size={18} />
                        ) : (
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        )}
                        <input
                            type="text"
                            placeholder="Search area or library..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className="space-y-3">
                        {filteredLibraries.map((lib) => (
                            <div
                                key={lib.id}
                                onClick={() => handleSelectLibrary(lib)}
                                className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group ${selectedCenter[0] === lib.coords[0] && selectedCenter[1] === lib.coords[1]
                                        ? 'border-primary ring-1 ring-primary'
                                        : 'border-border hover:border-primary'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{lib.name}</h3>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-[10px] font-bold">{lib.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary mb-3 flex items-center gap-1">
                                    <MapPin size={12} />
                                    {lib.address}
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lib.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {lib.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-text-secondary">
                                        {lib.distance}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filteredLibraries.length === 0 && !isSearching && (
                            <div className="text-center py-12">
                                <p className="text-sm text-text-secondary">No libraries found in this area.</p>
                                <button onClick={handleSearch} className="text-primary text-xs font-bold mt-2 hover:underline">Search global location</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 h-full min-h-[400px]">
                    <LibraryMap libraries={filteredLibraries} center={selectedCenter} />
                </div>
            </div>
        </div>
    );
}

