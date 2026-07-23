import React, { useEffect, useState } from 'react';
import { getAllBoking, BASE_URLs, downloadTicket, curretUser } from '../api/Allapi';
import { Loader2, Calendar, MapPin, Ticket, Search, X, LogOut, Download, ArrowLeft, ShieldCheck, User, Heart, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Mybooking() {
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate('/login');
            return;
        }

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        Promise.all([curretUser(), getAllBoking()])
            .then(([userRes, bookingRes]) => {
                const userData = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
                setUser(userData);
                setBookings(bookingRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Data fetching failed:", err);
                setLoading(false);
            });

        return () => window.removeEventListener('resize', handleResize);
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
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800 font-sans">
            {/* --- EVENTHUB NAVBAR --- */}
            <nav className="bg-[#1f2533] text-white sticky top-0 z-50 px-4 py-3 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-white text-2xl font-black tracking-tight">
                            event<span className="text-rose-500">hub</span>
                        </p>
                    </div>

                    {/* Profile Badge */}
                    <div className="flex items-center gap-3 bg-[#2f364a] px-4 py-1.5 rounded-full border border-gray-700">
                        <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white shadow-inner">
                            {user?.username?.charAt(0) || <User size={12} />}
                        </div>
                        <span className="text-xs font-semibold tracking-wide hidden sm:inline text-gray-200">
                            Hi, {user?.username || "Guest"}
                        </span>
                    </div>
                </div>
            </nav>

            {/* --- MAIN PAGE WRAPPER --- */}
            <div className="max-w-6xl mx-auto px-4 py-6">

                {/* Control Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Toggle Sidebar"
                        >
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Discover
                        </button>
                    </div>
                </div>

                {/* Dashboard Flex Container */}
                <div className="flex gap-6 relative items-start">

                    {/* --- RESPONSIVE SIDEBAR --- */}
                    <aside
                        className={`
                            fixed md:sticky top-0 md:top-24 left-0 z-40 h-screen md:h-auto bg-white border-r md:border border-gray-200 
                            shadow-xl md:shadow-sm md:rounded-2xl overflow-hidden transition-all duration-300 ease-in-out
                            ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"}
                        `}
                    >
                        {/* Avatar Details Header */}
                        <div className="p-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-2xl uppercase border-2 border-white shadow-sm mb-3 shrink-0">
                                {user?.username?.charAt(0) || <User size={20} />}
                            </div>

                            {sidebarOpen && (
                                <div className="w-full truncate">
                                    <h3 className="font-bold text-gray-800 truncate">{user?.username || "Guest"}</h3>
                                    <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                                </div>
                            )}
                        </div>

                        {/* Navigation Options */}
                        <div className="p-3 space-y-1">
                            <button onClick={() => navigate('/myprofile')} className="w-full flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-4 py-3 rounded-xl transition-all">
                                <User size={18} className="shrink-0 text-gray-400" />
                                {sidebarOpen && <span>Account Details</span>}
                            </button>

                            <button onClick={() => navigate('/fav')} className="w-full flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-4 py-3 rounded-xl transition-all">
                                <Heart size={18} className="shrink-0" />
                                {sidebarOpen && <span>My Favourites</span>}
                            </button>

                            <button className="w-full flex items-center gap-3 text-xs font-bold text-rose-600 bg-rose-50/80 px-4 py-3 rounded-xl transition-all">
                                <ShieldCheck size={18} className="shrink-0" />
                                {sidebarOpen && <span>Booking History</span>}
                            </button>

                            {/* Divider Line */}
                            <div className="h-[1px] bg-gray-100 my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50/50 px-4 py-3 rounded-xl transition-all"
                            >
                                <LogOut size={18} className="shrink-0" />
                                {sidebarOpen && <span>Log Out</span>}
                            </button>
                        </div>
                    </aside>

                    {/* Mobile Dim Overlay */}
                    {sidebarOpen && (
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/45 z-30 md:hidden"
                        />
                    )}

                    {/* --- MAIN CONTENT CARD --- */}
                    <main className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                        {/* Section Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">My Bookings</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Manage your tickets and download gate passes.</p>
                            </div>

                            {/* Search Bar Input */}
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
                        <div className="p-6 md:p-8 space-y-4">
                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <Ticket className="mx-auto text-gray-300 mb-3" size={40} />
                                    <p className="text-sm text-gray-500 font-medium px-4">No bookings match your search parameters.</p>
                                    <button onClick={() => navigate('/home')} className="mt-2 text-rose-500 text-xs font-bold hover:underline">
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
                                            {/* Left Ticket Image */}
                                            <div className="w-full sm:w-40 h-36 sm:h-auto bg-gray-100 overflow-hidden relative shrink-0">
                                                <img
                                                src={booking.image || "https://via.placeholder.com/400x600"}
                                                alt={booking.title}
                                                onError={(e) => {
                                                    // If Cloudinary returns 404 or fails, swap to fallback image
                                                    e.currentTarget.onerror = null; // Prevents infinite loops
                                                    e.currentTarget.src = "https://via.placeholder.com/400x600";
                                                }}
                                                className="w-full h-full object-cover transition-transform duration-300"
                                            />
                                            </div>

                                            {/* Right Details Block */}
                                            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                                <div>
                                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                                            {booking.event?.title || "Event Title"}
                                                        </h3>
                                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
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

                                                {/* Action Panel */}
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