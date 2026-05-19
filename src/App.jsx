import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Default from './components/Default'
import Registration from './components/Registration'
import Login from './components/Login'
import Home from './components/Home'
import Events from './components/Events'
import Eventadd from './components/Eventadd'
import User from './components/User'
import Booking from './components/Booking'
import Allbooking from './components/Allbooking'

import GetOTP from './components/GetOTP'
import ResetPassword from './components/ResetPassword'
import Mybooking from './components/Mybooking'

import Sample from './components/Sample'
import MyProfile from './components/MyProfile'


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Default />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/event" element={<Events />} />
          <Route path="/eventadd" element={<Eventadd />} />
          <Route path="/user" element={<User />} />

          {/* Change this to be more explicit */}
          <Route path="/booking" element={<h1 className="pt-20 text-center">Select an event first</h1>} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/mybooking" element={<Mybooking />} />
          <Route path='/myprofile' element={<MyProfile/>}/>

          <Route path="/allbooking" element={<Allbooking />} />
          <Route path="/otp" element={<GetOTP />} />
          <Route path="/reset" element={<ResetPassword />} />

          <Route path="/sample" element={<Sample/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App