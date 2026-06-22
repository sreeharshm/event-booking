import React, { useEffect, useState } from "react";
import { addEvent, BASE_URLs, editEvent, getAllEvent, removeEvent } from "../api/Allapi";
import { Plus, Trash2, Edit3, Calendar, Users, X, Eye, Ticket, LogOut, Upload, Menu} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Eventadd() {
    const [eventData, setEventData] = useState({
        title: "", description: "", price: "", capacity: "", location: "", date: "", date_end: "", type: "", image: null,
    });

    const [eventDataEdit, setEventDataEdit] = useState({
        id: "", title: "", description: "", price: "", capacity: "", location: "", date: "", date_end: "", type: "", image: ""
    });

    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEvent();
    }, []);

    const fetchEvent = () => {
        getAllEvent()
            .then((res) => setEvents(res.data))
            .catch((err) => console.error(err));
    };

    const handleChange = (e) => setEventData({ ...eventData, [e.target.name]: e.target.value });
    const handleChangeEdit = (e) => setEventDataEdit({ ...eventDataEdit, [e.target.name]: e.target.value });

    const handleFileChange = (e) => setEventData({ ...eventData, image: e.target.files[0] });
    const handleFileChangeEdit = (e) => setEventDataEdit({ ...eventDataEdit, image: e.target.files[0] });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(eventData).forEach((key) => {
            if (key === 'image') {
                if (eventData.image instanceof File) {
                    formData.append('image', eventData.image);
                }
            } else if (key === 'date' || key === 'date_end') {
                if (eventData[key]) {
                    formData.append(key, eventData[key]);
                }
            } else if (eventData[key] !== "") {
                formData.append(key, eventData[key]);
            }
        });

        addEvent(formData)
            .then(() => {
                alert("Event Created Successfully!");
                setShowAddForm(false);
                fetchEvent();
                setEventData({ title: "", description: "", price: "", capacity: "", location: "", date: "", date_end: "", type: "", image: null });
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to add event.");
            });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(eventDataEdit).forEach((key) => {
                if (key === "id") return;
                if (key === "image") {
                    if (eventDataEdit.image instanceof File) {
                        formData.append("image", eventDataEdit.image);
                    }
                } else if (key === "date" || key === "date_end") {
                    if (eventDataEdit[key]) {
                        formData.append(key, eventDataEdit[key]);
                    }
                } else if (eventDataEdit[key] !== "") {
                    formData.append(key, eventDataEdit[key]);
                }
            });

            await editEvent(eventDataEdit.id, formData);
            alert("Event Updated Successfully!");
            setModal(false);
            fetchEvent();
        } catch (err) {
            console.error(err);
            alert("Failed to update event.");
        }
    };

    const handleRemove = (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            removeEvent(id).then(() => fetchEvent());
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#1f2533] text-gray-100 flex font-sans">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside className={`fixed  left-0 top-16 bottom-0 bg-[#2b3144] border-r border-gray-700/50 p-6 z-50 transition-transform duration-300 w-64 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}>
            
                <nav className="space-y-2">
                    <a href="/user" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#1f2533] hover:text-white rounded-xl font-medium transition-all">
                        <Users size={18} /> Users
                    </a>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#f84464] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#f84464]/20">
                        <Calendar size={18} /> Events List
                    </button>
                    <a href="/allbooking" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#1f2533] hover:text-white rounded-xl font-medium transition-all">
                        <Ticket size={18} /> All Bookings
                    </a>
                </nav>
            </aside>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-8 bg-[#2b3141] border-b border-gray-700/50 shadow-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-400 hover:text-white">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <p className="text-xl font-black tracking-wider text-white">
                        BOOKMY<span className="text-[#f84464]">SHOW</span> <span className="text-xs font-bold bg-[#1f2533] text-gray-400 px-2 py-0.5 rounded ml-2 border border-gray-700">ADMIN</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="flex items-center gap-2 border border-gray-600 text-gray-300 text-xs font-bold rounded-lg px-4 py-2 hover:bg-[#f84464] hover:text-white hover:border-[#f84464] transition-all">
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar Backdrop */}


            {/* Main Section */}
            <main className="flex-1 md:ml-64 pt-24 px-4 md:px-8 pb-12 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-wide">Event Hub</h1>
                            <p className="text-xs text-gray-400 mt-1">Manage, adjust and create live experiences</p>
                        </div>
                        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#f84464] hover:bg-[#f84464]/90 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#f84464]/10">
                            {showAddForm ? <X size={18} /> : <Plus size={18} />} {showAddForm ? "Close Form" : "Create Event"}
                        </button>
                    </div>

                    {/* Add Form Container */}
                    {showAddForm && (
                        <div className="bg-[#2b3141] p-6 rounded-2xl border border-gray-700/50 mb-8 shadow-xl animate-in fade-in duration-200">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input name="title" value={eventData.title} placeholder="Event Title" className="p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-[#f84464] text-white" onChange={handleChange} required />
                                <input name="location" value={eventData.location} placeholder="Location / Venue" className="p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-[#f84464] text-white" onChange={handleChange} required />
                                <input name="type" value={eventData.type} placeholder="Event Type (e.g., Concert, Comedy)" className="p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-[#f84464] text-white" onChange={handleChange} required />

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input name="date" value={eventData.date} type="date" className="w-1/2 p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-[#f84464]" onChange={handleChange} required />
                                    <input name="date_end" value={eventData.date_end} type="date" className="w-1/2 p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-[#f84464]" onChange={handleChange} />
                                </div>
                                <input name="price" value={eventData.price} type="number" placeholder="Ticket Price (₹)" className="p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-[#f84464] text-white" onChange={handleChange} required />
                                <input name="capacity" value={eventData.capacity} type="number" placeholder="Total Capacity" className="p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-[#f84464] text-white" onChange={handleChange} required />

                                <div className="flex items-center gap-2 bg-[#1f2533] rounded-xl border border-gray-700 px-4 py-2">
                                    <Upload size={16} className="text-gray-400" />
                                    <input type="file" accept="image/*" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#f84464] file:text-white cursor-pointer w-full text-gray-400" onChange={handleFileChange} required />
                                </div>

                                <textarea name="description" value={eventData.description} placeholder="Provide an explicit description about the event details..." className="md:col-span-3 p-3 bg-[#1f2533] rounded-xl border border-gray-700 h-24 text-sm focus:outline-none focus:border-[#f84464] text-white resize-none" onChange={handleChange} required />
                                <button type="submit" className="md:col-span-3 bg-[#f84464] hover:bg-[#f84464]/90 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-md">Publish Event</button>
                            </form>
                        </div>
                    )}

                    {/* Table View */}
                    <div className="bg-[#2b3141] rounded-2xl border border-gray-700/50 shadow-xl overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-[#1f2533] border-b border-gray-700 text-gray-400 text-[11px] uppercase font-bold tracking-wider">
                                    <th className="px-6 py-4">Event Info</th>
                                    <th className="px-6 py-4">Timeline Details</th>
                                    <th className="px-6 py-4">Pricing</th>
                                    <th className="px-6 py-4 text-right">Management</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-700/40">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-[#1f2533]/40 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={event.image ? `${BASE_URLs}${event.image}` : "/placeholder.png"} className="w-12 h-12 rounded-xl object-cover border border-gray-700" alt="" />
                                                <div>
                                                    <p className="text-sm font-bold text-white mb-0.5">{event.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] bg-[#1f2533] text-[#f84464] font-bold px-2 py-0.5 rounded border border-gray-700 uppercase tracking-wide">{event.type || "Live Event"}</span>
                                                        <button onClick={() => { setSelectedEvent(event); setViewModal(true); }} className="text-[10px] text-gray-400 font-bold hover:text-white flex items-center gap-1 transition-colors">
                                                            <Eye size={11} /> Overview
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-semibold text-gray-200">
                                                {new Date(event.date).toLocaleDateString()}
                                                {event.date_end && ` - ${new Date(event.date_end).toLocaleDateString()}`}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase font-medium mt-0.5 tracking-wider">{event.location}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white text-sm">₹{event.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => { setEventDataEdit({ ...event, date: event.date?.slice(0, 10), date_end: event.date_end?.slice(0, 10) || "" }); setModal(true); }} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"><Edit3 size={15} /></button>
                                                <button onClick={() => handleRemove(event.id)} className="p-2 text-gray-400 hover:text-[#f84464] hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* DESCRIPTION VIEW MODAL */}
            {viewModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[110] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#2b3141] rounded-3xl w-full max-w-lg p-6 relative shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setViewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#1f2533] rounded-full p-1.5 border border-gray-700">
                            <X size={16} />
                        </button>
                        <div className="flex items-center gap-4 mb-6 mt-2">
                            <img src={selectedEvent.image ? `${BASE_URLs}${selectedEvent.image}` : "/placeholder.png"} className="w-16 h-16 rounded-2xl object-cover border border-gray-700 shadow-md" alt="" />
                            <div>
                                <h2 className="text-lg font-bold text-white">{selectedEvent.title}</h2>
                                <p className="text-xs text-[#f84464] font-semibold uppercase tracking-wider mt-0.5">{selectedEvent.location} • {selectedEvent.type}</p>
                            </div>
                        </div>
                        <div className="bg-[#1f2533] rounded-2xl p-5 border border-gray-700/50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Event Description</p>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
                        </div>
                        <button onClick={() => setViewModal(false)} className="w-full mt-6 bg-[#f84464] text-white py-3 rounded-xl font-bold transition-all">Close Preview</button>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {modal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#2b3141] rounded-3xl w-full max-w-lg p-6 relative shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#1f2533] rounded-full p-1.5 border border-gray-700">
                            <X size={16} />
                        </button>

                        <h2 className="text-lg font-bold text-white mb-6 mt-2 tracking-wide">Edit Event Records</h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title & Dates</label>
                                <input name="title" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-white focus:outline-none focus:border-[#f84464]" value={eventDataEdit.title} onChange={handleChangeEdit} />
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-gray-400 font-medium uppercase">Start Date</span>
                                        <input name="date" type="date" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-gray-300 focus:outline-none" value={eventDataEdit.date} onChange={handleChangeEdit} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-gray-400 font-medium uppercase">End Date</span>
                                        <input name="date_end" type="date" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-gray-300 focus:outline-none" value={eventDataEdit.date_end} onChange={handleChangeEdit} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                <textarea name="description" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 h-24 resize-none text-sm text-white focus:outline-none focus:border-[#f84464]" value={eventDataEdit.description} onChange={handleChangeEdit} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (₹)</label>
                                    <input name="price" type="number" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-white focus:outline-none" value={eventDataEdit.price} onChange={handleChangeEdit} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacity</label>
                                    <input name="capacity" type="number" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-white focus:outline-none" value={eventDataEdit.capacity} onChange={handleChangeEdit} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Event Type</label>
                                <input name="type" value={eventDataEdit.type} placeholder="Event Type" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-white focus:outline-none" onChange={handleChangeEdit} required />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                                <input name="location" className="w-full p-3 bg-[#1f2533] rounded-xl border border-gray-700 text-sm text-white focus:outline-none" value={eventDataEdit.location} onChange={handleChangeEdit} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Update Asset Image</label>
                                <div className="flex items-center gap-3 bg-[#1f2533] rounded-xl border border-gray-700 p-2.5">
                                    {eventDataEdit.image && !(eventDataEdit.image instanceof File) && (
                                        <img src={`${BASE_URLs}${eventDataEdit.image}`} className="w-8 h-8 object-cover rounded-lg" alt="Current" />
                                    )}
                                    <input type="file" accept="image/*" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-gray-700 file:text-white cursor-pointer w-full text-gray-400" onChange={handleFileChangeEdit} />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#f84464] hover:bg-[#f84464]/90 text-white py-3.5 rounded-xl font-bold tracking-wide mt-4 transition-all shadow-md">
                                Save Modifications
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Eventadd;