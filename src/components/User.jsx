import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Calendar, Ticket, LogOut, Menu, X, ShieldAlert, ShieldCheck, TextAlignJustify } from 'lucide-react';
import { getAllUser, BASE_URLs } from '../api/Allapi';
import { useNavigate, Link } from 'react-router-dom';

function User() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUser();
            setUsers(res.data);
        } catch (err) {
            console.error("error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Implement logout logic here (e.g., removing tokens)
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#1f2533] flex text-gray-100 font-sans">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - BookMyShow Premium Style */}
            <aside className={`fixed top-16 left-0 h-full bg-[#2b3144] border-r border-gray-700/50 p-6 z-50 transition-transform duration-300 w-64 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}>
                <nav className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#df183a] text-white rounded-xl font-bold shadow-md shadow-[#df183a]/20 transition-all">
                        <Users size={20} /> Users
                    </button>
                    <a href="/eventadd" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#333a50] hover:text-white rounded-xl font-bold transition-all">
                        <Calendar size={20} /> Events List
                    </a>
                    <a href="/allbooking" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#333a50] hover:text-white rounded-xl font-bold transition-all">
                        <Ticket size={20} /> All Bookings
                    </a>
                </nav>
            </aside>

            {/* Navbar - Signature BookMyShow Branding */}
            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-[#2b3144] border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-400 hover:text-white">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <p className="text-xl font-black tracking-tight text-white uppercase">
                        BOOKMY<span className="text-[#df183a]">SHOW</span> <span className="text-xs font-medium text-gray-400 tracking-normal normal-case border-l border-gray-600 pl-2 ml-1">Admin</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-xs font-bold bg-[#333a50] text-[#df183a] px-3 py-1 rounded-full uppercase tracking-wider border border-[#df183a]/20">
                        Super Admin
                    </span>
                </div>
            </nav>


            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-24 px-4 md:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-black text-white tracking-tight">User Management</h1>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-[#2b3144] px-4 py-2 rounded-xl border border-gray-700/50">
                            Total Users: <span className="text-[#df183a] font-black">{users.length}</span>
                        </div>
                    </div>

                    {/* Table Container - Dark Glassmorphism Theme */}
                    <div className="bg-[#2b3144] rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#232838] border-b border-gray-700/50 text-gray-400 text-[11px] uppercase font-black tracking-wider">
                                        <th className="px-6 py-4">User Info</th>
                                        <th className="px-6 py-4">Email Address</th>
                                        <th className="px-6 py-4">Access Level</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/40">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-20">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-3 border-[#df183a] border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fetching Users Portal...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#333a50]/50 group transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#df183a]/10 text-[#df183a] flex items-center justify-center font-black text-sm border border-[#df183a]/20">
                                                        {user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-white">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.is_staff ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                    {user.is_staff ? "Admin" : "Customer"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_active ? (
                                                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                                                        <ShieldCheck size={14} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-rose-500 font-bold text-xs">
                                                        <ShieldAlert size={14} /> Blocked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-[#df183a] uppercase tracking-widest hover:underline bg-[#df183a]/10 px-3 py-1.5 rounded-lg border border-[#df183a]/20">
                                                    Manage Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {!loading && users.length === 0 && (
                            <div className="text-center py-20 bg-[#2b3144]">
                                <Users className="mx-auto text-gray-600 mb-4" size={48} />
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No registered users found</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default User;