import React, { useEffect, useState, useRef } from "react";
import {
    getFavEvent,
    removeFavEvent,
    curretUser,
    BASE_URLs,
} from "../api/Allapi";

import {
    User,
    ShieldCheck,
    Loader2,
    LogOut,
    ArrowLeft,
    Calendar,
    Heart,
    Search,
    Menu,
    X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function FavEvent() {
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Sidebar
    const [sidebarOpen, setSidebarOpen] = useState(
        window.innerWidth >= 768
    );

    // Search
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const searchRef = useRef(null);

    useEffect(() => {
        fetchUserData();
        fetchFavorites();

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (!searchQuery.trim()) {
                setFilteredResults([]);
                setIsDropdownOpen(false);
                return;
            }

            const results = favorites
                .filter((item) => {
                    const event = item.event || item;

                    return event.title
                        ?.toLowerCase()
                        .startsWith(searchQuery.toLowerCase());
                })
                .slice(0, 5);

            setFilteredResults(results);
            setIsDropdownOpen(true);
            setActiveIndex(-1);
        }, 300);

        return () => clearTimeout(delay);
    }, [searchQuery, favorites]);

    useEffect(() => {
        const close = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", close);

        return () => document.removeEventListener("mousedown", close);
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await curretUser();

            const data = Array.isArray(response.data)
                ? response.data[0]
                : response.data;

            setUser(data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchFavorites = async () => {
        setLoading(true);

        try {
            const res = await getFavEvent();

            setFavorites(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFav = async (id) => {
        setFavorites((prev) =>
            prev.filter((item) => {
                const event = item.event || item;
                return event.id !== id;
            })
        );

        try {
            await removeFavEvent(id);
        } catch {
            fetchFavorites();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (loading && favorites.length === 0) {
        return (
            <div className="h-screen flex justify-center items-center bg-gray-50">
                <Loader2
                    className="animate-spin text-rose-500"
                    size={40}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">

            {/* NAVBAR */}

            <nav className="bg-[#1f2533] sticky top-0 z-50 shadow-md px-4 py-3">

                <div className="max-w-6xl mx-auto flex items-center justify-between">

                    <div
                        className="cursor-pointer"
                        onClick={() => navigate("/home")}
                    >
                        <p className="text-2xl font-black text-white">
                            event
                            <span className="text-rose-500">hub</span>
                        </p>
                    </div>

                    <div
                        ref={searchRef}
                        className="hidden md:block relative w-full max-w-md mx-8"
                    >
                        <div className="flex items-center bg-[#2f364a] rounded-xl px-4 py-2">

                            <Search
                                size={16}
                                className="text-gray-400 mr-2"
                            />

                            <input
                                className="bg-transparent text-white w-full outline-none text-sm"
                                placeholder="Search favourite events..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                            />

                            {searchQuery && (
                                <X
                                    size={15}
                                    onClick={() => {
                                        setSearchQuery("");
                                        setIsDropdownOpen(false);
                                    }}
                                    className="cursor-pointer text-gray-400"
                                />
                            )}
                        </div>

                        {isDropdownOpen && filteredResults.length > 0 && (
                        <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-xl  overflow-hidden">

                                {filteredResults.map((item) => {
                                    const event = item.event || item;

                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() => {
                                                navigate(`/booking/${event.id}`);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 cursor-pointer"
                                        >
                                            <img
                                                src={`${BASE_URLs}${event.image}`}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />

                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {event.title}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {event.location}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 bg-[#2f364a] px-4 py-1.5 rounded-full  ">

                        <div className="w-8 h-8 rounded-full bg-rose-500 flex justify-center items-center text-white font-bold uppercase">
                            {user?.username?.charAt(0)}
                        </div>

                        <span className="hidden sm:block text-sm text-white">
                            Hi, {user?.username}
                        </span>

                    </div>

                </div>

            </nav>

            {/* PAGE WRAPPER */}
            <div className="max-w-6xl mx-auto px-4 py-6">

                {/* Control Bar */}
                <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 rounded-xl   bg-white hover:bg-gray-50 shadow-sm"
                        >
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-rose-600"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                    </div>

                </div>

                <div className="flex gap-6 relative items-start">

                    {/* SIDEBAR */}

                    <aside
                        className={`
            fixed md:sticky
            top-0 md:top-24
            left-0
            z-40
            h-screen md:h-auto
            bg-white
             
            
            shadow-xl md:shadow-sm
            md:rounded-2xl
            overflow-hidden
            transition-all duration-300

            ${sidebarOpen
                                ? "w-64 translate-x-0"
                                : "w-0 -translate-x-full md:w-20 md:translate-x-0"
                            }
          `}
                    >

                        <div className="p-5 bg-gradient-to-b from-gray-50 to-white  flex flex-col items-center">

                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-black text-rose-600 mb-3">
                                {user?.username?.charAt(0)}
                            </div>

                            {sidebarOpen && (
                                <>
                                    <h3 className="font-bold">{user?.username}</h3>

                                    <p className="text-xs text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </>
                            )}

                        </div>

                        <div className="p-3 space-y-2">

                            <button
                                onClick={() => navigate("/myprofile")}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                            >
                                <User size={18} />

                                {sidebarOpen && (
                                    <span className="text-sm font-semibold">
                                        Account Details
                                    </span>
                                )}
                            </button>

                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 text-rose-600"
                            >
                                <Heart
                                    size={18}
                                    fill="currentColor"
                                />

                                {sidebarOpen && (
                                    <span className="text-sm font-semibold">
                                        My Favourites
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => navigate("/mybooking")}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                            >
                                <ShieldCheck size={18} />

                                {sidebarOpen && (
                                    <span className="text-sm font-semibold">
                                        Booking History
                                    </span>
                                )}
                            </button>

                            <div className=" my-2"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut size={18} />

                                {sidebarOpen && (
                                    <span className="text-sm font-semibold">
                                        Logout
                                    </span>
                                )}
                            </button>

                        </div>

                    </aside>

                    {/* MOBILE OVERLAY */}

                    {sidebarOpen && (
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/40 z-30 md:hidden"
                        />
                    )}

                    {/* MAIN CONTENT */}

                    <main className="flex-1 bg-white rounded-2xl shadow-sm  overflow-hidden">

                        <div className="px-6 py-5  bg-gray-50 flex justify-between items-center">

                            <div>

                                <h2 className="text-xl font-black">
                                    ❤️ My Favourite Events
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Manage all the events you've saved.
                                </p>

                            </div>

                            <div className="bg-rose-100 rounded-xl px-5 py-3 text-center">

                                <p className="text-2xl font-black text-rose-600">
                                    {favorites.length}
                                </p>

                                <p className="text-xs text-gray-500 uppercase">
                                    Saved
                                </p>

                            </div>

                        </div>

                        <div className="p-6">

                            {favorites.filter((item) => {
                                const event = item.event || item;

                                return event.title
                                    ?.toLowerCase()
                                    .includes(searchQuery.toLowerCase());
                            }).length === 0 ? (

                                <div className="py-24 text-center">

                                    <Heart
                                        size={70}
                                        className="mx-auto text-gray-300"
                                    />

                                    <h2 className="text-2xl font-bold mt-5">
                                        No Favourite Events
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        Save events you love and they'll appear here.
                                    </p>

                                    <button
                                        onClick={() => navigate("/home")}
                                        className="mt-6 px-6 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                                    >
                                        Browse Events
                                    </button>

                                </div>

                            ) : (

                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                    {favorites
                                        .filter((item) => {
                                            const event = item.event || item;

                                            return event.title
                                                ?.toLowerCase()
                                                .includes(searchQuery.toLowerCase());
                                        })
                                        .map((item) => {

                                            const event = item.event || item;

                                            return (

                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    whileHover={{
                                                        y: -6,
                                                        scale: 1.02,
                                                    }}
                                                    className="bg-white rounded-2xl  overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
                                                    onClick={() =>
                                                        navigate(`/booking/${event.id}`)
                                                    }
                                                >

                                                    <div className="relative">

                                                        <img
                                                            src={`${BASE_URLs}${event.image}`}
                                                            className="h-52 w-full object-cover"
                                                            alt=""
                                                        />

                                                        <motion.button
                                                            whileTap={{ scale: 0.8 }}
                                                            whileHover={{ scale: 1.1 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveFav(event.id);
                                                            }}
                                                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                                                        >

                                                            <AnimatePresence>

                                                                <motion.div>

                                                                    <Heart
                                                                        size={18}
                                                                        className="fill-rose-500 text-rose-500"
                                                                    />

                                                                </motion.div>

                                                            </AnimatePresence>

                                                        </motion.button>

                                                    </div>

                                                    <div className="p-5">

                                                        <h3 className="font-bold text-lg line-clamp-1">
                                                            {event.title}
                                                        </h3>

                                                        <p className="text-sm text-gray-500 mt-2">
                                                            {event.location}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">

                                                            <Calendar size={15} />

                                                            {new Date(
                                                                event.date
                                                            ).toDateString()}

                                                        </div>

                                                        <div className="flex justify-between items-center mt-5 pt-4 ">

                                                            <span className="font-bold text-rose-600">
                                                                ₹{event.price}
                                                            </span>

                                                            <span className="text-sm text-gray-500">
                                                                {event.capacity} Seats
                                                            </span>

                                                        </div>

                                                    </div>

                                                </motion.div>

                                            );

                                        })}

                                </div>

                            )}

                        </div>

                    </main>

                </div>

            </div>

        </div>
    );
}

export default FavEvent;