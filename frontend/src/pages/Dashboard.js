import React, { useState } from 'react';
import { Package, Search, PlaneTakeoff, PlusCircle, ArrowRight, X, Loader2, MapPin } from 'lucide-react';
import * as api from '../services/api';
import TrackingTimeline from '../components/TrackingTimeline';

const Dashboard = () => {
    // Search & Track State
    const [trackId, setTrackId] = useState('');
    const [booking, setBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Booking Form State
    const [searchParams, setSearchParams] = useState({ origin: '', destination: '', date: '' });
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Requirement 5: Get Booking History
    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackId) return;
        try {
            const res = await api.trackBooking(trackId);
            setBooking(res.data);
        } catch (err) {
            alert("Shipment not found. Check the Reference ID.");
        }
    };

    // 2. Requirement 1: Get Route (Search)
    const handleSearch = async () => {
        if (!searchParams.origin || !searchParams.destination || !searchParams.date) {
            alert("Please fill all search fields");
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.searchFlights(searchParams);
            setResults(res.data);
        } catch (err) {
            console.error(err);
            alert("Search failed. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Requirement 2: Create Booking
    const confirmBooking = async (flightIds) => {
        const ref_id = `AWB-${Math.floor(100000 + Math.random() * 900000)}`;
        const payload = {
            ref_id,
            origin: searchParams.origin,
            destination: searchParams.destination,
            pieces: 1,
            weight_kg: 100,
            flight_ids: flightIds
        };

        try {
            await api.createBooking(payload);
            alert(`Success! Saved as ${ref_id}`);
            setIsModalOpen(false);
            setTrackId(ref_id);
            // Auto-track the new booking
            const res = await api.trackBooking(ref_id);
            setBooking(res.data);
        } catch (err) {
            alert("Booking creation failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-2 font-black text-2xl text-blue-600">
                    <PlaneTakeoff size={32} />
                    <span>CARGO<span className="text-slate-800">FLOW</span></span>
                </div>
                <button 
                    onClick={() => { setResults(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                    <PlusCircle size={20} /> New Shipment
                </button>
            </header>

            <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Search Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-3xl border shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Search size={20} className="text-blue-500" /> Track Shipment
                        </h2>
                        <form onSubmit={handleTrack} className="space-y-3">
                            <input 
                                className="w-full bg-slate-100 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition outline-none font-bold"
                                placeholder="Enter Ref ID (AWB-...)"
                                value={trackId}
                                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                            />
                            <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-black transition">
                                Search Record
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Timeline & Result */}
                <div className="lg:col-span-8">
                    {!booking ? (
                        <div className="h-96 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
                            <Package size={64} className="mb-4 opacity-20" />
                            <p className="font-medium text-lg">Enter a Reference ID to see the journey</p>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Status</h3>
                                    <p className="text-3xl font-black text-blue-600">{booking.status}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Ref ID</h3>
                                    <p className="text-xl font-bold text-slate-800">{booking.ref_id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={24}/></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Origin</p>
                                        <p className="font-bold text-lg">{booking.origin}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><MapPin size={24}/></div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Destination</p>
                                        <p className="font-bold text-lg">{booking.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-lg mb-6">Live Timeline</h4>
                                <TrackingTimeline timeline={booking.Timeline || []} />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Flight Search (Req 1) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">New Cargo Booking</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X /></button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input placeholder="From (e.g. DEL)" className="p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setSearchParams({...searchParams, origin: e.target.value.toUpperCase()})} />
                                <input placeholder="To (e.g. BLR)" className="p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setSearchParams({...searchParams, destination: e.target.value.toUpperCase()})} />
                                <input type="date" className="p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setSearchParams({...searchParams, date: e.target.value})} />
                            </div>
                            <button 
                                onClick={handleSearch} 
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "FIND ROUTES"}
                            </button>

                            {results && (
                                <div className="space-y-4 animate-in slide-in-from-top-2">
                                    <h3 className="font-bold text-slate-500 uppercase text-xs">Available Options</h3>
                                    
                                    {/* Direct Flights */}
                                    {results.direct.map(f => (
                                        <div key={f.id} className="p-4 border rounded-2xl flex justify-between items-center hover:border-blue-500 transition cursor-default">
                                            <div>
                                                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1 uppercase tracking-tighter">
                                                    <ArrowRight size={14}/> Direct
                                                </div>
                                                <p className="font-bold">{f.airline_name} • {f.flight_number}</p>
                                            </div>
                                            <button onClick={() => confirmBooking([f.id])} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">SELECT</button>
                                        </div>
                                    ))}

                                    {/* Transit Flights */}
                                    {results.transit && (
                                        <div className="p-4 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/30 flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-1 uppercase tracking-tighter">
                                                    <ArrowRight size={14}/> 1-Transit via {results.transit[0].destination}
                                                </div>
                                                <p className="font-bold text-sm">{results.transit[0].flight_number} → {results.transit[1].flight_number}</p>
                                            </div>
                                            <button onClick={() => confirmBooking([results.transit[0].id, results.transit[1].id])} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">SELECT</button>
                                        </div>
                                    )}

                                    {results.direct.length === 0 && !results.transit && (
                                        <p className="text-center py-8 text-slate-400 italic">No routes found for these locations on this date.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;