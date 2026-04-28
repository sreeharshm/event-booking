import React, { useState } from 'react';
import { custRegistration } from '../api/Allapi';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';

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
        <div className='flex justify-center items-center min-h-screen bg-[#f8fafc] px-4 relative overflow-hidden'>
            {/* Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

            <div className='bg-white w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-8 md:p-12 z-10 border border-gray-100'>
                <div className='mb-8 text-center'>
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl mb-4">
                        <UserPlus size={28} />
                    </div>
                    <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Create Account</h2>
                    <p className='text-gray-500 mt-2 font-medium'>Join EventPass to start booking events</p>
                </div>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-xl border border-red-100 text-center font-medium'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {/* Username */}
                    <div className="md:col-span-2">
                        <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1'>Username</label>
                        <div className='relative'>
                            <input
                                type="text"
                                name='username'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-11 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all'
                                placeholder='johndoe'
                                value={register.username}
                                onChange={handleChange}
                            />
                            <User className='absolute left-4 top-3.5 text-gray-400' size={18} />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1'>Email Address</label>
                        <div className='relative'>
                            <input
                                type="email"
                                name='email'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-11 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all'
                                placeholder='john@example.com'
                                value={register.email}
                                onChange={handleChange}
                            />
                            <Mail className='absolute left-4 top-3.5 text-gray-400' size={18} />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1'>Phone</label>
                        <div className='relative'>
                            <input
                                type="text"
                                name='ph_number'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-11 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all'
                                placeholder='1234567890'
                                value={register.ph_number}
                                onChange={handleChange}
                            />
                            <Phone className='absolute left-4 top-3.5 text-gray-400' size={18} />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className='block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1'>Password</label>
                        <div className='relative'>
                            <input
                                type="password"
                                name='password'
                                required
                                className='w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-11 focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all'
                                placeholder='••••••••'
                                value={register.password}
                                onChange={handleChange}
                            />
                            <Lock className='absolute left-4 top-3.5 text-gray-400' size={18} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-4">
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                <div className='mt-8 pt-6 border-t border-gray-100 text-center'>
                    <p className='text-gray-500 text-sm'>
                        Already have an account? 
                        <Link to='/login' className='text-rose-500 font-bold hover:underline ml-1'>
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registration;