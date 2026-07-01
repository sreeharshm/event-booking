import React, { useState } from 'react';
import { custRegistration } from '../api/Allapi';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Ticket } from 'lucide-react';

function Registration() {
    const [register, setRegister] = useState({
        username: "",
        ph_number: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setRegister({ ...register, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await custRegistration(register);
            console.log("Registration successful", res.data);
            alert("Your account has been created successfully!");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-[#1F2533] px-4 relative antialiased py-8'>
            {/* Ambient Background Glow - using #F84464 softly to give depth */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F84464] rounded-full blur-[140px] opacity-10 pointer-events-none"></div>

            <div className='bg-white w-full max-w-md shadow-2xl rounded-lg p-8 md:p-10 z-10 border border-gray-100'>
                {/* Branding / Header Header */}
                <div className='mb-8 text-center'>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F84464]/10 text-[#F84464] rounded-xl mb-3">
                        <Ticket size={28} className="transform -rotate-12" />
                    </div>
                    <h2 className='text-2xl font-black text-[#1F2533] tracking-tight'>
                        it's<span className='text-[#F84464]'>show</span>time
                    </h2>
                    <p className='text-gray-500 text-sm mt-1 font-medium'>Join EventPass to start booking events</p>
                </div>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 mb-6 text-xs font-semibold rounded border border-red-100 text-center'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Username Field */}
                    <div>
                        <label className='block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2'>
                            Username
                        </label>
                        <div className='relative'>
                            <input
                                type="text"
                                name='username'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all'
                                placeholder='johndoe'
                                value={register.username}
                                onChange={handleChange}
                            />
                            <User className='absolute left-3.5 top-3.5 text-gray-400' size={16} />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className='block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2'>
                            Email Address
                        </label>
                        <div className='relative'>
                            <input
                                type="email"
                                name='email'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all'
                                placeholder='john@example.com'
                                value={register.email}
                                onChange={handleChange}
                            />
                            <Mail className='absolute left-3.5 top-3.5 text-gray-400' size={16} />
                        </div>
                    </div>

                    {/* Phone Number Field */}
                    <div>
                        <label className='block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2'>
                            Phone Number
                        </label>
                        <div className='relative'>
                            <input
                                type="text"
                                name='ph_number'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all'
                                placeholder='1234567890'
                                value={register.ph_number}
                                onChange={handleChange}
                            />
                            <Phone className='absolute left-3.5 top-3.5 text-gray-400' size={16} />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className='block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2'>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                type="password"
                                name='password'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded p-3 pl-10 text-sm text-gray-800 focus:ring-1 focus:ring-[#F84464] focus:border-[#F84464] focus:bg-white outline-none transition-all'
                                placeholder='••••••••'
                                value={register.password}
                                onChange={handleChange}
                            />
                            <Lock className='absolute left-3.5 top-3.5 text-gray-400' size={16} />
                        </div>
                    </div>

                    {/* Vibrant Action Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-[#F84464] hover:bg-[#e23b59] disabled:bg-gray-300 text-white font-bold py-3.5 rounded text-sm tracking-wide shadow-md transition-colors active:scale-[0.99] flex items-center justify-center gap-2 mt-4'
                    >
                        {loading ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    {/* Navigation Link to Login */}
                    <p className='text-center text-gray-500 text-xs pt-4 border-t border-gray-100 mt-6'>
                        Already have an account? 
                        <Link to='/login' className='text-[#F84464] font-bold hover:underline ml-1'>
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Registration;