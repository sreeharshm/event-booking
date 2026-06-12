import React, { useEffect, useState } from "react";
import { addEvent, BASE_URLs, editEvent, getAllEvent, removeEvent } from "../api/Allapi";
import { Plus, Trash2, Edit3, MapPin, Calendar, Users, X, Eye, ExternalLink, Ticket, LogOut, Upload, TextAlignJustify } from "lucide-react";
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

    const [sideBar, setSideBar] = useState(false);

    const navigate = useNavigate()


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

        // Loop through your form state (assuming it's called eventData)
        Object.keys(eventData).forEach((key) => {
            if (key === 'image') {
                if (eventData.image instanceof File) {
                    formData.append('image', eventData.image);
                }
            } else if (key === 'date' || key === 'date_end') {
                // Keep the raw YYYY-MM-DD string from the input field
                if (eventData[key]) {
                    formData.append(key, eventData[key]);
                }
            } else if (eventData[key] !== "") {
                formData.append(key, eventData[key]);
            }
        });

        // Replace 'addEvent' with whatever your creation API function is called
        addEvent(formData)
            .then((res) => {
                alert("Event Created Successfully!");
                // Reset form or navigate away here
            })
            .catch((err) => {
                // Safer logging so you don't get 'undefined'
                if (err.response) {
                    console.error("Server Error Data:", err.response.data);
                    console.error("Server Status:", err.response.status);
                } else if (err.request) {
                    console.error("No response received from server:", err.request);
                } else {
                    console.error("Error setting up request:", err.message);
                }
                alert("Failed to add event. Check console for details.");
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

            // FIXED
            setModal(false);

            // FIXED
            fetchEvent();

        } catch (err) {
            console.error("Full Error:", err);

            if (err.response) {
                console.error("Server Error:", err.response.data);
                console.error("Status:", err.response.status);
            } else if (err.request) {
                console.error("No response received:", err.request);
            } else {
                console.error("Error message:", err.message);
            }

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
        <div className="min-h-screen bg-[#f8f9fa] flex">
            {/* Sidebar */}
            <aside className="fixed top-16 left-0 h-full w-64 bg-white border-r border-gray-200 p-6 z-40 hidden md:block">
                <nav className="space-y-2">
                    <a href="/user" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl font-bold transition-all">
                        <Users size={20} /> Users
                    </a>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold transition-all">
                        <Calendar size={20} /> Events List
                    </button>
                    <a href="/allbooking" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-xl font-bold transition-all">
                        <Ticket size={20} /> All Bookings
                    </a>
                </nav>
            </aside>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200">
                <TextAlignJustify
                    size={18}
                    className="md:hidden cursor-pointer"
                    onClick={() => setSideBar(true)}
                />
                <p className="text-xl font-black tracking-tight text-gray-800">
                    EVENT<span className="text-rose-500">ADMIN</span>
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">
                        Super Admin
                    </span>
                    <button className="flex items-center gap-2 border border-rose-500 text-rose-500 text-xs font-bold rounded-lg px-4 py-2 hover:bg-rose-50 transition-all">
                        <a href="/login" className="flex items-center gap-2">
                            <LogOut size={14} /> Logout
                        </a>
                    </button>
                </div>
            </nav>

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
                                    EVENT <span className="text-gray-800">ADMIN</span>
                                </p>
                                <X
                                    size={20}
                                    className="text-gray-400 cursor-pointer hover:text-rose-500"
                                    onClick={() => setSideBar(false)}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* FIXED: Fixed route path string syntax typo from 'homet' to '/home' */}
                                
                                <button onClick={() => { navigate('/user'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">Users</button>
                                <button className="text-left text-sm font-bold text-rose-500 bg-rose-50/50 px-4 py-2.5 rounded-xl">Event add</button>
                                <button onClick={() => { navigate('/allbooking'); setSideBar(false); }} className="text-left text-sm font-bold text-gray-600 hover:text-rose-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all">All Booking</button>
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

            <main className="flex-1 md:ml-64 pt-24 px-4 md:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-black text-gray-900">Event Hub</h1>
                        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                            {showAddForm ? <X size={20} /> : <Plus size={20} />} {showAddForm ? "Close" : "New Event"}
                        </button>
                    </div>

                    {/* Add Form */}
                    {showAddForm && (
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-8 shadow-sm">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input name="title" value={eventData.title} placeholder="Event Title" className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} required />
                                <input name="location" value={eventData.location} placeholder="Location" className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} required />

                                {/* Added type input field for creation form */}
                                <input name="type" value={eventData.type} placeholder="Event Type (e.g., Concert, Seminar)" className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} required />

                                <div className="flex gap-2">
                                    <input name="date" value={eventData.date} type="date" className="w-1/2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} required />
                                    <input name="date_end" value={eventData.date_end} type="date" className="w-1/2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} />
                                </div>
                                <input name="price" value={eventData.price} type="number" placeholder="Price (₹)" className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} required />
                                <input name="capacity" value={eventData.capacity} type="number" placeholder="Capacity" className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" onChange={handleChange} required />

                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-1.5">
                                    <Upload size={16} className="text-gray-400" />
                                    <input type="file" accept="image/*" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 cursor-pointer w-full text-gray-500" onChange={handleFileChange} required />
                                </div>

                                <textarea name="description" value={eventData.description} placeholder="Description" className="md:col-span-3 p-2.5 bg-gray-50 rounded-lg border border-gray-200 h-20 text-sm" onChange={handleChange} required />
                                <button type="submit" className="md:col-span-3 bg-gray-900 text-white py-3 rounded-xl font-bold">Create Event</button>
                            </form>
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[11px] uppercase font-black">
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Timeline</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={event.image ? `${BASE_URLs}${event.image}` : "/placeholder.png"} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{event.title}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded uppercase">{event.type || "Event"}</span>
                                                        <button
                                                            onClick={() => { setSelectedEvent(event); setViewModal(true); }}
                                                            className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-1"
                                                        >
                                                            <Eye size={10} /> View Description
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-gray-600">
                                                {new Date(event.date).toLocaleDateString()}
                                                {event.date_end && ` - ${new Date(event.date_end).toLocaleDateString()}`}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">{event.location}</p>
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-700 text-sm">₹{event.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 transition-all">
                                                <button onClick={() => { setEventDataEdit({ ...event, date: event.date?.slice(0, 10), date_end: event.date_end?.slice(0, 10) || "" }); setModal(true); }} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit3 size={16} /></button>
                                                <button onClick={() => handleRemove(event.id)} className="p-2 text-red-500  hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[110] p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setViewModal(false)} className="sticky top-0 float-right text-gray-400 hover:text-black z-10 bg-white rounded-full p-1">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4 mb-6 mt-2">
                            <img src={selectedEvent.image ? `${BASE_URLs}${selectedEvent.image}` : "/placeholder.png"} className="w-16 h-16 rounded-2xl object-cover border-4 border-rose-50" alt="" />
                            <div>
                                <h2 className="text-xl font-black text-gray-900">{selectedEvent.title}</h2>
                                <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">{selectedEvent.location} • {selectedEvent.type}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Event Description</p>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
                        </div>
                        <button onClick={() => setViewModal(false)} className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold">Close Preview</button>
                    </div>
                </div>
            )}


            {/* EDIT MODAL */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setModal(false)} className="sticky top-0 float-right text-gray-300 hover:text-black z-10 bg-white rounded-full p-1">
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-black text-gray-900 mb-6 mt-2">Edit Event</h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Title & Dates</label>
                                <input name="title" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-rose-500 text-sm" value={eventDataEdit.title} onChange={handleChangeEdit} />
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase">Start Date</span>
                                        <input name="date" type="date" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" value={eventDataEdit.date} onChange={handleChangeEdit} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase">End Date</span>
                                        <input name="date_end" type="date" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" value={eventDataEdit.date_end} onChange={handleChangeEdit} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                                <textarea name="description" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 h-24 resize-none outline-rose-500 text-sm" value={eventDataEdit.description} onChange={handleChangeEdit} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₹)</label>
                                    <input name="price" type="number" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" value={eventDataEdit.price} onChange={handleChangeEdit} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Capacity</label>
                                    <input name="capacity" type="number" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" value={eventDataEdit.capacity} onChange={handleChangeEdit} />
                                </div>
                            </div>

                            {/* Corrected type field bindings for edit modal */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Event Type</label>
                                <input
                                    name="type"
                                    value={eventDataEdit.type}
                                    placeholder="Event Type"
                                    className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                                    onChange={handleChangeEdit}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Location</label>
                                <input name="location" className="w-full p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm" value={eventDataEdit.location} onChange={handleChangeEdit} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Change Event Image (Optional)</label>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 p-2.5">
                                    {eventDataEdit.image && !(eventDataEdit.image instanceof File) && (
                                        <img src={`${BASE_URLs}${eventDataEdit.image}`} className="w-8 h-8 object-cover rounded" alt="Current" />
                                    )}
                                    <input type="file" accept="image/*" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 cursor-pointer w-full text-gray-500" onChange={handleFileChangeEdit} />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold mt-4 hover:bg-black transition-all">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Eventadd;