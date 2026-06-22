import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventBookingList, eventBooking, BASE_URLs } from '../api/Allapi';
import { MapPin, Calendar, Ticket, ArrowLeft, Loader2, X, CreditCard, ShieldCheck, CheckCircle2, Minus, Plus } from 'lucide-react';

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState('summary');
    const [quantity, setQuantity] = useState(1);

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

    const imageUrl = event?.image
        ? (event.image.startsWith('http')
            ? event.image
            : `${BASE_URLs}${event.image}`)
        : "https://via.placeholder.com/400x300";


    if (loading) return (
        <div className="h-screen flex justify-center items-center bg-[#1A1C22]">
            <Loader2 className="animate-spin text-[#F84464]" size={40} />
        </div>
    );

    if (!event) return <div className="text-center py-20 font-bold">Event not found.</div>;

    return (
        <div className={`min-h-screen bg-[#F2F2F2] ${showModal ? 'overflow-hidden' : ''}`}>
            {/* 1. HERO BANNER */}
            <div className="relative w-full h-[380px] bg-[#1A1C22] flex items-center">
                {/* FIXED: Using clean imageUrl here instead of malforming absolute URLs */}
                <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm" style={{ backgroundImage: `url(${imageUrl})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C22] to-transparent" />
                <div className="relative max-w-6xl mx-auto w-full px-6 flex flex-col md:flex-row gap-8 items-end pb-12">
                    <div className="hidden md:block w-64 h-[380px] rounded-lg overflow-hidden shadow-2xl translate-y-20 border border-gray-700">
                        <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-white pb-4">
                        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} /> Back
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{event.title}</h1>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{event.description}</p>
                    </div>
                </div>

                {/* 3. BOOKING BOX */}
                <div className="lg:col-span-5">
                    <div className="sticky top-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gray-50 border-b border-gray-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar size={20} className="text-[#F84464]" />
                                <span className="font-bold text-gray-800">{new Date(event.date).toDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-[#F84464]" />
                                <span className="font-bold text-gray-800">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Ticket size={20} className="text-[#F84464]" />
                                <span className={`font-bold ${event.capacity < 10 ? 'text-orange-600' : 'text-gray-800'}`}>
                                    {event.capacity > 0 ? `${event.capacity} Tickets Available` : "Sold Out"}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-gray-700">Select Quantity</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => updateQuantity('dec')} className="p-1.5 bg-white rounded-lg border hover:bg-gray-100 transition-colors">
                                        <Minus size={18} />
                                    </button>
                                    <span className="text-xl font-black w-6 text-center">{quantity}</span>
                                    <button onClick={() => updateQuantity('inc')} className="p-1.5 bg-white rounded-lg border hover:bg-gray-100 transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-gray-400">Total Amount</p>
                                    <h3 className="text-3xl font-black text-gray-900">₹{(event.price * quantity).toLocaleString('en-IN')}</h3>
                                </div>
                            </div>

                            <button
                                onClick={initiateBooking}
                                disabled={event.capacity <= 0}
                                className="w-full bg-[#F84464] hover:bg-[#D6304D] text-white py-4 rounded-xl font-bold text-xl transition-all flex justify-center items-center gap-3 active:scale-95 disabled:bg-gray-300"
                            >
                                {event.capacity <= 0 ? 'Sold Out' : `Book ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL OVERLAY --- */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative shadow-2xl">

                        {paymentStep !== 'processing' && (
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                <X size={20} />
                            </button>
                        )}

                        {paymentStep === 'summary' && (
                            <div className="p-8">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                                    <CreditCard className="text-[#F84464]" /> Order Summary
                                </h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{event.title} (x{quantity})</span>
                                        <span className="font-bold text-gray-900">₹{event.price * quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 border-b pb-4">
                                        <span>Convenience Fee</span>
                                        <span className="font-bold text-gray-900">₹0</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                                        <span>Grand Total</span>
                                        <span>₹{event.price * quantity}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={processPayment}
                                    className="w-full bg-[#F84464] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#D6304D] transition-colors"
                                >
                                    Proceed to Pay ₹{event.price * quantity}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase">
                                    <ShieldCheck size={14} /> 100% Secure Payment
                                </div>
                            </div>
                        )}

                        {paymentStep === 'processing' && (
                            <div className="p-12 text-center space-y-6">
                                <div className="relative w-20 h-20 mx-auto">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-[#F84464] rounded-full animate-spin"></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Processing Payment...</h3>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div className="p-12 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Payment Successful!</h3>
                                <p className="text-gray-500">Redirecting to home...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Booking;