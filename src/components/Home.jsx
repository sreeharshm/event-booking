import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LogOut, Calendar, X, Bell, TextAlignJustify, Menu, User, Heart, BookOpen, ArrowRight } from 'lucide-react';
import { getAllEvent, BASE_URLs } from '../api/Allapi';

function Home() {
    const navigate = useNavigate();
    const desktopSearchRef = useRef(null);
    const mobileSearchRef = useRef(null);

    // --- User Info ---
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { username: "Guest" };

    const [sideBar, setSideBar] = useState(false);

    // --- Search & Data States ---
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const [sideModal, setSideModal] = useState(false);

    // 1. Fetch data for search
    useEffect(() => {
        getAllEvent()
            .then(res => setEvents(res.data))
            .catch(err => console.error("Search fetch failed", err));
    }, []);

    // 2. Search logic
    useEffect(() => {
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
    }, [searchQuery, events]);

    // Keyboard Navigation for Search Dropdown
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isDropdownOpen || filteredResults.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % filteredResults.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
            } else if (e.key === "Enter" && activeIndex >= 0) {
                e.preventDefault();
                const selectedItem = filteredResults[activeIndex];
                setSearchQuery(selectedItem.title || "");
                setIsDropdownOpen(false);
                navigate(`/booking/${selectedItem.id}`);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDropdownOpen, filteredResults, activeIndex, navigate]);

    // 3. Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileSearchRef.current &&
                !mobileSearchRef.current.contains(event.target) &&
                desktopSearchRef.current &&
                !desktopSearchRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpenModal = () => {
        setSideModal(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-gray-800 font-sans overflow-x-hidden">

            {/* --- PREMIUM BOOKMYSHOW NAVBAR --- */}
            <nav className="fixed bg-[#333545] text-white top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-12 shadow-md">
                <div className="flex items-center gap-4">
                    <TextAlignJustify
                        onClick={() => setSideBar(true)}
                        className='md:hidden cursor-pointer text-gray-200 w-6 h-6 hover:text-rose-500 transition-colors'
                    />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-white text-xl md:text-2xl font-black tracking-tight">
                            event<span className="text-rose-500">hub</span>
                        </p>
                    </div>
                </div>

                {/* Desktop Search Bar Layout */}
                <div className="hidden md:block relative w-2/5 max-w-xl" ref={desktopSearchRef}>
                    <div className="flex items-center bg-white rounded-md px-3 py-2 border border-transparent shadow-inner">
                        <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search for Movies, Events, Plays, Sports and Activities..."
                            className="bg-transparent border-none text-xs w-full outline-none text-gray-800 placeholder-gray-400"
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
                        <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-md shadow-2xl z-[60] overflow-hidden text-gray-800">
                            {filteredResults.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSearchQuery(item.title || "");
                                        setIsDropdownOpen(false);
                                        navigate(`/booking/${item.id}`);
                                    }}
                                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 flex items-center gap-3 transition-colors ${index === activeIndex ? "bg-rose-50 text-rose-600" : "hover:bg-rose-50"}`}
                                >
                                    <img
                                        src={item.image ? `${BASE_URLs}${item.image}` : "https://via.placeholder.com/40"}
                                        alt=""
                                        className="w-9 h-12 rounded object-cover shadow-sm"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Search Input Area */}
                <div className="relative md:hidden flex-1 max-w-[160px] sm:max-w-[240px]" ref={mobileSearchRef}>
                    <div className="flex items-center h-9 bg-white/10 rounded px-2 border border-transparent focus-within:bg-white focus-within:text-gray-800 transition-all">
                        <Search size={14} className="text-gray-300 mr-1.5 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="bg-transparent border-none text-xs w-full outline-none text-white focus:text-gray-800 placeholder-gray-400 p-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setIsDropdownOpen(true)}
                        />
                        {searchQuery && (
                            <X
                                size={14}
                                onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }}
                                className="text-gray-400 cursor-pointer hover:text-rose-500 ml-1"
                            />
                        )}
                    </div>

                    {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-11 right-0 w-[220px] bg-white border border-gray-200 rounded shadow-2xl z-[60] overflow-hidden text-gray-800">
                            {filteredResults.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSearchQuery(item.title || "");
                                        setIsDropdownOpen(false);
                                        navigate(`/booking/${item.id}`);
                                    }}
                                    className={`px-3 py-2.5 cursor-pointer border-b border-gray-100 flex items-center gap-2 transition-colors ${index === activeIndex ? "bg-rose-50 text-rose-600" : "hover:bg-rose-50"}`}
                                >
                                    <img
                                        src={item.image ? `${BASE_URLs}${item.image}` : "https://via.placeholder.com/40"}
                                        alt=""
                                        className="w-7 h-10 rounded object-cover shadow-sm flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold text-gray-800 truncate">{item.title}</p>
                                        <p className="text-[9px] text-gray-400 uppercase truncate">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Menu Utilities */}
                <div className="hidden md:flex items-center gap-6">
                    <button  className="text-sm font-bold text-white border-b-2 border-[#f84464] pb-1">Home</button>

                    <button onClick={() => navigate('/event')} className="text-xs font-semibold text-gray-200 hover:text-white transition-colors">Events</button>
                    <button  className="text-xs font-semibold text-gray-200 hover:text-white transition-colors">About</button>
                    <div className="h-4 w-[1px] bg-gray-500/40" />

                    {/* User Profile Quick Tag */}
                    <div className="flex items-center gap-2 bg-[#43465e] px-3 py-1 rounded border border-gray-600/30">
                        <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-black uppercase text-white shadow-inner">
                            {user?.username?.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-gray-200 max-w-[80px] truncate">
                            Hi, {user?.username}
                        </span>
                    </div>

                    <Menu
                        size={20}
                        className='cursor-pointer text-gray-300 hover:text-white transition-colors'
                        onClick={handleOpenModal}
                    />
                </div>
            </nav>

            {/* --- MOBILE DRAWER NAVIGATION --- */}
            {sideBar && (
                <div
                    className='fixed inset-0 bg-black/40 z-50 backdrop-blur-xs'
                    onClick={() => setSideBar(false)}
                >
                    <div
                        className='fixed left-0 top-0 h-screen bg-white w-56 p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <p className="text-gray-900 text-xl font-black tracking-tight">
                                    event<span className="text-rose-500">hub</span>
                                </p>
                                <X
                                    size={20}
                                    className="text-gray-400 cursor-pointer hover:text-rose-500"
                                    onClick={() => setSideBar(false)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <button className="text-left text-xs font-bold text-rose-600 bg-rose-50 px-4 py-3 rounded-lg">Home</button>
                                <button onClick={() => { navigate('/event'); setSideBar(false); }} className="text-left text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all">Live Events</button>
                                <button onClick={() => { navigate('/mybooking'); setSideBar(false); }} className="text-left text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all">Your Bookings</button>
                                <button onClick={() => { navigate('/myprofile'); setSideBar(false); }} className="text-left text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-all">Account Settings</button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 text-white text-xs font-bold bg-rose-600 hover:bg-rose-700 w-full py-3 rounded-lg transition-all shadow"
                        >
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* --- DESKTOP RIGHT DRAWER MODAL --- */}
            {sideModal && (
                <div
                    className='inset-0 fixed bg-black/30 z-50 backdrop-blur-xs'
                    onClick={() => setSideModal(false)}
                >
                    <div
                        className='fixed bg-white w-68 h-full shadow-2xl top-0 right-0 p-6 flex flex-col justify-between'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center justify-between pb-4 border-b border-gray-100'>
                                <h3 className='font-black text-gray-900 text-base tracking-tight'>Hey! {user.username}</h3>
                                <X
                                    size={18}
                                    className='text-gray-400 cursor-pointer hover:text-rose-500 transition-colors'
                                    onClick={() => setSideModal(false)}
                                />
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <button onClick={() => { navigate('/myprofile'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-gray-50 rounded-xl transition-all text-left'>
                                    <User size={15} className="text-gray-400" /> Your Profile
                                </button>
                                <button onClick={() => { navigate('/fav'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-gray-50 rounded-xl transition-all text-left'>
                                    <Heart size={15} className="text-gray-400" /> Watchlist / Favorites
                                </button>
                                <button onClick={() => { navigate('/mybooking'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-gray-50 rounded-xl transition-all text-left'>
                                    <BookOpen size={15} className="text-gray-400" /> Transaction History
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className='flex items-center justify-center gap-2 text-white text-xs font-bold bg-rose-600 hover:bg-rose-700 w-full py-3 rounded-xl transition-all shadow-md'
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            )}

            {/* --- MAIN HERO ENTERTAINMENT AREA --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-24 md:mt-28 mb-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                <div className="flex-1 space-y-5 text-center lg:text-left order-2 lg:order-1">

                    {/* Tag notification pill */}
                    <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase">
                        <Bell size={12} /> Entertainment Alert
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                        It All Starts <br className="hidden md:inline" />
                        Here, <span className="text-rose-500">Live & Uncut.</span>
                    </h1>

                    <p className="text-gray-500 text-sm sm:text-base font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Discover and book tickets for top movies, grand musical concerts, stand-up comedy, sporting blockbusters, and elite theatrical features in your town.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                        <Link to="/event" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto justify-center bg-rose-500 text-white px-8 py-3.5 rounded-md text-sm font-bold hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all flex items-center gap-2 tracking-wide">
                                <Calendar size={15} /> Book Live Experiences <ArrowRight size={14} />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Cinematic Promo Banner Frame */}
                <div className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2">
                    <div className="relative w-full max-w-md lg:max-w-xl bg-white p-2 rounded-xl shadow-xl border border-gray-200/40">
                        <img
                            src="https://cdn.dribbble.com/userupload/11885764/file/original-05d46ef8d3f6b5f33de19a893c819aeb.png?resize=1200x900&vertical=center"
                            alt="Entertainment Banner Showcase"
                            className="w-full h-auto object-cover rounded-lg shadow"
                        />
                    </div>
                </div>
            </main>

            {/* --- SUB-FOOTER BRAND BADGE --- */}
            <footer className="w-full bg-[#333545] text-gray-400 py-4 text-center text-xs font-semibold border-t border-gray-700/50 mt-auto">
                24/7 Customer Care Assistance Support Active • <span className="text-white cursor-pointer hover:underline">Help Center</span>
            </footer>
        </div>
    );
}

export default Home;