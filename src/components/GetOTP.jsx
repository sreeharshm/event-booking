import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft, Ticket, KeyRound } from 'lucide-react';
import { verifyOTP, sendOTP } from '../api/Allapi';

function GetOTP() {
    const [email, setEmail] = useState("");
    const [otp, setOTP] = useState("");
    const [isStepTwo, setIsStepTwo] = useState(false);
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
        <div className="min-h-screen flex items-center justify-center bg-[#1F2533] px-4 relative antialiased">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F84464] rounded-full blur-[140px] opacity-10 pointer-events-none"></div>

            <div className="bg-white w-full max-w-md shadow-2xl rounded-lg p-8 md:p-10 z-10 border border-gray-100 relative">
                
                {/* Back Button for Step 2 */}
                {isStepTwo && (
                    <button
                        onClick={() => setIsStepTwo(false)}
                        className="absolute left-6 top-8 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}

                {/* Branding / Visual Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F84464]/10 text-[#F84464] rounded-xl mb-3">
                        {isStepTwo ? (
                            <ShieldCheck size={28} className="transform -rotate-6" />
                        ) : (
                            <Ticket size={28} className="transform -rotate-12" />
                        )}
                    </div>
                    <h2 className="text-2xl font-black text-[#1F2533] tracking-tight">
                        {isStepTwo ? (
                            <>verify<span className="text-[#F84464]">code</span></>
                        ) : (
                            <>forgot<span className="text-[#F84464]">pass</span></>
                        )}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 font-medium px-4">
                        {isStepTwo
                            ? `We've sent a security code to ${email}`
                            : "Enter your registered email to receive a dynamic code"}
                    </p>
                </div>

                {!isStepTwo ? (
                    /* STEP 1: EMAIL ENTRY */
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Registered Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                            </div>
                        </div>

                        <button
                            onClick={handleGetOtp}
                            disabled={isLoading}
                            className="w-full bg-[#F84464] hover:bg-[#e23b59] disabled:bg-gray-300 text-white font-bold py-3.5 rounded text-sm tracking-wide shadow-md transition-colors active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Send Reset Code"
                            )}
                        </button>
                    </div>
                ) : (
                    /* STEP 2: OTP ENTRY */
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Enter 6-Digit Verification Code
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="000000"
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-center text-xl font-bold tracking-[0.25em] text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all placeholder:tracking-normal"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                                <KeyRound className="absolute left-3.5 top-3.5 text-gray-400 tracking-normal" size={16} />
                            </div>
                        </div>

                        <button
                            onClick={handleVerifyOTP}
                            disabled={isLoading}
                            className="w-full bg-[#F84464] hover:bg-[#e23b59] disabled:bg-gray-300 text-white font-bold py-3.5 rounded text-sm tracking-wide shadow-md transition-colors active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Verify & Continue"
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500 font-medium">
                            Didn't receive code?{' '}
                            <button onClick={handleGetOtp} className="text-[#F84464] font-bold hover:underline bg-transparent border-none p-0 outline-none cursor-pointer">
                                Resend
                            </button>
                        </p>
                    </div>
                )}

                {/* Footer Navigation Back to Login */}
                <div className="text-center text-gray-500 text-xs pt-4 border-t border-gray-100 mt-6">
                    <Link to="/login" className="text-gray-400 font-semibold hover:text-gray-600 transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GetOTP;