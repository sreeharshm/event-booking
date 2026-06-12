import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavEvent, getAllEvent, removeFavEvent, BASE_URLs } from '../api/Allapi';
import { Heart, LogOut, Search, X, Calendar, TextAlignJustify, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebar, setSideBar] = useState(false);

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
                        event.title?.toLowerCase().startsWith(searchQuery.toLowerCase())
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
            const res = await getAllEvent();
            setEvents(res.data);
        }
        catch (err) {
            console.error("event fetching failed", err);
        }
        finally {
            setLoading(false);
        }
    };

    const handleFavEvent = async (eventId) => {
        const token = localStorage.getItem("access");
        if (!token) {
            alert("Please login to add favorites!");
            return;
        }

        setEvents(prev =>
            prev.map(ev =>
                ev.id === eventId
                    ? { ...ev, is_favorite: !ev.is_favorite }
                    : ev
            )
        );

        try {
            const res = await addFavEvent({}, eventId);


            if (res && res.data) {

            }
        } catch (err) {
            console.error("Favorite sync failed", err);
            fetchEvents();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* --- NAVBAR START --- */}
            <nav className="fixed bg-white/80 backdrop-blur-md top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-12 shadow-sm border-b border-gray-100">
                <TextAlignJustify
                    onClick={() => setSideBar(true)}
                    className='md:hidden cursor-pointer text-gray-700'
                />
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                    <p className="text-rose-500 text-xl md:text-2xl font-black tracking-tighter font-mono">
                        EVENT <span className="text-gray-800">HUB</span>
                    </p>
                </div>

                {sidebar && (
                    <div
                        className='fixed inset-0 bg-black/20 z-50 backdrop-blur-sm'
                        onClick={() => setSideBar(false)}
                    >
                        <div
                            className='fixed left-0 top-0 h-screen bg-white w-48 p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-500 ease-out transform translate-x-0'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <p className="text-rose-500 text-xl font-black tracking-tighter font-mono">
                                        EVENT <span className="text-gray-800">HUB</span>
                                    </p>
                                    <X
                                        size={20}
                                        className="text-gray-400 cursor-pointer hover:text-rose-500"
                                        onClick={() => setSideBar(false)}
                                    />
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button onClick={() => { navigate('/home'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">Home</button>
                                    <button onClick={() => { navigate('/event'); setSideBar(false); }} className="text-left text-sm font-bold text-rose-500 bg-rose-50/50 px-4 py-2.5 rounded-xl">Events</button>
                                    <button onClick={() => { navigate('/mybooking'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">My Booking</button>
                                    <button onClick={() => { navigate('/myprofile'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">My Profile</button>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 text-white text-sm font-bold bg-rose-500 hover:bg-rose-600 w-full py-3 rounded-xl transition-all shadow-md mt-auto"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile Search Bar Wrapper */}
                <div
                    className="md:hidden relative flex items-center h-9 flex-1 max-w-[160px] xs:max-w-[200px] bg-gray-100 rounded-lg px-2 border border-transparent focus-within:border-rose-300 focus-within:bg-white transition-all shadow-inner"
                    ref={searchRef}
                >
                    <Search size={16} className="text-gray-400 mr-1.5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none p-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setIsDropdownOpen(true)}
                    />
                    {searchQuery && (
                        <X
                            size={14}
                            onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }}
                            className="text-gray-400 cursor-pointer hover:text-rose-500"
                        />
                    )}
                </div>

                {/* Desktop Search Bar */}
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
                                        setSearchQuery(item.title || "");
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


                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Home</button>
                    <button className="hidden lg:block text-sm font-bold text-rose-500 underline underline-offset-8 decoration-2">Events </button>
                    <button onClick={() => navigate('/mybooking')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My Booking</button>
                    <button onClick={() => navigate('/myprofile')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My profile</button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>
            {/* --- NAVBAR END --- */}

            {/* Header Section */}
            <div className="pt-24 md:pt-28 px-4 md:px-12 max-w-7xl mx-auto mb-6 md:mb-10">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-1">
                    Discover <span className="text-rose-500">Experiences</span>
                </h1>
                <p className="text-xs md:text-sm text-gray-500 font-medium">Book tickets for the most exciting events.</p>
            </div>

            {/* Content Grid */}
            <div className="px-4 md:px-12 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {events
                            .filter(ev => ev.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => navigate(`/booking/${event.id}`)}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                                >
                                    <div className="relative h-36 sm:h-44 md:h-52 overflow-hidden w-full">
                                        <img
                                            src={event.image ? `${BASE_URLs}${event.image}` : "https://via.placeholder.com/400x300"}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* CHANGED: Wrapped button in motion.button for satisfying tactile feedback & pop effect */}
                                        <motion.button
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.85 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFavEvent(event.id);
                                            }}
                                            className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2.5 bg-white/90 rounded-full transition-colors shadow-sm z-10"
                                        >
                                            {/* Nested AnimatePresence lets the inner filled heart expand beautifully when activated */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={event.is_favorite ? "fav" : "unfav"}
                                                    initial={{ scale: 0 }}
                                                    animate={{
                                                        scale: [0, 1.4, 1],
                                                        rotate: [0, -10, 10, 0]
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={`md:w-5 md:h-5 transition-colors ${event.is_favorite ? "text-rose-500 fill-rose-500" : "text-gray-400"
                                                            }`}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        </motion.button>

                                        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-rose-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-xs md:text-sm font-black shadow-lg">
                                            ₹{event.price}
                                        </div>
                                    </div>

                                    <div className="p-3 md:p-6 flex-1 flex flex-col justify-between gap-2 md:gap-4">
                                        <div>
                                            <h3 className="text-sm md:text-lg font-black text-gray-800 line-clamp-1 group-hover:text-rose-500 transition-colors">
                                                {event.title}
                                            </h3>

                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide mt-0.5 md:mt-1 truncate">
                                                {event.location}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs md:text-sm">
                                            <Calendar size={12} className="text-rose-500 md:w-3.5 md:h-3.5" />
                                            <span className="truncate">{new Date(event.date).toDateString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-1">
                                            <span className={`text-xs md:text-sm font-bold ${event.capacity <= 5 ? "text-red-500" : "text-green-600"}`}>
                                                {event.capacity} Left
                                            </span>

                                            {event.capacity === 0 && (
                                                <span className="text-[9px] md:text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                                                    SOLD OUT
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            disabled={event.capacity === 0}
                                            className={`w-full py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 ${event.capacity === 0
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

                {!loading && events.filter(ev => ev.title?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 italic">No events match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;