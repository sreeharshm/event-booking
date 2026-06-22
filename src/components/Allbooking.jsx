import React, { useEffect, useState } from 'react';
import { Users, Calendar, Ticket, LogOut, Loader2, ShieldAlert, CheckCircle, Menu, X} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllBoking } from '../api/Allapi'; // Ensure correct path mapping here

function Allbooking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await getAllBoking();
            setBookings(res.data || []);
        } catch (err) {
            console.error("Error fetching event booking logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#1f2533] flex text-gray-100 font-sans">
            {/* Left Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0  z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Left Sidebar Navigation - Desktop viewports */}
            <aside
                className={`fixed top-16 bottom-0 left-0 bg-[#2b3144] border-r border-gray-700/50 p-6 z-50 transition-transform duration-300 w-64
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}
            >
                <nav className="space-y-2">
                    <Link to="/user" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#333a50] hover:text-white rounded-xl font-bold transition-all">
                        <Users size={20} /> Users
                    </Link>
                    <Link to="/eventadd" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#333a50] hover:text-white rounded-xl font-bold transition-all">
                        <Calendar size={20} /> Events List
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#df183a] text-white rounded-xl font-bold shadow-md shadow-[#df183a]/20 transition-all text-left">
                        <Ticket size={20} /> All Bookings
                    </button>
                </nav>
            </aside>

            {/* Global Branding Header Bar */}
            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-8 bg-[#2b3144] border-b border-gray-700/50">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-400 hover:text-white transition-colors">
                        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <p className="text-lg md:text-xl font-black tracking-tight text-white uppercase cursor-pointer" onClick={() => navigate('/home')}>
                        BOOKMY<span className="text-[#df183a]">SHOW</span> <span className="hidden lg:inline text-xs font-medium text-gray-400 tracking-normal normal-case border-l border-gray-600 pl-2 ml-1">Admin Portal</span>
                    </p>
                </div>

                {/* Clean Actions layout context container */}
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="hidden sm:inline text-xs font-bold bg-[#333a50] text-[#df183a] px-3 py-1 rounded-full uppercase tracking-wider border border-[#df183a]/20">
                        Super Admin
                    </span>

                </div>
            </nav>



            {/* Viewport Core Layer Container */}
            <main className="flex-1 md:ml-64 pt-24 px-4 md:px-8 pb-12 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Header Summary Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Manage Bookings</h1>
                            <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-wide">Monitor and inspect ticket purchase records</p>
                        </div>
                        {!loading && bookings.length > 0 && (
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-[#2b3144] px-4 py-2.5 rounded-xl border border-gray-700/50 self-stretch sm:self-auto text-center sm:text-left">
                                Total Sales: <span className="text-[#df183a] font-black ml-1">{bookings.length}</span>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-3">
                            <Loader2 className="animate-spin text-[#df183a]" size={40} />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Syncing booking logs...</span>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-[#2b3144] rounded-2xl border border-gray-700/50 shadow-xl p-16 text-center">
                            <Ticket className="mx-auto text-gray-600 mb-4" size={48} />
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No active booking records found</p>
                        </div>
                    ) : (
                        <>
                            {/* 1. Mobile Representation Layer (Visible only on phone sizes < 640px) */}
                            <div className="block sm:hidden space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="bg-[#2b3144] border border-gray-700/50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="truncate">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">User</p>
                                                <p className="text-sm font-bold text-white truncate mt-0.5">{booking.user_name || "Guest User"}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{booking.user_email || 'No email profile'}</p>
                                            </div>
                                            <span className="font-mono text-[11px] font-black text-gray-400 bg-[#232838] px-2 py-1 rounded">
                                                #{booking.id ? booking.id.toString().slice(-6).toUpperCase() : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-gray-700/40">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Event Item</p>
                                            <p className="text-sm font-bold text-white truncate mt-0.5">{booking.event_title}</p>
                                            <p className="text-[10px] text-[#df183a] font-black uppercase tracking-widest mt-0.5">{booking.event_date}</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-700/40">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black uppercase rounded border ${booking.status?.toLowerCase() === 'confirmed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {booking.status?.toLowerCase() === 'confirmed' ? <CheckCircle size={9} /> : <ShieldAlert size={9} />}
                                                {booking.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 2. Tablet & Desktop Representation Layer (Hidden on mobile phones) */}
                            <div className="hidden sm:block bg-[#2b3144] rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#232838] border-b border-gray-700/50 text-gray-400 text-[11px] uppercase font-black tracking-wider">
                                                <th className="px-4 lg:px-6 py-4">User</th>
                                                <th className="px-4 lg:px-6 py-4">Event Item</th>
                                                <th className="px-4 lg:px-6 py-4">Status</th>
                                                <th className="px-4 lg:px-6 py-4 text-right">Reference</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700/40">
                                            {bookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-[#333a50]/50 group transition-colors">
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <div className="max-w-[140px] md:max-w-[200px] lg:max-w-none truncate">
                                                            <p className="text-sm font-bold text-white truncate">{booking.user_name || "Guest User"}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">{booking.user_email || 'No email associated'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4">
                                                        <div className="max-w-[160px] md:max-w-[240px] lg:max-w-none truncate">
                                                            <p className="text-sm font-bold text-white truncate">{booking.event_title}</p>
                                                            <p className="text-[10px] text-[#df183a] font-bold uppercase tracking-widest mt-0.5">
                                                                {booking.event_date}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 shadow-sm">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase rounded-md tracking-wider border ${booking.status?.toLowerCase() === 'confirmed'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                            }`}>
                                                            {booking.status?.toLowerCase() === 'confirmed' ? <CheckCircle size={10} /> : <ShieldAlert size={10} />}
                                                            {booking.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 text-right font-mono font-black text-xs text-gray-400 group-hover:text-white transition-colors">
                                                        #{booking.id ? booking.id.toString().slice(-6).toUpperCase() : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Allbooking;