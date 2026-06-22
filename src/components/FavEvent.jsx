import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavEvent, removeFavEvent, curretUser, BASE_URLs } from '../api/Allapi';
import { Heart, LogOut, Search, X, Calendar, User, ArrowLeft, Loader2, BookOpen, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function FavEvent() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // --- Search States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // 1. Initial Data Fetch
    useEffect(() => {
        fetchUserData();
        fetchFavorites();
    }, []);

    // 2. Search Logic matching Mybooking & Home
    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setFilteredResults([]);
                setIsDropdownOpen(false);
                setActiveIndex(-1);
            } else {
                const results = favorites
                    .filter((item) => {
                        const event = item.event ? item.event : item;
                        return event.title?.toLowerCase().startsWith(searchQuery.toLowerCase());
                    })
                    .slice(0, 5);
                setFilteredResults(results);
                setIsDropdownOpen(true);
                setActiveIndex(-1);
            }
        }, 300);
        return () => clearTimeout(delay);
    }, [searchQuery, favorites]);

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

    const fetchUserData = async () => {
        try {
            const response = await curretUser();
            const userData = Array.isArray(response.data) ? response.data[0] : response.data;
            setUser(userData);
        } catch (err) {
            console.error("Failed to fetch user", err);
        }
    };

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await getFavEvent();
            if (res.data) {
                setFavorites(Array.isArray(res.data) ? res.data : []);
            } else {
                setFavorites(Array.isArray(res) ? res : []);
            }
        } catch (err) {
            console.error("Favorite event fetching failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFav = async (eventId) => {
        setFavorites(prev =>
            prev.filter(fav => {
                const event = fav.event ? fav.event : fav;
                return event.id !== eventId;
            })
        );

        try {
            await removeFavEvent(eventId);
        } catch (err) {
            console.error(err);
            fetchFavorites();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading && favorites.length === 0) return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-gray-800 font-sans">
            {/* --- BOOKMYSHOW NAVBAR --- */}
            <nav className="bg-[#333545] text-white sticky top-0 z-50 px-4 py-3 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    {/* Logo Branding */}
                    <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/home')}>
                        <p className="text-white text-2xl font-black tracking-tight">
                            event<span className="text-rose-500">hub</span>
                        </p>
                    </div>

                    {/* Integrated Search Bar */}
                    <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
                        <div className="flex items-center bg-[#43465e] rounded-xl px-4 py-2 border border-transparent focus-within:border-rose-400 focus-within:bg-white text-gray-200 focus-within:text-gray-800 transition-all">
                            <Search size={16} className="mr-2 shrink-0 opacity-70" />
                            <input
                                type="text"
                                placeholder="Search saved favorites..."
                                className="bg-transparent border-none text-xs w-full outline-none font-medium placeholder-current opacity-80 focus:opacity-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setIsDropdownOpen(true)}
                            />
                            {searchQuery && (
                                <X
                                    size={14}
                                    onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }}
                                    className="cursor-pointer hover:text-rose-500 text-gray-400"
                                />
                            )}
                        </div>

                        {isDropdownOpen && filteredResults.length > 0 && (
                            <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] overflow-hidden text-gray-800">
                                {filteredResults.map((item, index) => {
                                    const event = item.event ? item.event : item;
                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() => {
                                                setSearchQuery(event.title || "");
                                                setIsDropdownOpen(false);
                                                navigate(`/booking/${event.id}`);
                                            }}
                                            className={`px-4 py-2.5 cursor-pointer border-b border-gray-50 flex items-center gap-3 transition-colors ${index === activeIndex ? "bg-rose-100" : "hover:bg-rose-50"}`}
                                        >
                                            <img
                                                src={event.image ? `${BASE_URLs}${event.image}` : "https://via.placeholder.com/40"}
                                                alt=""
                                                className="w-8 h-8 rounded object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-700 truncate">{event.title}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{event.location}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    {/* Minimalist Profile Indicator */}
                    <div className="flex items-center gap-3 bg-[#43465e] px-4 py-1.5 rounded-full border border-gray-600/40 shrink-0">
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
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 font-bold text-xs mb-6 hover:text-rose-500 transition-colors group uppercase tracking-wider"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Discover
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* --- LEFT SIDEBAR PANEL --- */}
                    <aside className="w-full md:w-72 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden sticky md:top-24">
                        <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-2xl uppercase border-2 border-white shadow-md mb-3">
                                {user?.username?.charAt(0)}
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">{user?.username || "Guest User"}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{user?.email}</p>
                        </div>
                        
                        <div className="p-3 space-y-0.5">
                           <button onClick={() => navigate('/myprofile')} className="w-full flex items-center gap-3.5 text-left text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-4 py-3.5 rounded-xl transition-all">
                                <User size={16} className="text-gray-400" /> Account & Profile
                            </button>
                            
                            <button className="w-full flex items-center gap-3.5 text-left text-xs font-bold text-rose-600 bg-rose-50 px-4 py-3.5 rounded-xl">
                                <Heart size={16} className="fill-rose-500 text-rose-500" /> Saved Favorites
                            </button>
                            
                            <button onClick={() => navigate('/mybooking')} className="w-full flex items-center gap-3.5 text-left text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-4 py-3.5 rounded-xl transition-all">
                                <ShieldCheck size={16} className="text-gray-400" /> Purchase History
                            </button>
                            
                            <div className="pt-4 mt-2 border-t border-gray-100">
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
                        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">Saved Favorites</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Your curated shortlist of interactive local listings and experiences.</p>
                            </div>
                            <div className="bg-rose-50 rounded-xl p-2 px-4 border border-rose-100 text-center min-w-[100px]">
                                <p className="text-xl font-black text-rose-600">{favorites.length}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Saved</p>
                            </div>
                        </div>

                        {/* Search Input for Mobile Viewports */}
                        <div className="p-6 pb-0 md:hidden" ref={searchRef}>
                            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:bg-white focus-within:border-rose-400 transition-all">
                                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search saved favorites..."
                                    className="bg-transparent border-none text-xs w-full outline-none font-semibold text-gray-800"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Content Grid Container */}
                        <div className="p-6 sm:p-8">
                            {favorites.filter(item => {
                                const targetEvent = item.event ? item.event : item;
                                return targetEvent.title?.toLowerCase().includes(searchQuery.toLowerCase());
                            }).length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <Heart size={36} className="text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-gray-500">No favorite events matching criteria found.</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Start exploring and favoriting local listings to build your snapshot collection.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favorites
                                        .filter(item => {
                                            const targetEvent = item.event ? item.event : item;
                                            return targetEvent.title?.toLowerCase().includes(searchQuery.toLowerCase());
                                        })
                                        .map((item) => {
                                            const event = item.event ? item.event : item;
                                            return (
                                                <div
                                                    key={event.id || item.id}
                                                    onClick={() => navigate(`/booking/${event.id}`)}
                                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200/70 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                                                >
                                                    <div className="relative h-40 overflow-hidden w-full bg-gray-100">
                                                        <img
                                                            src={event.image ? `${BASE_URLs}${event.image}` : "https://via.placeholder.com/400x300"}
                                                            alt={event.title || "Event Image"}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />

                                                        {/* Heart toggle button */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.15 }}
                                                            whileTap={{ scale: 0.85 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveFav(event.id);
                                                            }}
                                                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-colors shadow-sm z-10"
                                                        >
                                                            <AnimatePresence mode="wait">
                                                                <motion.div
                                                                    key="fav"
                                                                    initial={{ scale: 1 }}
                                                                    exit={{ scale: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <Heart
                                                                        size={16}
                                                                        className="text-rose-500 fill-rose-500"
                                                                    />
                                                                </motion.div>
                                                            </AnimatePresence>
                                                        </motion.button>

                                                        <div className="absolute bottom-3 left-3 bg-rose-600 text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-md">
                                                            ₹{event.price || 0}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-sm font-black text-gray-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                                                                {event.title || "Unnamed Event"}
                                                            </h3>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1 truncate">
                                                                {event.location || "Online / TBD"}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs pt-1">
                                                            <Calendar size={13} className="text-rose-500 shrink-0" />
                                                            <span className="truncate font-medium">
                                                                {event.date ? new Date(event.date).toDateString() : 'No date available'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                                            <span className={`text-xs font-bold ${(event.capacity || 0) <= 5 ? "text-red-500" : "text-green-600"}`}>
                                                                {event.capacity !== undefined ? `${event.capacity} Tickets Left` : "Available"}
                                                            </span>

                                                            {event.capacity === 0 && (
                                                                <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold tracking-wider">
                                                                    SOLD OUT
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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

export default FavEvent;