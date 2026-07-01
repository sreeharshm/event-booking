import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventBookingList, eventBooking, BASE_URLs } from '../api/Allapi';
import { MapPin, Calendar, Ticket, ArrowLeft, Loader2, X, CreditCard, ShieldCheck, CheckCircle2, Minus, Plus, Search, Menu, TextAlignJustify, User, Heart, BookOpen, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState('summary');
    const [quantity, setQuantity] = useState(1);

    // --- Navigation & Menu States matching Events page ---
    const [sidebar, setSideBar] = useState(false);
    const [sideModal, setSideModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (id) {
            eventBookingList(id)
                .then(res => {
                    setEvent(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    const updateQuantity = (type) => {
        if (type === 'inc' && quantity < (event?.capacity || 0)) {
            setQuantity(prev => prev + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const initiateBooking = () => {
        const token = localStorage.getItem("access");
        if (!token) {
            alert("Please login to continue");
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const processPayment = () => {
        setPaymentStep('processing');

        setTimeout(() => {
            eventBooking({ event_id: Number(id), quantity: quantity })
                .then(() => {
                    setPaymentStep('success');
                    setTimeout(() => navigate('/home'), 3000);
                })
                .catch((err) => {
                    alert("Payment failed. Please try again.");
                    setPaymentStep('summary');
                });
        }, 2000);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const imageUrl = event?.image
        ? (event.image.startsWith('http')
            ? event.image
            : `${BASE_URLs}${event.image}`)
        : "https://via.placeholder.com/400x300";

    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-[#f5f5fa]">
            <div className="w-10 h-10 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!event) return <div className="text-center py-20 font-bold text-[#222222]">Event not found.</div>;

    return (
        <div className={`min-h-screen bg-[#f5f5fa] pb-20 text-[#222222] ${showModal ? 'overflow-hidden' : ''}`}>
            {/* --- NAVBAR START --- */}
            <nav className="fixed bg-[#333545] top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-12 shadow-md">
                <div className="flex items-center gap-4">
                    <TextAlignJustify
                        onClick={() => setSideBar(true)}
                        className='md:hidden cursor-pointer text-white'
                    />
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                        <p className="text-white text-xl md:text-2xl font-black tracking-tight font-sans">
                            book<span className="text-[#f84464]">my</span>show
                        </p>
                    </div>
                </div>

                {/* Left Drawer SideBar (Mobile) */}
                {sidebar && (
                    <div
                        className='fixed inset-0 bg-black/50 z-50 backdrop-blur-sm'
                        onClick={() => setSideBar(false)}
                    >
                        <div
                            className='fixed left-0 top-0 h-screen bg-[#333545] w-56 p-6 shadow-2xl flex flex-col justify-between'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                                    <p className="text-white text-xl font-black tracking-tight">
                                        book<span className="text-[#f84464]">my</span>show
                                    </p>
                                    <X
                                        size={20}
                                        className="text-gray-400 cursor-pointer hover:text-[#f84464]"
                                        onClick={() => setSideBar(false)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => { navigate('/home'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">Home</button>
                                    <button onClick={() => { navigate('/event'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">Events</button>
                                    <button onClick={() => { navigate('/mybooking'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">My Booking</button>
                                    <button onClick={() => { navigate('/myprofile'); setSideBar(false); }} className="text-left text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all">My Profile</button>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 text-white text-sm font-bold bg-[#f84464] hover:bg-[#f84464]/90 w-full py-3 rounded-lg transition-all shadow-md mt-auto"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                )}

                {/* Right Profile Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => navigate('/home')} className="text-xs font-medium text-gray-300 hover:text-white transition-colors">Home</button>
                    <button onClick={() => navigate('/event')} className="text-xs font-medium text-gray-300 hover:text-white transition-colors">Events</button>
                    <button className="text-xs font-medium text-gray-300 hover:text-white transition-colors">About</button>
                    <Menu
                        size={20}
                        className='cursor-pointer text-gray-300 hover:text-white transition-colors'
                        onClick={() => setSideModal(true)}
                    />
                </div>
            </nav>

            {/* Account Utility Modal Drawer */}
            {sideModal && (
                <div
                    className='inset-0 fixed bg-black/40 z-50 backdrop-blur-xs'
                    onClick={() => setSideModal(false)}
                >
                    <div
                        className='fixed bg-white w-64 h-full shadow-2xl top-0 right-0 p-6 flex flex-col justify-between text-[#222222]'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center justify-between pb-4 border-b border-gray-100'>
                                <h3 className='font-bold text-lg text-gray-800'>Account</h3>
                                <X
                                    size={20}
                                    className='text-gray-400 cursor-pointer hover:text-[#f84464] transition-colors'
                                    onClick={() => setSideModal(false)}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <button onClick={() => { navigate('/myprofile'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-[#f84464] hover:bg-gray-50 rounded-lg transition-all text-left'>
                                    <User size={16} /> Profile
                                </button>
                                <button onClick={() => { navigate('/fav'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-[#f84464] hover:bg-gray-50 rounded-lg transition-all text-left'>
                                    <Heart size={16} /> Favorite Events
                                </button>
                                <button onClick={() => { navigate('/mybooking'); setSideModal(false); }} className='flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-[#f84464] hover:bg-gray-50 rounded-lg transition-all text-left'>
                                    <BookOpen size={16} /> My Booking
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='flex items-center justify-center gap-2 text-white text-sm font-bold bg-[#f84464] hover:bg-[#f84464]/90 w-full py-3 rounded-lg transition-all shadow-md'
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
            {/* --- NAVBAR END --- */}

            {/* 1. HERO BANNER */}
            <div className="relative w-full h-[380px] bg-[#1a1c22] flex items-center pt-16">
                <div className="absolute inset-0 bg-cover bg-center opacity-15 blur-md" style={{ backgroundImage: `url(${imageUrl})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c22] via-[#1a1c22]/80 to-transparent" />
                <div className="relative max-w-7xl mx-auto w-full px-4 md:px-12 flex flex-col md:flex-row gap-8 items-end pb-10 z-10">
                    <div className="hidden md:block w-56 h-[280px] rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 flex-shrink-0">
                        <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-white space-y-4 w-full">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={16} /> Back to explore
                        </button>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight max-w-3xl">{event.title}</h1>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-4 md:px-12 pt-10 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/60 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About the Event</h2>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">{event.description}</p>
                    </div>
                </div>

                {/* 3. STICKY BOOKING BOX */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
                        <div className="p-6 bg-gray-50/70 border-b border-gray-100 space-y-3.5 text-xs md:text-sm">
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-[#f84464]" />
                                <span className="font-bold text-gray-700">{new Date(event.date).toDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-[#f84464]" />
                                <span className="font-bold text-gray-700">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Ticket size={18} className="text-[#f84464]" />
                                <span className={`font-bold ${event.capacity <= 5 ? 'text-orange-500' : 'text-gray-700'}`}>
                                    {event.capacity > 0 ? `${event.capacity} Tickets Left` : "Sold Out"}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
                                <span className="text-sm font-bold text-gray-600">Tickets Quantity</span>
                                <div className="flex items-center gap-3.5">
                                    <button onClick={() => updateQuantity('dec')} className="p-1 bg-white rounded-md border border-gray-200 shadow-xs hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                        <Minus size={16} className="text-gray-600" />
                                    </button>
                                    <span className="text-lg font-black w-6 text-center text-gray-800">{quantity}</span>
                                    <button onClick={() => updateQuantity('inc')} className="p-1 bg-white rounded-md border border-gray-200 shadow-xs hover:bg-gray-50 active:bg-gray-100 transition-colors">
                                        <Plus size={16} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                                <div>
                                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">Total Amount</p>
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900">₹{(event.price * quantity).toLocaleString('en-IN')}</h3>
                                </div>
                            </div>

                            <button
                                onClick={initiateBooking}
                                disabled={event.capacity <= 0}
                                className="w-full bg-[#f84464] hover:bg-[#f84464]/90 text-white py-3.5 rounded-xl font-bold text-base transition-all flex justify-center items-center gap-2 active:scale-[0.98] shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {event.capacity <= 0 ? 'Sold Out' : `Book ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL OVERLAY --- */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden relative shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">

                        {paymentStep !== 'processing' && (
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                <X size={18} />
                            </button>
                        )}

                        {paymentStep === 'summary' && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-800">
                                    <CreditCard className="text-[#f84464]" size={20} /> Order Summary
                                </h2>
                                <div className="space-y-3.5 mb-6 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span className="max-w-[240px] truncate">{event.title} (x{quantity})</span>
                                        <span className="font-bold text-gray-800">₹{(event.price * quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 border-b border-gray-100 pb-3.5">
                                        <span>Convenience Fee</span>
                                        <span className="font-bold text-gray-800">₹0</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
                                        <span>Grand Total</span>
                                        <span>₹{(event.price * quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={processPayment}
                                    className="w-full bg-[#f84464] hover:bg-[#f84464]/90 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-sm"
                                >
                                    Proceed to Pay ₹{(event.price * quantity).toLocaleString('en-IN')}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                    <ShieldCheck size={14} className="text-emerald-500" /> 100% Secure Payment
                                </div>
                            </div>
                        )}

                        {paymentStep === 'processing' && (
                            <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[280px]">
                                <Loader2 className="animate-spin text-[#f84464]" size={36} />
                                <h3 className="text-lg font-bold text-gray-800">Processing Your Order</h3>
                                <p className="text-xs text-gray-400 max-w-[240px]">Please sit tight while we process your secure transaction wrapper.</p>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[280px]">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
                                    <CheckCircle2 size={28} />
                                </div>
                                <h3 className="text-lg font-black text-gray-800">Booking Confirmed!</h3>
                                <p className="text-xs text-gray-500">Your tickets are secured. Redirecting you home...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Booking;