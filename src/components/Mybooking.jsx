import React, { useEffect, useState } from 'react';
import { getAllBoking, BASE_URLs, downloadTicket, curretUser } from '../api/Allapi';
import { Loader2, Calendar, MapPin, Ticket, Search, X, LogOut, Download, ArrowLeft, ShieldCheck, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Mybooking() {
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate('/login');
            return;
        }

        Promise.all([curretUser(), getAllBoking()])
            .then(([userRes, bookingRes]) => {
                const userData = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
                setUser(userData);
                setBookings(bookingRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Data fetching failed:", err);
                Loading(false);
            });
    }, [navigate]);

    const handleDownload = async (id) => {
        try {
            const response = await downloadTicket(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            alert("Could not download ticket.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const filteredBookings = bookings.filter(b =>
        b.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.event?.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-gray-800 font-sans">
            {/* --- NAVBAR --- */}
            <nav className="bg-[#333545] text-white sticky top-0 z-50 px-4 py-3 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Logo Branding */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-white text-2xl font-black tracking-tight">
                            event<span className="text-rose-500">hub</span>
                        </p>
                    </div>

                    {/* Minimalist Profile Indicator */}
                    <div className="flex items-center gap-3 bg-[#43465e] px-4 py-1.5 rounded-full border border-gray-600/40">
                        <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white shadow-inner">
                            {user?.username?.charAt(0) || <User size={12} />}
                        </div>
                        <span className="text-xs font-semibold tracking-wide hidden sm:inline text-gray-200">
                            Hi, {user?.username || "Guest"}
                        </span>
                    </div>
                </div>
            </nav>

            {/* --- CORE CONTENT LAYOUT --- */}
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 md:py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 font-bold text-xs mb-5 md:mb-6 hover:text-rose-500 transition-colors group uppercase tracking-wider"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Discover
                </button>

                {/* FIXED TYPO HERE (claqssName -> className) */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">

                    {/* --- LEFT SIDEBAR PANEL (Now beautifully responsive on mobile!) --- */}
                    <aside className="w-full md:w-72 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden md:sticky md:top-24 self-start">
                        <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 flex flex-row md:flex-col items-center gap-4 md:gap-0 text-left md:text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-lg md:text-2xl uppercase border-2 border-white shadow-sm md:mb-3 shrink-0">
                                {user?.username?.charAt(0) || <User size={20} />}
                            </div>
                            <div className="min-w-0 flex-1 md:flex-initial">
                                <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{user?.username || "Guest"}</h3>
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px] sm:max-w-none">{user?.email || ""}</p>
                            </div>
                        </div>

                        <div className="p-2 sm:p-3 flex flex-row md:flex-col flex-wrap gap-1 md:space-y-0.5 border-t border-gray-50 md:border-t-0">
                            <button onClick={() => navigate('/myprofile')} className="flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-3.5 text-center md:text-left text-[11px] md:text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all whitespace-nowrap">
                                <User size={14} className="shrink-0 text-gray-400" /> <span className="hidden xs:inline">Account</span>
                            </button>
                            <button onClick={() => navigate('/fav')} className="flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-3.5 text-center md:text-left text-[11px] md:text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all whitespace-nowrap">
                                <Heart size={14} className="shrink-0" /> <span className="hidden xs:inline">Favorites</span>
                            </button>
                            <button className="flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-3.5 text-center md:text-left text-[11px] md:text-xs font-bold text-rose-600 bg-rose-50 px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl whitespace-nowrap">
                                <ShieldCheck size={14} className="shrink-0" /> <span className="hidden xs:inline">History</span>
                            </button>
                            <div className="w-full md:w-auto md:pt-4 md:mt-2 md:border-t md:border-gray-100 hidden md:block">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3.5 text-left text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50/50 px-4 py-3.5 rounded-xl transition-all"
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN ACCOUNT DASHBOARD --- */}
                    <main className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                        {/* Section Header */}
                        <div className="px-4 sm:px-6 py-4 md:py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                            <div>
                                <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight">My Bookings</h2>
                                <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">Manage your tickets and download gate passes.</p>
                            </div>

                            {/* Search Bar Input Tool */}
                            <div className="relative w-full sm:w-64">
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-rose-400 focus-within:shadow-sm transition-all">
                                    <Search size={14} className="text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Filter tickets..."
                                        className="bg-transparent text-xs font-semibold text-gray-800 outline-none w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <X
                                            size={14}
                                            className="text-gray-400 cursor-pointer hover:text-rose-500 ml-1 shrink-0"
                                            onClick={() => setSearchQuery("")}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ticket List Area */}
                        <div className="p-4 sm:p-6 md:p-8 space-y-4">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12 md:py-16 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <Ticket className="mx-auto text-gray-300 mb-3" size={40} />
                                    <p className="text-sm text-gray-500 font-medium px-4">No bookings match your search parameters.</p>
                                    <button onClick={() => navigate('/event')} className="mt-2 text-rose-500 text-xs font-bold hover:underline">
                                        Browse Active Events
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="group bg-white rounded-2xl border border-gray-200/70 overflow-hidden flex flex-col sm:flex-row hover:border-rose-200 hover:shadow-sm transition-all duration-200"
                                        >
                                            {/* Left Ticket Image Block */}
                                            <div className="w-full sm:w-40 h-36 sm:h-auto bg-gray-100 overflow-hidden relative shrink-0">
                                                <img
                                                    src={`${BASE_URLs}${booking.event?.image}`}
                                                    alt="event location display"
                                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                                />
                                            </div>

                                            {/* Right Content details Block */}
                                            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                                                <div>
                                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                        <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                                            {booking.event?.title || "Event Title"}
                                                        </h3>
                                                        <span className="bg-emerald-50 text-emerald-700 text-[9px] md:text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                                                            Confirmed
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                            <Calendar size={12} className="text-rose-500 shrink-0" />
                                                            <span className="font-semibold text-gray-600 text-[11px] md:text-xs">
                                                                {booking.event?.date ? new Date(booking.event.date).toDateString() : "Date TBD"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 max-w-full">
                                                            <MapPin size={12} className="text-rose-500 shrink-0" />
                                                            <span className="font-semibold text-gray-600 truncate text-[11px] md:text-xs max-w-[120px] sm:max-w-[160px]">
                                                                {booking.event?.location || "Online"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Download Items Footer */}
                                                <div className="flex items-center justify-end pt-3 border-t border-gray-100/80">
                                                    <button
                                                        onClick={() => handleDownload(booking.id)}
                                                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                                    >
                                                        <Download size={12} /> Download PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                <footer className="text-center mt-12 text-gray-400 text-xs font-medium">
                    Secure checkout backend active. Need assistance? <span className="text-rose-500 cursor-pointer hover:underline font-semibold">Contact Support</span>
                </footer>
            </div>
        </div>
    );
}

export default Mybooking;