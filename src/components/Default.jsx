import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Sparkles, Film, Ticket } from 'lucide-react';

function Default() {
    return (
        <div className='min-h-screen bg-[#F5F5F5] text-gray-800 antialiased'>
            {/* Navbar */}
            <nav className="fixed bg-[#333545] top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-6 md:px-16 shadow-md">
                <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-2 text-white'>
                        <div className='bg-[#F84464] p-2 rounded-md'>
                            <Ticket size={20} className="transform -rotate-12" />
                        </div>
                        <p className='text-2xl font-black tracking-tight'>
                            it's<span className='text-[#F84464]'>show</span>time
                        </p>
                    </div>
                    
                    {/* Simplified Location Selector reminiscent of BMS */}
                    <div className='hidden sm:flex items-center gap-1 text-gray-300 text-xs hover:text-white cursor-pointer transition-colors'>
                        <MapPin size={14} className="text-[#F84464]" />
                        <span>Select City</span>
                    </div>
                </div>
                
                <div className='flex items-center gap-4'>
                    <Link to='/login' className='text-xs font-medium text-gray-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-all'>
                        Sign In
                    </Link>
                    <Link to='/register' className='hidden md:block'>
                        <button className='bg-[#F84464] text-white text-xs font-bold py-1.5 px-4 rounded hover:bg-[#e23b59] transition-colors shadow-sm'>
                            Register Your Event
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Sub-Header / Navigation Strip */}
            <div className="fixed top-16 left-0 w-full bg-[#1F2533] text-gray-300 text-xs py-2.5 px-6 md:px-16 z-40 hidden sm:flex gap-6 items-center">
                <span className="hover:text-white cursor-pointer transition-colors font-medium">Movies</span>
                <span className="hover:text-white cursor-pointer transition-colors font-medium text-white border-b-2 border-[#F84464] pb-0.5">Stream</span>
                <span className="hover:text-white cursor-pointer transition-colors font-medium">Live Events</span>
                <span className="hover:text-white cursor-pointer transition-colors font-medium">Comedy Shows</span>
                <span className="hover:text-white cursor-pointer transition-colors font-medium">Sports</span>
                <span className="hover:text-white cursor-pointer transition-colors font-medium">Plays</span>
            </div>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
                {/* Text Content */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className='inline-flex items-center gap-2 bg-[#F84464]/10 text-[#F84464] px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase'>
                        <Sparkles size={12} />
                        <span>Your Entertainment Guide</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#1F2533]">
                        Movies, Comedy, <br />
                        <span className="text-[#F84464]">Music & More.</span>
                    </h1>

                    <p className="text-gray-600 text-base md:text-lg max-w-lg leading-relaxed">
                        Discover the latest blockbusters, highly-anticipated stand-up specials, live music concerts, and premium plays happening around you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <Link to="/login">
                            <button className="bg-[#F84464] text-white px-8 py-3.5 rounded-md font-bold text-base hover:bg-[#e23b59] shadow-md transition-all flex items-center gap-2">
                                Explore Live Events
                                <ArrowRight size={18} />
                            </button>
                        </Link>
                        
                        <div className='flex items-center gap-3 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200'>
                            <div className='flex -space-x-2.5'>
                                {[1, 2, 3].map((i) => (
                                    <img 
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i+15}`} 
                                        className='w-8 h-8 rounded-full border-2 border-white object-cover' 
                                        alt="User"
                                    />
                                ))}
                            </div>
                            <p className='text-xs text-gray-500 font-medium'>
                                <span className='text-gray-800 font-bold block'>Millions of users</span>
                                booking entertainment daily
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className='grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 max-w-md'>
                        <div>
                            <p className='text-xl md:text-2xl font-extrabold text-[#1F2533]'>1,000+</p>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Cinemas</p>
                        </div>
                        <div>
                            <p className='text-xl md:text-2xl font-extrabold text-[#1F2533]'>30+</p>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Cities</p>
                        </div>
                        <div>
                            <p className='text-xl md:text-2xl font-extrabold text-[#1F2533]'>15M+</p>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Tickets Registered</p>
                        </div>
                    </div>
                </div>

                {/* Hero Feature Banner Container */}
                <div className="flex-1 w-full max-w-xl relative">
                    <div className="relative bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                        <img
                            src="https://cdn.dribbble.com/userupload/11885764/file/original-05d46ef8d3f6b5f33de19a893c819aeb.png?resize=1200x900"
                            alt="Book My Show Mockup Banner"
                            className="w-full rounded-md object-cover filter contrast-[1.02]"
                        />
                        
                        {/* Floating BMS Style Tag */}
                        <div className='absolute bottom-6 right-6 bg-[#1F2533] text-white py-2 px-4 rounded-md shadow-lg flex items-center gap-2.5'>
                            <div className='bg-[#F84464] p-1.5 rounded text-white'>
                                <Film size={16} />
                            </div>
                            <div>
                                <p className='text-[10px] font-bold text-gray-400 uppercase leading-none tracking-wider'>Now Streaming</p>
                                <p className='text-xs font-bold text-white mt-0.5'>Exclusive Premieres</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Default;