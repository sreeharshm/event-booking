import React, { useEffect, useState } from 'react';
import { curretUser, userEdit } from '../api/Allapi';
import { User, Mail, ShieldCheck, Edit3, Loader2, LogOut, ArrowLeft, Camera, Phone, TextAlignJustify, X , Search} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sideBar, setSideBar] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); // New state for button feedback
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await curretUser();
            // Handling both array and object responses safely
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

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );


    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- NAVBAR --- */}
            <nav className="fixed bg-white/80 backdrop-blur-md top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-6 md:px-12 shadow-sm border-b border-gray-100">
                <TextAlignJustify
                    onClick={() => setSideBar(true)}
                    className='lg:hidden md:hidden '
                />
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                    <p className="text-rose-500 text-2xl font-black tracking-tighter font-mono">
                        EVENT <span className="text-gray-800">HUB</span>
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="hidden lg-block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Home</button>
                    <button onClick={() => navigate('/event')} className="hidden lg-block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">Events</button>
                    <button onClick={() => navigate('/mybooking')} className="hidden lg-block text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">My Booking</button>
                    <button className="hidden lg:block text-sm font-bold text-rose-500 underline underline-offset-8 decoration-2">My profile </button>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="flex items-center gap-2 text-white text-xs font-bold bg-gray-900 hover:bg-rose-600 px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>


            {sideBar && (
                <div
                    className='fixed inset-0 bg-black/20 z-50 backdrop-blur-sm '
                    onClick={() => setSideBar(false)}
                >
                    <div
                        className='fixed left-0 top-0 h-screen bg-white w-48 p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-500 ease-out'
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
                                <button onClick={() => { navigate('/event'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">Events</button>
                                <button onClick={() => { navigate('/mybooking'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">My Booking</button>
                                <button onClick={() => { navigate('/myprofile'); setSideBar(false); }} className="text-left text-sm font-bold text-rose-500 bg-rose-50/50 px-4 py-2.5 rounded-xl">My profile</button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="hidden md:flex flex items-center justify-center gap-2 text-white text-sm font-bold bg-rose-500 hover:bg-rose-600 w-full py-3 rounded-xl transition-all shadow-md mt-auto"
                        >
                            <LogOut size={16} /> Logout
                        </button>

                    </div>
                </div>
            )}


            <div className="pt-28 pb-12 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-6 hover:text-rose-500 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        {/* Profile Header / Banner */}
                        <div className="h-32 bg-gradient-to-r from-rose-500 to-rose-400 relative">
                            <div className="absolute -bottom-12 left-10">
                                <div className="relative group">
                                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                                        <span className="text-3xl font-black text-rose-500 uppercase">
                                            {user?.username?.charAt(0) || <User />}
                                        </span>
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-colors">
                                        <Camera size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-16 p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-full mr-4">
                                    <input
                                        type='text'
                                        value={user?.username || ""}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        className='text-3xl font-black text-gray-900 tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-rose-300 w-full transition-all'
                                        placeholder="Username"
                                    />
                                    <p className="text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full inline-block mt-2">
                                        Verified Member
                                    </p>
                                </div>
                                <button
                                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isUpdating ? 'bg-gray-100 text-gray-400' : 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border-2 border-rose-100'
                                        }`}
                                    onClick={handleEdit}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <Edit3 size={16} />}
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email Info */}
                                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-50 group focus-within:border-rose-200 transition-all">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Mail className="text-rose-500" size={18} />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                                    </div>
                                    <input
                                        type='email'
                                        value={user?.email || ""}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        className='text-gray-800 font-bold ml-7 bg-transparent outline-none w-full border-b border-transparent focus:border-rose-200'
                                        placeholder="your@email.com"
                                    />
                                </div>

                                {/* Phone Info */}
                                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-50 group focus-within:border-rose-200 transition-all">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Phone className="text-rose-500" size={18} />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone number</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={user?.ph_number || ""}
                                        onChange={(e) => setUser({ ...user, ph_number: e.target.value })}
                                        className='text-gray-800 font-bold ml-7 bg-transparent outline-none w-full border-b border-transparent focus:border-rose-200'
                                        placeholder="Add phone number"
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-10 pt-8 border-t border-gray-100 flex gap-10">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">08</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Attended Events</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">02</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Active Bookings</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-gray-400 text-sm font-medium">
                        Need help? Contact <span className="text-rose-500 cursor-pointer hover:underline">Support Hub</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;