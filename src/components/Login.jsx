import React, { useState } from 'react';
import { custLogin } from '../api/Allapi';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, CalendarDays } from 'lucide-react';

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
                navigate('/eventadd'); // Staff/Admin Panel
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
        <div className='flex justify-center items-center min-h-screen bg-[#f8fafc] px-4 overflow-hidden relative'>
            {/* Background Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

            <div className='bg-white w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-10 z-10 border border-gray-100'>
                <div className='mb-10 text-center'>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl mb-4">
                        <CalendarDays size={32} />
                    </div>
                    <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>EventPass</h2>
                    <p className='text-gray-500 mt-2 font-medium'>Sign in to book your next experience</p>
                </div>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-xl border border-red-100 text-center animate-pulse'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Username */}
                    <div>
                        <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1'>
                            Username
                        </label>
                        <div className='relative'>
                            <input
                                type="text"
                                name='username'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all'
                                placeholder='Enter username'
                                value={login.username}
                                onChange={handleChange}
                            />
                            <User className='absolute left-4 top-4 text-gray-400' size={18} />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between mb-2 ml-1">
                            <label className='text-xs font-bold uppercase tracking-wider text-gray-400'>
                                Password
                            </label>
                            <Link to='/otp' className='text-xs font-bold text-rose-500 hover:text-rose-600'>
                                Forgot?
                            </Link>
                        </div>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-11 pr-11 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all'
                                placeholder='••••••••'
                                value={login.password}
                                onChange={handleChange}
                            />
                            <Lock className='absolute left-4 top-4 text-gray-400' size={18} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors'
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <p className='text-center text-gray-500 text-sm pt-4'>
                        New to EventPass? 
                        <Link to='/register' className='text-rose-500 font-bold hover:underline ml-1'>
                            Create Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;