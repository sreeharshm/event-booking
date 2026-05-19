import React, { useEffect, useState, useRef } from 'react';
import { getAllBoking, BASE_URLs, downloadTicket } from '../api/Allapi';
import { Loader2, Calendar, MapPin, Ticket, Search, X, LogOut, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Mybooking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- Search States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) {
            navigate('/login');
            return;
        }

        getAllBoking()
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    // Handle Search Dropdown logic
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredResults([]);
            setIsDropdownOpen(false);
        } else {
            const results = bookings
                .filter(b => b.event?.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5);
            setFilteredResults(results);
            setIsDropdownOpen(true);
        }
    }, [searchQuery, bookings]);

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

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- NAVBAR START --- */}
            <nav className="fixed bg-white/80 backdrop-blur-md top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-6 md:px-12 shadow-sm border-b border-gray-100">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                    <p className="text-rose-500 text-2xl font-black tracking-tighter font-mono">
                        EVENT <span className="text-gray-800">HUB</span>
                    </p>
                </div>

                {/* Search Bar */}
                <div className="hidden md:block relative w-1/3" ref={searchRef}>
                    <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 border border-transparent focus-within:border-rose-300 focus-within:bg-white transition-all shadow-inner">
                        <Search size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search your bookings..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <X size={16} onClick={() => setSearchQuery("")} className="text-gray-400 cursor-pointer hover:text-rose-500" />}
                    </div>

                    {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-2xl z-[60] overflow-hidden">
                            {filteredResults.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {setSearchQuery(item.event.title); setIsDropdownOpen(false);}}
                                    className="px-4 py-3 cursor-pointer border-b border-gray-50 flex items-center gap-3 hover:bg-rose-50 transition-colors"
                                >
                                    <img src={`${BASE_URLs}${item.event?.image}`} alt="" className="w-8 h-8 rounded object-cover" />
                                    <p className="text-sm font-bold text-gray-700 truncate">{item.event?.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Home</button>
                    <button onClick={() => navigate('/event')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Events</button>
                    <button className="hidden lg:block text-sm font-bold text-rose-500 underline underline-offset-8 decoration-2">My Booking</button>
                    <button onClick={() => navigate('/myprofile')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My profile</button>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="flex items-center gap-2 text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>
            {/* --- NAVBAR END --- */}

            <div className="pt-28 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                            My <span className="text-rose-500">Bookings</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your tickets and download your passes.</p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <Ticket className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 font-medium">No bookings found.</p>
                            <button onClick={() => navigate('/')} className="mt-4 text-rose-500 font-bold hover:underline">
                                Browse Events
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings
                                .filter(b => b.event?.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((booking) => (
                                <div key={booking.id} className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300">
                                    <div className="w-full md:w-48 h-40 md:h-auto bg-gray-200 overflow-hidden">
                                        <img 
                                            src={`${BASE_URLs}${booking.event?.image}`} 
                                            alt="event" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                        />
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-xl font-black text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-1">
                                                    {booking.event?.title || "Event Title"}
                                                </h2>
                                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Confirmed
                                                </span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                                    <Calendar size={14} className="text-rose-500" />
                                                    <span className="font-medium text-gray-700">
                                                        {booking.event?.date ? new Date(booking.event.date).toDateString() : "Date TBD"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                                    <MapPin size={14} className="text-rose-500" />
                                                    <span className="font-medium text-gray-700">{booking.event?.location || "Online"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                                    <Ticket size={14} className="text-rose-500" />
                                                    <span className="font-black text-gray-900">Qty: {booking.quantity}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-5 border-t border-gray-50 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking ID: #{booking.id}</p>
                                                <p className="text-lg font-black text-gray-900">₹{booking.quantity * (booking.event?.price || 0)}</p>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleDownload(booking.id)}
                                                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-500 transition-all shadow-lg active:scale-95"
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Mybooking;