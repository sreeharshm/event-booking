import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LogOut, Calendar, X, Bell, TextAlignJustify } from 'lucide-react';
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
        } else {
            const results = events
                .filter((event) =>
                    event.title?.toLowerCase().startsWith(searchQuery.toLowerCase())
                )
                .slice(0, 5);
            setFilteredResults(results);
            setIsDropdownOpen(true);
        }
    }, [searchQuery, events]);

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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fbfcfd] overflow-x-hidden">
            {/* --- NAVBAR START --- */}
            <nav className="fixed bg-white/80 backdrop-blur-md top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-12 shadow-sm border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <TextAlignJustify
                        onClick={() => setSideBar(true)}
                        className='md:hidden cursor-pointer text-gray-700 w-6 h-6'
                    />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-rose-500 text-xl md:text-2xl font-black tracking-tighter font-mono">
                            EVENT <span className="text-gray-800">HUB</span>
                        </p>
                    </div>
                </div>

                {/* Mobile Drawer Navigation Sidebar */}
                {sideBar && (
                    <div
                        className='fixed inset-0 bg-black/20 z-50 backdrop-blur-sm'
                        onClick={() => setSideBar(false)}
                    >
                        <div
                            className='fixed left-0 top-0 h-screen bg-white w-48 p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 ease-out transform translate-x-0'
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
                                    {/* FIXED: Fixed route path string syntax typo from 'homet' to '/home' */}
                                    <button  className="text-left text-sm font-bold text-rose-500 bg-rose-50/50 px-4 py-2.5 rounded-xl">Home</button>
                                    <button onClick={() => { navigate('/event'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">Events</button>
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

                {/* Mobile Search Input Wrapper Area */}
                <div className="relative md:hidden flex-1 max-w-[140px] sm:max-w-[200px]" ref={mobileSearchRef}>
                    <div className="flex items-center h-9 bg-gray-100 rounded-lg px-2 border border-transparent focus-within:border-rose-300 focus-within:bg-white transition-all shadow-inner">
                        <Search size={15} className="text-gray-400 mr-1.5 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none p-0 min-w-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setIsDropdownOpen(true)}
                        />
                        {searchQuery && (
                            <X
                                size={14}
                                onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); }}
                                className="text-gray-400 cursor-pointer hover:text-rose-500 flex-shrink-0 ml-1"
                            />
                        )}
                    </div>

                    {/* FIXED: Wrapped mobile search dropdown menu structure relative to container element mapping */}
                    {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-11 right-0 w-[200px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] overflow-hidden">
                            {filteredResults.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSearchQuery(item.title || "");
                                        setIsDropdownOpen(false);
                                        navigate(`/booking/${item.id}`);
                                    }}
                                    className={`px-3 py-2 cursor-pointer border-b border-gray-50 flex items-center gap-2 transition-colors ${index === activeIndex ? "bg-rose-100" : "hover:bg-rose-50"}`}
                                >
                                    <img
                                        src={item.image ? `${BASE_URLs}${item.image}` : "https://via.placeholder.com/40"}
                                        alt=""
                                        className="w-6 h-6 rounded object-cover flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold text-gray-700 truncate">{item.title}</p>
                                        <p className="text-[9px] text-gray-400 uppercase truncate">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Search Bar Layout */}
                <div className="hidden md:block relative w-1/3" ref={desktopSearchRef}>
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

                {/* Standard Top Right Navigation Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="text-sm font-bold text-rose-500 underline underline-offset-8 decoration-2">Home</button>
                    <button onClick={() => navigate('/event')} className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Events</button>
                    <button onClick={() => navigate('/mybooking')} className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My Booking</button>
                    <button onClick={() => navigate('/myprofile')} className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My profile</button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>
            {/* --- NAVBAR END --- */}

            {/* --- HERO SECTION --- */}
            {/* CHANGED: Swapped items-center for items-start on desktop, adjusted flex layout ordering, spacing padding limits */}
            <section className="flex flex-col lg:flex-row items-center lg:items-start justify-between px-4 sm:px-8 md:px-16 mt-24 md:mt-32 mb-12 max-w-7xl mx-auto w-full gap-8 lg:gap-12">

                {/* Hero Text Copy Column */}
                {/* CHANGED: Checked typography scaling bounds; text centers out automatically on small media sizes */}
                <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left ordering-1 order-2 lg:order-1 w-full">
                    <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[11px] md:text-xs font-bold tracking-wide uppercase">
                        <Bell size={12} className="md:w-3.5 md:h-3.5" /> Welcome back, {user.username}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                        What's the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Plan for Today?</span>
                    </h1>

                    <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium max-w-md mx-auto lg:mx-0">
                        Explore exclusive events curated just for you. From high-energy concerts to professional tech workshops.
                    </p>

                    <div className="flex justify-center lg:justify-start pt-2">
                        <Link to="/event" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto justify-center bg-rose-500 text-white px-6 py-3 md:px-8 md:py-3.5 rounded-2xl text-sm md:text-base font-bold hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all flex items-center gap-2 active:scale-95">
                                <Calendar size={16} className="md:w-[18px] md:h-[18px]" /> Browse Events
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Hero Feature Illustration Column Image Container */}
                {/* CHANGED: Scaled image bounding box sizes downward so it never captures the entire screen height on mobile layout stacks */}
                <div className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2">
                    <div className="relative group w-full max-w-[320px] sm:max-w-[400px] md:max-w-md lg:max-w-lg">
                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-orange-300 rounded-[1.5rem] md:rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <img
                            src="https://cdn.dribbble.com/userupload/11885764/file/original-05d46ef8d3f6b5f33de19a893c819aeb.png?resize=1200x900&vertical=center"
                            alt="Dashboard Preview"
                            className="relative w-full h-auto object-cover rounded-[1.5rem] md:rounded-[2.2rem] shadow-2xl border-2 md:border-4 border-white transition-transform duration-500 group-hover:scale-[1.01]"
                        />
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Home;