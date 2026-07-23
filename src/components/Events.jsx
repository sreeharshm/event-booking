import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavEvent, getAllEvent, BASE_URLs } from '../api/Allapi';
import { Heart, LogOut, Search, X, Calendar, TextAlignJustify, Menu, User, BookOpen } from 'lucide-react';
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

    const [sideModal, setSideModal] = useState(false);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { username: "Guest" };

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
        } catch (err) {
            console.error("event fetching failed", err);
        } finally {
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
            await addFavEvent({}, eventId);
        } catch (err) {
            console.error("Favorite sync failed", err);
            fetchEvents();
        }
    };

    const handleOpenModal = () => {
        setSideModal(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f5f5fa] pb-20 text-[#222222]">
            {/* --- NAVBAR START --- */}
            <nav className="fixed bg-[#333545] top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-12 shadow-md">
                <div className="flex items-center gap-4">
                    <TextAlignJustify
                        onClick={() => setSideBar(true)}
                        className='md:hidden cursor-pointer text-white'
                    />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-white text-xl md:text-2xl font-black tracking-tight font-sans">
                            book<span className="text-[#f84464]">my</span>show
                        </p>
                    </div>

                </div>

                {/* Search Bar Wrapper */}
                <div className="relative flex items-center h-10 flex-1 max-w-[200px] sm:max-w-xs md:max-w-md bg-white rounded-md px-3 border border-gray-200 shadow-inner" ref={searchRef}>
                    <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search for Movies, Events, Plays and Activities..."
                        className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full outline-none p-0 text-gray-700 placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setIsDropdownOpen(true)}
                    />
                    {searchQuery && (
                        <X
                            size={16}
                            onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }}
                            className="text-gray-400 cursor-pointer hover:text-[#f84464]"
                        />
                    )}

                    {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-2xl z-[60] overflow-hidden">
                            {filteredResults.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSearchQuery(item.title || "");
                                        setIsDropdownOpen(false);
                                        navigate(`/booking/${item.id}`);
                                    }}
                                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 flex items-center gap-3 transition-colors ${index === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                >
                                    <img
                                        src={item.image || "https://via.placeholder.com/40"}
                                        alt=""
                                        className="w-8 h-8 rounded object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="text-xs font-medium text-gray-300 hover:text-white transition-colors">Home</button>
                    <button className="text-sm font-bold text-white border-b-2 border-[#f84464] pb-1">Events</button>
                    <button className="text-xs font-medium text-gray-300 hover:text-white transition-colors">About</button>

                    <div className="flex items-center gap-3 bg-[#43465e] px-4 py-1.5 rounded-full border border-gray-600/40">
                        <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white shadow-inner">
                            {user?.username?.charAt(0) || <User size={12} />}
                        </div>
                        <span className="text-xs font-semibold tracking-wide hidden sm:inline text-gray-200">
                            {user?.username || "Guest"}
                        </span>
                    </div>

                    <Menu
                        size={20}
                        className='cursor-pointer text-gray-300 hover:text-white transition-colors'
                        onClick={handleOpenModal}
                    />
                </div>
            </nav>

            {sidebar && (
                <div
                    className='fixed inset-0 bg-black/50 z-50 backdrop-blur-sm'
                    onClick={() => setSideBar(false)}
                >
                    <div
                        className='fixed left-0 top-0 h-screen bg-[#333545] w-56 p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 ease-out transform translate-x-0'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                                <p className="text-white text-xl font-black tracking-tight">
                                    book<span className="text-[#f84464]">my</span>show
                                </p>
                                <X
                                    size={20}
                                    className="text-gray-400 cursor-pointer hover:text-[#f84464]"
                                    onClick={() => setSideBar(false)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <button onClick={() => { navigate('/home'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">Home</button>
                                <button onClick={() => { navigate('/event'); setSideBar(false); }} className="text-left text-sm font-bold text-white bg-[#f84464] px-4 py-2.5 rounded-lg">Events</button>
                                <button onClick={() => { navigate('/mybooking'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">My Booking</button>
                                <button onClick={() => { navigate('/myprofile'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">My Profile</button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 text-white text-sm font-bold bg-[#f84464] hover:bg-[#f84464]/90 w-full py-3 rounded-lg transition-all shadow-md mt-auto"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}


            {sideModal && (
                <div
                    className='inset-0 fixed bg-black/40 z-50 backdrop-blur-xs animate-in fade-in duration-200'
                    onClick={() => setSideModal(false)}
                >
                    <div
                        className='fixed bg-white w-64 h-full shadow-2xl top-0 right-0 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300 ease-out text-[#222222]'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center justify-between pb-4 border-b border-gray-100'>
                                <h3 className='font-bold text-lg text-gray-800'>Account</h3>
                                <X
                                    size={20}
                                    className='text-gray-400 cursor-pointer hover:text-[#f84464] transition-colors'
                                    onClick={() => setSideModal(false)}
                                />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <button onClick={() => { navigate('/myprofile'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-[#f84464] hover:bg-gray-50 rounded-lg transition-all text-left'>
                                    <User size={16} /> Profile
                                </button>
                                <button onClick={() => { navigate('/fav'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-[#f84464] hover:bg-gray-50 rounded-lg transition-all text-left'>
                                    <Heart size={16} /> Favorite Events
                                </button>
                                <button onClick={() => { navigate('/mybooking'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-[#f84464] hover:bg-gray-50 rounded-lg transition-all text-left'>
                                    <BookOpen size={16} /> My Booking
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className='flex items-center justify-center gap-2 text-white text-sm font-bold bg-[#f84464] hover:bg-[#f84464]/90 w-full py-3 rounded-lg transition-all shadow-md'
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="pt-24 md:pt-28 px-4 md:px-12 max-w-7xl mx-auto mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#222222] mb-1">
                    Events In Your Location
                </h1>
                <p className="text-xs md:text-sm text-gray-500">Discover live experiences, masterclasses, and music shows around you.</p>
            </div>

            {/* Content Grid */}
            <div className="px-4 md:px-12 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {events
                            .filter(ev => ev.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((event) => {
                                console.log("IMAGE URL:", event.image);

                                return (

                                    <div
                                        key={event.id}
                                        onClick={() => navigate(`/booking/${event.id}`)}
                                        className="group bg-transparent overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between"
                                    >
                                        <div className="relative aspect-[2/3] md:aspect-[3/4] rounded-xl overflow-hidden w-full bg-gray-200 shadow-sm border border-gray-100">
                                            <img
                                                src={event.image || "https://via.placeholder.com/400x600"}
                                                alt={event.title}
                                                onError={(e) => {
                                                    // If Cloudinary returns 404 or fails, swap to fallback image
                                                    e.currentTarget.onerror = null; // Prevents infinite loops
                                                    e.currentTarget.src = "https://via.placeholder.com/400x600";
                                                }}
                                                className="w-full h-full object-cover transition-transform duration-300"
                                            />

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFavEvent(event.id);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full transition-colors shadow-sm z-10"
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={event.is_favorite ? "fav" : "unfav"}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: [0, 1.2, 1] }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Heart
                                                            size={16}
                                                            className={`transition-colors ${event.is_favorite ? "text-[#f84464] fill-[#f84464]" : "text-white"}`}
                                                        />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </motion.button>

                                            {/* Bottom Overlay Info Banner */}
                                            <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-xs text-white px-3 py-1.5 text-xs md:text-sm font-medium flex justify-between items-center">
                                                <span>₹{event.price} onwards</span>
                                                <span className={`text-[10px] md:text-xs font-bold ${event.capacity <= 5 ? "text-orange-400" : "text-emerald-400"}`}>
                                                    {event.capacity === 0 ? "Sold Out" : `${event.capacity} seats left`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Text Info Section styled exactly like BookMyShow's minimal card titles */}
                                        <div className="pt-3 pb-2 px-1 flex-1 flex flex-col justify-between gap-1">
                                            <div>
                                                <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#f84464] transition-colors">
                                                    {event.title}
                                                </h3>

                                                <p className="text-xs text-gray-500 font-medium mt-1 truncate">
                                                    {event.location}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-gray-400 text-xs pt-1">
                                                <Calendar size={13} className="text-gray-400" />
                                                <span className="truncate">{new Date(event.date).toDateString()}</span>
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    disabled={event.capacity === 0}
                                                    className={`w-full py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${event.capacity === 0
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "bg-[#f84464] text-white hover:bg-[#f84464]/90"
                                                        }`}
                                                >
                                                    {event.capacity === 0 ? "Sold Out" : "Book Tickets"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                );

                            })}
                    </div>
                )}

                {!loading && events.filter(ev => ev.title?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 italic">No live events matching your choice right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;