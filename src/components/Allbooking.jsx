import React from 'react'

function Allbooking() {
  return (
    <div className='min-h-screen bg-gray-50'>
            <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-white p-5 shadow-xl">
                <nav className="flex flex-col space-y-4 font-semibold text-gray-400 font-mono">
                    <a href="/eventadd" className="hover:text-rose-500 "><i class="fa-solid fa-calendar-days"></i> EventAdd</a>
                    <a href="/" className="hover:text-rose-500"><i class="fa-solid fa-ticket"></i> Bookings</a>
                    <a href="/user" className="hover:text-rose-500"><i class="fa-solid fa-users"></i> Users</a>
                </nav>
            </aside>

            <nav className="fixed top-0 left-0 z-50 w-full h-16 flex items-center justify-between px-6 shadow-md bg-white">
                <p className="text-rose-500 text-2xl font-extrabold font-mono">
                    ADMIN <span className="text-gray-800">DASHBOARD</span>
                </p>
                <div>
                    <button
                        type="submit"
                        className="border border-rose-500 text-rose-500 text-sm font-mono font-semibold rounded-sm px-3 py-1 shadow-lg hover:bg-gray-100">
                        <a href="/login">
                            Logout
                        </a>
                    </button>
                </div>
            </nav>
        </div>
  )
}

export default Allbooking