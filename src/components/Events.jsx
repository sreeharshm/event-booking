import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavEvent, getAllEvent, BASE_URLs } from '../api/Allapi';
import { Heart, LogOut, Search, X, Calendar } from 'lucide-react';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Search States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // 1. Initial Data Fetch
    useEffect(() => {
        fetchEvents();
    }, []);

    // 2. Search Logic matching Mybooking & Home
    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setFilteredResults([]);
                setIsDropdownOpen(false);
                setActiveIndex(-1);
            } else {
                const results = events
                    .filter((event) =>
                        event.title.toLowerCase().startsWith(searchQuery.toLowerCase())
                    )
                    .slice(0, 5);
                setFilteredResults(results);
                setIsDropdownOpen(true);
                setActiveIndex(-1);
            }
        }, 300);
        return () => clearTimeout(delay);
    }, [searchQuery, events]);

    // 3. Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchEvents = async () => {
        setLoading(true);

        try {
            const res = await getAllEvent()
            setEvents(res.data)
        }
        catch (err) {
            console.error("event fetching failed", err);
        }
        finally {
            setLoading(false)
        }
    };

    const handleFavEvent = (eventId) => {
        const token = localStorage.getItem("access"); // Ensure consistency with token key
        if (!token) {
            alert("Please login to add favorites!");
            return;
        }
        addFavEvent({}, eventId)
            .then((res) => {
                const message = res.status === 201 ? "Added to favorites! ❤️" : "Removed from favorites! 💔";
                alert(message);
                fetchEvents();
            })
            .catch((err) => console.error("Favorite failed", err));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
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
                            placeholder="Search for events..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setIsDropdownOpen(true)}
                        />
                        {searchQuery && (
                            <X
                                size={16}
                                onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }}
                                className="text-gray-400 cursor-pointer hover:text-rose-500"
                            />
                        )}
                    </div>

                    {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-2xl z-[60] overflow-hidden">
                            {filteredResults.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSearchQuery(item.title);
                                        setIsDropdownOpen(false);
                                        navigate(`/booking/${item.id}`);
                                    }}
                                    className={`px-4 py-3 cursor-pointer border-b border-gray-50 flex items-center gap-3 transition-colors ${index === activeIndex ? "bg-rose-100" : "hover:bg-rose-50"}`}
                                >
                                    <img
                                        src={item.image ? `${BASE_URLs}${item.image}` : "https://via.placeholder.com/40"}
                                        alt=""
                                        className="w-8 h-8 rounded object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 truncate">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 uppercase">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Home</button>
                    <button className="hidden lg:block text-sm font-bold text-rose-500 underline underline-offset-8 decoration-2">Events </button>
                    <button onClick={() => navigate('/mybooking')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My Booking</button>

                    <button onClick={() => navigate('/myprofile')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My profile</button><button
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="flex items-center gap-2 text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>
            {/* --- NAVBAR END --- */}

            {/* Header Section */}
            <div className="pt-28 px-6 md:px-12 max-w-7xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                    Discover <span className="text-rose-500">Experiences</span>
                </h1>
                <p className="text-gray-500 font-medium">Book tickets for the most exciting events.</p>
            </div>

            {/* Content Grid */}
            <div className="px-6 md:px-12 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {events
                            .filter(ev => ev.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => navigate(`/booking/${event.id}`)}
                                    className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={event.image ? `${BASE_URLs}${event.image}` : "https://via.placeholder.com/400x300"}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFavEvent(event.id);
                                            }}
                                            className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
                                        >
                                            <Heart size={20} fill={event.is_favorite ? "#f43f5e" : "transparent"} className={event.is_favorite ? "text-rose-500" : ""} />
                                        </button>

                                        <div className="absolute bottom-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-lg text-sm font-black shadow-lg">
                                            ₹{event.price}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800 line-clamp-1 group-hover:text-rose-500 transition-colors">
                                                {event.title}
                                            </h3>

                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">
                                                {event.location}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Calendar size={14} className="text-rose-500" />
                                            <span>{new Date(event.date).toDateString()}</span>
                                        </div>

                                        {/* Remaining Tickets */}
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-bold ${event.capacity <= 5
                                                ? "text-red-500"
                                                : "text-green-600"
                                                }`}>
                                                {event.capacity} Tickets Left
                                            </span>

                                            {event.capacity === 0 && (
                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                                                    SOLD OUT
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            disabled={event.capacity === 0}
                                            className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${event.capacity === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-gray-900 text-white hover:bg-rose-500"
                                                }`}
                                        >
                                            {event.capacity === 0 ? "Sold Out" : "Book Now"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {!loading && events.filter(ev => ev.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 italic">No events match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;