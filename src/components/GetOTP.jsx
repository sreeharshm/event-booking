import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { verifyOTP,sendOTP } from '../api/Allapi';

function GetOTP() {
    const [email, setEmail] = useState("");
    const [otp, setOTP] = useState("");
    const [isStepTwo, setIsStepTwo] = useState(false); // Replaces modal for a cleaner flow
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleGetOtp = () => {
        if (!email) return alert("Please enter your email");

        setIsLoading(true);
        sendOTP({ email })
            .then(() => {
                setIsStepTwo(true);
            })
            .catch(err => {
                alert(err.response?.data?.error || "Failed to send OTP");
            })
            .finally(() => setIsLoading(false));
    };

    const handleVerifyOTP = () => {
        if (!otp) return alert("OTP is required");

        setIsLoading(true);
        verifyOTP({ email, otp })
            .then(() => {
                navigate("/reset", { state: { email } });
            })
            .catch(err => {
                alert(err.response?.data?.error || "Invalid OTP");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">

                {/* Visual Header */}
                <div className="bg-indigo-600 p-8 text-center text-white relative">
                    {isStepTwo && (
                        <button
                            onClick={() => setIsStepTwo(false)}
                            className="absolute left-6 top-8 p-1 hover:bg-white/20 rounded-lg transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        {isStepTwo ? <ShieldCheck size={32} /> : <KeyRound size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold">
                        {isStepTwo ? "Verify Identity" : "Forgot Password"}
                    </h2>
                    <p className="text-indigo-100 text-sm mt-2 px-4">
                        {isStepTwo
                            ? `We've sent a code to ${email}`
                            : "Enter your email to receive a password reset code"}
                    </p>
                </div>

                <div className="p-8">
                    {!isStepTwo ? (
                        /* STEP 1: EMAIL ENTRY */
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Registered Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-slate-400"><Mail size={18} /></span>
                                    <input
                                        type="email"
                                        placeholder="name@university.edu"
                                        className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 pl-12 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGetOtp}
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex justify-center items-center disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Send Reset Code"}
                            </button>
                        </div>
                    ) : (
                        /* STEP 2: OTP ENTRY */
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Enter 6-Digit OTP</label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-4 text-center text-2xl font-bold tracking-[1em] transition-all"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleVerifyOTP}
                                disabled={isLoading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 flex justify-center items-center disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Verify & Continue"}
                            </button>

                            <p className="text-center text-sm text-slate-500">
                                Didn't receive code? <button onClick={handleGetOtp} className="text-indigo-600 font-bold hover:underline">Resend</button>
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <a href="/login" className="text-slate-400 text-sm hover:text-slate-600 transition">
                            Back to Sign In
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetOTP