import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LogOut, Calendar, X, Bell } from 'lucide-react';
import { getAllEvent, BASE_URLs } from '../api/Allapi';

function Home() {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // --- User Info ---
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { username: "Guest" };

    // --- Search & Data States ---
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 1. Fetch data for search
    useEffect(() => {
        getAllEvent()
            .then(res => setEvents(res.data))
            .catch(err => console.error("Search fetch failed", err));
    }, []);

    // 2. Search logic (matching your other pages)
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredResults([]);
            setIsDropdownOpen(false);
        } else {
            const results = events
                .filter((event) =>
                    event.title.toLowerCase().startsWith(searchQuery.toLowerCase())
                )
                .slice(0, 5);
            setFilteredResults(results);
            setIsDropdownOpen(true);
        }
    }, [searchQuery, events]);

    // 3. Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
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
        <div className="flex flex-col min-h-screen bg-[#fbfcfd]">
            {/* --- NAVBAR START (Matching Mybooking design) --- */}
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
                            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <X 
                                size={16} 
                                onClick={() => setSearchQuery("")} 
                                className="text-gray-400 cursor-pointer hover:text-rose-500" 
                            />
                        )}
                    </div>

                    {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-2xl z-[60] overflow-hidden">
                            {filteredResults.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/booking/${item.id}`)}
                                    className="px-4 py-3 cursor-pointer border-b border-gray-50 flex items-center gap-3 hover:bg-rose-50 transition-colors"
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
                    <button onClick={() => navigate('/home')} className="hidden lg:block text-sm font-bold text-rose-500 underline underline-offset-8 decoration-2">Home</button>
                    <button onClick={() => navigate('/event')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Events</button>
                    <button onClick={() => navigate('/mybooking')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My Booking</button>
                    <button onClick={() => navigate('/myprofile')} className="hidden lg:block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My Profile</button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-white text-xs font-bold bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>
            {/* --- NAVBAR END --- */}

            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 mt-32 mb-12 max-w-7xl mx-auto w-full gap-10">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                        <Bell size={14} /> Welcome back, {user.username}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                        What's the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Plan for Today?</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-md">
                        Explore exclusive events curated just for you. From high-energy concerts to professional tech workshops.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to="/event">
                            <button className="bg-rose-500 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-rose-600 shadow-xl shadow-rose-100 transition-all flex items-center gap-2 active:scale-95">
                                <Calendar size={18} /> Browse Events
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 relative w-full flex justify-center lg:justify-end">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-orange-300 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img
                            src="https://cdn.dribbble.com/userupload/11885764/file/original-05d46ef8d3f6b5f33de19a893c819aeb.png?resize=1200x900&vertical=center"
                            alt="Dashboard Preview"
                            className="relative w-full max-w-lg rounded-[2rem] shadow-2xl border-4 border-white transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;