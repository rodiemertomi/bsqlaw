import React from 'react'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import About from './pages/About'
import Faqs from './pages/Faqs'
import ContactUs from './pages/ContactUs'
import { Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import LoginSignUp from './pages/LoginSignUp'
import DashBoard from './components/DashBoard'
import Protected from './components/Protected'

function App() {
  return (
    <AuthContextProvider>
      <NavigationBar />
      <Routes>
        <Route exact path='/bsqlaw' element={<Home />} />
        <Route exact path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/Faqs' element={<Faqs />} />
        <Route path='/ContactUs' element={<ContactUs />} />
        <Route path='/login' element={<LoginSignUp />} />
        <Route
          path='/dashboard'
          element={
            <Protected>
              <DashBoard />
            </Protected>
          }
        />
      </Routes>
    </AuthContextProvider>
  )
}

export default App
