import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Calendar, Ticket, LogOut, Menu, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getAllUser, BASE_URLs } from '../api/Allapi';

function User() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        try{
            setLoading(true)

            const res = await getAllUser()
            setUsers(res.data)
        }
        catch (err){
            console.error("error fetching users", err);      
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Matching Eventadd style */}
            <aside className={`fixed top-16 left-0 h-full bg-white border-r border-gray-200 p-6 z-40 transition-transform duration-300 w-64 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}>
                <nav className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold transition-all">
                        <Users size={20} /> Users
                    </button>
                    <a href="/eventadd" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl font-bold transition-all">
                        <Calendar size={20} /> Events List
                    </a>
                    <a href="/allbooking" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl font-bold transition-all">
                        <Ticket size={20} /> All Bookings
                    </a>
                </nav>
            </aside>

            {/* Navbar - Matching Eventadd style */}
            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-500">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <p className="text-xl font-black tracking-tight text-gray-800">
                        EVENT<span className="text-rose-500">ADMIN</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">
                        Super Admin
                    </span>
                    <button className="flex items-center gap-2 border border-rose-500 text-rose-500 text-xs font-bold rounded-lg px-4 py-2 hover:bg-rose-50 transition-all">
                        <a href="/login" className="flex items-center gap-2">
                            <LogOut size={14} /> Logout
                        </a>
                    </button>
                </div>
            </nav>

            {/* Main Content - Matching Eventadd layout */}
            <main className="flex-1 md:ml-64 pt-24 px-4 md:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-black text-gray-900">User Management</h1>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Total Users: {users.length}
                        </div>
                    </div>


                    {/* Table Container - Matching Eventadd Table Style */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[11px] uppercase font-black">
                                    <th className="px-6 py-4">User Info</th>
                                    <th className="px-6 py-4">Email Address</th>
                                    <th className="px-6 py-4">Access Level</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs font-bold text-gray-400 uppercase">Fetching Users...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 group transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-sm border border-rose-100">
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${user.is_staff ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {user.is_staff ? "Admin" : "Customer"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_active ? (
                                                <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                                    <ShieldCheck size={14} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                                                    <ShieldAlert size={14} /> Blocked
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                                                Manage Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!loading && users.length === 0 && (
                            <div className="text-center py-20 bg-white">
                                <Users className="mx-auto text-gray-200 mb-4" size={48} />
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