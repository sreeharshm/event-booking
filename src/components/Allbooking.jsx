import React, { useEffect, useState } from 'react';
import { Users, Calendar, Ticket, LogOut, Loader2, Eye, ShieldAlert, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Allbooking() {
    // Replace these template states with your real data fetching logic
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar */}
            <aside className="fixed top-16 left-0 h-full w-64 bg-white border-r border-gray-200 p-6 z-40 hidden md:block">
                <nav className="space-y-2">
                    <a href="/user" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl font-bold transition-all">
                        <Users size={20} /> Users
                    </a>
                    <a href="/eventadd" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl font-bold transition-all">
                        <Calendar size={20} /> Events List
                    </a>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold transition-all text-left">
                        <Ticket size={20} /> All Bookings
                    </button>
                </nav>
            </aside>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200">
                <p className="text-xl font-black tracking-tight text-gray-800 cursor-pointer" onClick={() => navigate('/home')}>
                    EVENT<span className="text-rose-500">ADMIN</span>
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">
                        Super Admin
                    </span>
                    <button className="flex items-center gap-2 border border-rose-500 text-rose-500 text-xs font-bold rounded-lg px-4 py-2 hover:bg-rose-50 transition-all">
                        <a href="/login" className="flex items-center gap-2">
                            <LogOut size={14} /> Logout
                        </a>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-24 px-4 md:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">Manage Bookings</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">Monitor and inspect ticket purchase records</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-rose-500" size={32} />
                        </div>
                    ) : (
                        /* Data Table Container matching Eventadd style */
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[11px] uppercase font-black">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Event Item</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-sm font-bold text-gray-400">
                                                No active booking records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50/50 group">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{booking.user_name || "Guest"}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{booking.user_email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{booking.event_title}</p>
                                                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">
                                                            {booking.event_date}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${
                                                        booking.status === 'confirmed' 
                                                            ? 'bg-emerald-50 text-emerald-700' 
                                                            : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {booking.status === 'confirmed' ? <CheckCircle size={10} /> : <ShieldAlert size={10} />}
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-black text-xs text-gray-500">
                                                    #{booking.id ? booking.id.toString().slice(-6).toUpperCase() : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Allbooking;