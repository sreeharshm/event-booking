import React, { useEffect, useState } from 'react';
import { curretUser, userEdit } from '../api/Allapi';
import { 
    User, Mail, ShieldCheck, Edit3, Loader2, LogOut, 
    ArrowLeft, Phone, Heart, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const navigate = useNavigate();

    // Dynamically handle sidebar state based on window resizing
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        fetchUserData();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await curretUser();
            const userData = Array.isArray(response.data) ? response.data[0] : response.data;
            setUser(userData);
        } catch (err) {
            console.error("Failed to fetch user", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!user?.id) return;

        setIsUpdating(true);
        try {
            const payload = {
                username: user.username,
                email: user.email,
                ph_number: user.ph_number
            };

            const res = await userEdit(user.id, payload);
            setUser(res.data);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update profile.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800 font-sans">
            {/* --- EVENTHUB NAVBAR --- */}
            <nav className="bg-[#1f2533] text-white sticky top-0 z-50 px-4 py-3 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-white text-2xl font-black tracking-tight">
                            event<span className="text-rose-500">hub</span>
                        </p>
                    </div>

                    {/* Profile Badge */}
                    <div className="flex items-center gap-3 bg-[#2f364a] px-4 py-1.5 rounded-full border border-gray-700">
                        <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white shadow-inner">
                            {user?.username?.charAt(0) || <User size={12} />}
                        </div>
                        <span className="text-xs font-semibold tracking-wide hidden sm:inline text-gray-200">
                            Hi, {user?.username || "Guest"}
                        </span>
                    </div>
                </div>
            </nav>

            {/* --- MAIN PAGE WRAPPER --- */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                
                {/* Control Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Toggle Sidebar"
                        >
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>
                </div>

                {/* Dashboard Flex Container */}
                <div className="flex gap-6 relative items-start">
                    
                    {/* --- RESPONSIVE SIDEBAR --- */}
                    <aside
                        className={`
                            fixed md:sticky top-0 md:top-24 left-0 z-40 h-screen md:h-auto bg-white border-r md:border border-gray-200 
                            shadow-xl md:shadow-sm md:rounded-2xl overflow-hidden transition-all duration-300 ease-in-out
                            ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"}
                        `}
                    >
                        {/* Avatar Details Header */}
                        <div className="p-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-2xl uppercase border-2 border-white shadow-sm mb-3 shrink-0">
                                {user?.username?.charAt(0)}
                            </div>
                            
                            {sidebarOpen && (
                                <div className="w-full truncate">
                                    <h3 className="font-bold text-gray-800 truncate">{user?.username}</h3>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            )}
                        </div>

                        {/* Navigation Options */}
                        <div className="p-3 space-y-1">
                            <button className="w-full flex items-center gap-3 text-xs font-bold text-rose-600 bg-rose-50/80 px-4 py-3 rounded-xl transition-all">
                                <User size={18} className="shrink-0" />
                                {sidebarOpen && <span>Account Details</span>}
                            </button>

                            <button onClick={() => navigate('/fav')} className="w-full flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-4 py-3 rounded-xl transition-all">
                                <Heart size={18} className="shrink-0" />
                                {sidebarOpen && <span>My Favourites</span>}
                            </button>

                            <button onClick={() => navigate('/mybooking')} className="w-full flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50/40 px-4 py-3 rounded-xl transition-all">
                                <ShieldCheck size={18} className="shrink-0" />
                                {sidebarOpen && <span>Booking History</span>}
                            </button>

                            {/* Divider Line */}
                            <div className="h-[1px] bg-gray-100 my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50/50 px-4 py-3 rounded-xl transition-all"
                            >
                                <LogOut size={18} className="shrink-0" />
                                {sidebarOpen && <span>Log Out</span>}
                            </button>
                        </div>
                    </aside>

                    {/* Mobile Dim Overlay overlay */}
                    {sidebarOpen && (
                        <div
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/45 z-30 md:hidden"
                        />
                    )}

                    {/* --- MAIN CONTENT CARD --- */}
                    <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                        {/* Section Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">Account Details</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Manage your personal profile details.</p>
                            </div>
                            <button
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-full sm:w-auto justify-center ${
                                    isUpdating ? 'bg-gray-100 text-gray-400' : 'bg-rose-600 text-white hover:bg-rose-700'
                                }`}
                                onClick={handleEdit}
                                disabled={isUpdating}
                            >
                                {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Edit3 size={14} />}
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        {/* Information Fields */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Username */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name / Username</label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-rose-400 focus-within:shadow-sm transition-all">
                                        <User size={16} className="text-gray-400 shrink-0" />
                                        <input
                                            type="text"
                                            value={user?.username || ""}
                                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                                            className="bg-transparent text-sm font-semibold text-gray-800 outline-none w-full"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-rose-400 focus-within:shadow-sm transition-all">
                                        <Mail size={16} className="text-gray-400 shrink-0" />
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                            className="bg-transparent text-sm font-semibold text-gray-800 outline-none w-full"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-rose-400 focus-within:shadow-sm transition-all">
                                        <Phone size={16} className="text-gray-400 shrink-0" />
                                        <input
                                            type="text"
                                            value={user?.ph_number || ""}
                                            onChange={(e) => setUser({ ...user, ph_number: e.target.value })}
                                            className="bg-transparent text-sm font-semibold text-gray-800 outline-none w-full"
                                            placeholder="Add phone number"
                                        />
                                    </div>
                                </div>

                                {/* Verification Status */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Verification Status</label>
                                    <div className="flex items-center h-[46px] px-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                                            <ShieldCheck size={16} className="text-emerald-600 shrink-0" /> 
                                            Verified Member
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- SNAPSHOT METRICS --- */}
                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Your Booking Snapshot</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <span className="text-2xl font-black text-gray-900">08</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Attended Shows</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <span className="text-2xl font-black text-rose-600">02</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Active Tickets</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}

export default MyProfile;