import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';

function Default() {
    return (
        <div className='min-h-screen bg-white text-gray-900'>
            {/* Navbar */}
            <nav className="fixed bg-white/80 backdrop-blur-md top-0 left-0 z-50 w-full h-20 flex items-center justify-between px-6 md:px-16 border-b border-gray-100">
                <div className='flex items-center gap-2'>
                    <div className='bg-rose-500 p-1.5 rounded-lg text-white'>
                        <Calendar size={24} />
                    </div>
                    <p className='text-2xl font-black tracking-tighter'>
                        Event<span className='text-rose-500'>Pass</span>
                    </p>
                </div>
                
                <div className='flex items-center gap-4'>
                    <Link to='/login' className='hidden md:block text-sm font-bold text-gray-600 hover:text-rose-500 transition-colors'>
                        Log in
                    </Link>
                    <Link to='/register'>
                        <button className='bg-gray-900 text-white text-sm font-bold py-2.5 px-6 rounded-full hover:bg-black shadow-lg transition-transform active:scale-95'>
                            Get Started
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
                
                {/* Text Content */}
                <div className="flex-1 space-y-8 text-center md:text-left">
                    <div className='inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-bold animate-bounce'>
                        <Sparkles size={16} />
                        <span>Discover the best events in town</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-gray-900">
                        Experience <br />
                        <span className="text-rose-500 italic">Unforgettable</span> <br />
                        Moments.
                    </h1>

                    <p className="text-gray-500 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                        Your all-in-one platform to find, book, and enjoy the hottest concerts, 
                        tech conferences, and local festivals.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <Link to="/login">
                            <button className="group bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all flex items-center gap-2">
                                Explore Events
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        
                        <div className='flex -space-x-3'>
                            {[1, 2, 3, 4].map((i) => (
                                <img 
                                    key={i}
                                    src={`https://i.pravatar.cc/100?img=${i+10}`} 
                                    className='w-10 h-10 rounded-full border-2 border-white' 
                                    alt="User"
                                />
                            ))}
                            <div className='bg-gray-100 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold'>
                                +2k
                            </div>
                        </div>
                        <p className='text-sm text-gray-400 font-semibold'>Joined by 2,000+ enthusiasts</p>
                    </div>

                    {/* Quick Stats */}
                    <div className='grid grid-cols-3 gap-4 pt-8 border-t border-gray-100'>
                        <div>
                            <p className='text-2xl font-black text-gray-900'>500+</p>
                            <p className='text-xs font-bold text-gray-400 uppercase'>Events</p>
                        </div>
                        <div>
                            <p className='text-2xl font-black text-gray-900'>120+</p>
                            <p className='text-xs font-bold text-gray-400 uppercase'>Venues</p>
                        </div>
                        <div>
                            <p className='text-2xl font-black text-gray-900'>10k+</p>
                            <p className='text-xs font-bold text-gray-400 uppercase'>Tickets Sold</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image Container */}
                <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-rose-200 rounded-full blur-3xl opacity-20 transform scale-75"></div>
                    <img
                        src="https://cdn.dribbble.com/userupload/11885764/file/original-05d46ef8d3f6b5f33de19a893c819aeb.png?resize=1200x900"
                        alt="Event App Mockup"
                        className="relative w-full max-w-xl rounded-[2.5rem] shadow-2xl transform hover:rotate-2 transition-transform duration-500 border-8 border-white"
                    />
                    
                    {/* Floating Badge */}
                    <div className='absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse'>
                        <div className='bg-green-100 p-2 rounded-lg text-green-600'>
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className='text-xs font-bold text-gray-400 uppercase leading-none'>Popular in</p>
                            <p className='text-sm font-black text-gray-900'>Your Area</p>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Default;