import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LightButton from './LightButton'
import { UserAuth } from '../context/AuthContext'

function NavigationBar() {
  let Links = [
    { name: 'HOME', path: '/bsqlaw' },
    { name: 'ABOUT', path: '/about' },
    { name: 'FAQS', path: '/faqs' },
    { name: 'CONTACT US', path: '/contactus' },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = UserAuth()

  const changeNavBarcolor = () => {
    if (window.scrollY >= 40) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  window.addEventListener('scroll', changeNavBarcolor)
  return (
    <div
      className={`${
        user ? 'hidden' : 'w-full fixed top-0 left-0 z-[999] text-shadow-md font-bold'
      }`}
    >
      <div
        className={`md:flex items-center justify-between ${
          isScrolled || open
            ? 'bg-maroon text-white lg:shadow-lg h-20'
            : 'bg-transparent text-maroon h-20'
        } py-4 md:px-10 px-7`}
      >
        <div
          className={`font-bold text-2xl md:text-3xl cursor-pointer flex items-center font-Lora ${
            isScrolled ? 'text-white' : 'bg-text-maroon'
          }`}
        >
          <div className='hover:text-yellow transition-all duration-200'>
            <Link to='/'>
              <img
                src={require('../assets/officialBSQlogo.png')}
                alt='bsqlogo'
                className='w-[70px] lg:w-[150px]'
              />
            </Link>
          </div>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className='text-2xl absolute right-8 top-4 cursor-pointer lg:hidden hover:text-yellow '
        >
          <ion-icon name={open ? 'close' : 'menu'}></ion-icon>
        </div>
        <ul
          className={`md:flex md:items-center lg:justify-end md:justify-between lg:gap-10 md:gap-6 gap-16 font-Lora text-2xl md:text-xs lg:py-0 md:py-8 pb-12 absolute lg:static bg-transparent ${
            isScrolled || open ? 'bg-maroon text-white  ' : 'bg-transparent text-maroon '
          } md:z-auto z-[-1] left-0 w-full md:w-full md:pl-0 pl-9 lg:pr-0 md:pr-4  ease-in ${
            open ? 'top-20' : 'top-[-400px]'
          }`}
        >
          {Links.map(link => (
            <li className='md:ml-8 text-xl font-black md:my-0 my-7' key={link.name}>
              <Link
                to={link.path}
                className='hover:text-yellow transition-all duration-200'
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <Link to={'/login'}>
            <LightButton isScrolled={isScrolled} setOpen={setOpen}>
              LOGIN
            </LightButton>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default NavigationBar
