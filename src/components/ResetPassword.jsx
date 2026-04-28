import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/Allapi'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            // If someone tries to access this URL directly without an email in state
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!newPassword || !confirmPassword) {
            alert("Please fill in all fields")
            return
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        setLoading(true)
        resetPassword({
            email,
            new_password: newPassword
        })
            .then(() => {
                alert("Password Changed Successfully! Please login with your new password.")
                navigate("/login")
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.error || "Failed to reset password";
                alert(errorMsg);
                console.error(err);
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-[#f9fafb] p-4'>
            <div className='bg-white w-full max-w-md shadow-xl rounded-[2.5rem] p-10 border border-gray-100'>
                
                {/* Icon Header */}
                <div className='flex flex-col items-center mb-8'>
                    <div className='bg-yellow-100 p-4 rounded-3xl mb-4'>
                        <ShieldCheck className='text-yellow-600' size={32} />
                    </div>
                    <h2 className='text-3xl font-black text-gray-900 tracking-tight'>New Password</h2>
                    <p className='text-gray-400 text-sm font-medium mt-2 text-center'>
                        Setting a new password for <span className='text-gray-700 font-bold'>{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* New Password Field */}
                    <div className='space-y-2'>
                        <label className='text-xs font-black uppercase tracking-widest text-gray-400 ml-1'>
                            New Password
                        </label>
                        <div className='relative'>
                            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full border-none bg-gray-50 focus:ring-2 focus:ring-yellow-400 rounded-2xl p-4 pl-12 transition-all outline-none'
                                placeholder='••••••••'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className='space-y-2'>
                        <label className='text-xs font-black uppercase tracking-widest text-gray-400 ml-1'>
                            Confirm Password
                        </label>
                        <div className='relative'>
                            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full border-none bg-gray-50 focus:ring-2 focus:ring-yellow-400 rounded-2xl p-4 pl-12 transition-all outline-none'
                                placeholder='••••••••'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full bg-yellow-400 text-gray-900 py-4 rounded-2xl font-black text-lg shadow-lg shadow-yellow-100 hover:bg-yellow-500 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 mt-4 flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : "Update Password"}
                    </button>
                </form>

                <p className='text-center mt-8 text-gray-400 text-sm font-bold'>
                    Wait, I remember! <a href="/login" className='text-yellow-600 hover:underline'>Back to Login</a>
                </p>
            </div>
        </div>
    )
}

export default ResetPassword