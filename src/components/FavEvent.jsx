import React, { useEffect, useState, useRef } from "react";
import {
    getFavEvent,
    removeFavEvent,
    curretUser,
    BASE_URLs,
} from "../api/Allapi";
import { Heart, Calendar, MapPin, Search, ArrowRight, X } from "lucide-react";
import Navbar from "../componets/Navbar";
import Footer from "../componets/Footer";
import { useNavigate } from "react-router-dom";

// Helper function to build absolute image URLs safely
const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x200?text=No+Image";
    if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
        return image;
    }
    const cleanBase = BASE_URLs?.endsWith("/") ? BASE_URLs.slice(0, -1) : BASE_URLs;
    const cleanPath = image.startsWith("/") ? image : `/${image}`;
    return `${cleanBase || ""}${cleanPath}`;
};

function FavEvent() {
    const [favs, setFavs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const searchRef = useRef(null);
    const navigate = useNavigate();

    // 1. Fetch Current User ID
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await curretUser(token);
                if (res.data && res.data.id) {
                    setUserId(res.data.id);
                }
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };

        fetchUserData();
    }, []);

    // 2. Fetch Favorite Events once userId is available
    useEffect(() => {
        if (!userId) return;

        const fetchFavs = async () => {
            try {
                const response = await getFavEvent(userId);
                setFavs(response.data);
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavs();
    }, [userId]);

    // 3. Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handler to remove an event from favorites
    const handleRemoveFav = async (e, eventId) => {
        e.stopPropagation(); // Stop card click navigation
        try {
            await removeFavEvent(userId, eventId);
            setFavs((prev) => prev.filter((item) => item.event.id !== eventId));
        } catch (error) {
            console.error("Failed to remove favorite", error);
        }
    };

    // Filter events based on search query
    const searchFilteredFavs = favs.filter((item) =>
        item.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
                {/* Header & Search Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            <Heart className="text-rose-500 fill-rose-500" />
                            Saved Events
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Your personalized collection of bookmarked events.
                        </p>
                    </div>

                    {/* Interactive Search Field */}
                    <div className="relative w-full md:w-80" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search saved events..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Quick Dropdown */}
                        {isSearchOpen && searchQuery.trim() !== "" && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                                {searchFilteredFavs.length > 0 ? (
                                    searchFilteredFavs.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                navigate(`/events/${item.event.id}`);
                                                setIsSearchOpen(false);
                                            }}
                                            className="p-3 hover:bg-slate-700/60 cursor-pointer flex items-center gap-3 border-b border-slate-700/40 last:border-0 transition"
                                        >
                                            <img
                                                src={getImageUrl(item.event.image)}
                                                alt={item.event.title}
                                                className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="overflow-hidden">
                                                <h4 className="text-sm font-semibold text-white truncate">
                                                    {item.event.title}
                                                </h4>
                                                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {item.event.location}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-400 text-sm">
                                        No saved events match "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Grid View */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                    </div>
                ) : searchFilteredFavs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/40 border border-slate-800 rounded-2xl">
                        <Heart className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-300">
                            {searchQuery ? "No matching saved events" : "No favorites added yet"}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            {searchQuery
                                ? "Try tweaking your search term."
                                : "Explore upcoming events and save your favorites to view them here."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchFilteredFavs.map((item) => {
                            const { event } = item;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    className="group bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-2xl overflow-hidden shadow-lg transition duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-48 overflow-hidden bg-slate-900">
                                        <img
                                            src={getImageUrl(event.image)}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                        {/* Favorite Toggle Button */}
                                        <button
                                            onClick={(e) => handleRemoveFav(e, event.id)}
                                            className="absolute top-3 right-3 p-2.5 bg-slate-900/70 backdrop-blur-md rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition duration-200"
                                            title="Remove from favorites"
                                        >
                                            <Heart className="h-5 w-5 fill-current" />
                                        </button>
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-5 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition line-clamp-1">
                                                {event.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                                {event.description}
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-slate-700/50 space-y-2 text-xs text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-rose-400" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-rose-400" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-5 flex items-center justify-between text-sm text-indigo-400 font-semibold group-hover:text-indigo-300">
                                            <span>View Details</span>
                                            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default FavEvent;