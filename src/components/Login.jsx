import React, { useState } from 'react';
import { custLogin } from '../api/Allapi';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Ticket } from 'lucide-react';

function Login() {
    const [login, setLogin] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
        if (error) setError(""); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await custLogin(login);
            const { token, user } = response.data;

            // Secure storage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on role
            if (user.is_staff) {
                navigate('/user'); // Staff/Admin Panel
            } else {
                navigate('/home'); // Event Browsing Page
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-[#1F2533] px-4 relative antialiased'>
            {/* Ambient Background Glow reminiscent of cinema screens */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F84464] rounded-full blur-[140px] opacity-10 pointer-events-none"></div>

            <div className='bg-white w-full max-w-md shadow-2xl rounded-lg p-8 md:p-10 z-10 border border-gray-100'>
                <div className='mb-8 text-center'>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F84464]/10 text-[#F84464] rounded-xl mb-3">
                        <Ticket size={28} className="transform -rotate-12" />
                    </div>
                    <h2 className='text-2xl font-black text-[#1F2533] tracking-tight'>
                        it's<span className='text-[#F84464]'>show</span>time
                    </h2>
                    <p className='text-gray-500 text-sm mt-1 font-medium'>Sign in to manage your tickets and bookings</p>
                </div>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 mb-6 text-xs font-semibold rounded border border-red-100 text-center'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Username */}
                    <div>
                        <label className='block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2'>
                            Username or Email
                        </label>
                        <div className='relative'>
                            <input
                                type="text"
                                name='username'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all'
                                placeholder='Enter your username'
                                value={login.username}
                                onChange={handleChange}
                            />
                            <User className='absolute left-3.5 top-3.5 text-gray-400' size={16} />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className='text-[11px] font-bold uppercase tracking-wider text-gray-400'>
                                Password
                            </label>
                            <Link to='/otp' className='text-xs font-semibold text-[#F84464] hover:underline'>
                                Forgot Password?
                            </Link>
                        </div>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 pr-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all'
                                placeholder='••••••••'
                                value={login.password}
                                onChange={handleChange}
                            />
                            <Lock className='absolute left-3.5 top-3.5 text-gray-400' size={16} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors'
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-[#F84464] hover:bg-[#e23b59] disabled:bg-gray-300 text-white font-bold py-3.5 rounded text-sm tracking-wide shadow-md transition-colors active:scale-[0.99] flex items-center justify-center gap-2 mt-2'
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <p className='text-center text-gray-500 text-xs pt-4 border-t border-gray-100 mt-6'>
                        New to the platform? 
                        <Link to='/register' className='text-[#F84464] font-bold hover:underline ml-1'>
                            Register Now
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;