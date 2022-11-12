import React, { Fragment } from 'react'
import background from '../assets/bgLandLord.jpg'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

function Home() {
  const { user } = UserAuth()
  return (
    <Fragment>
      {user ? (
        <Navigate to='./dashboard' />
      ) : (
        <div className='w-screen h-screen overflow-hidden bg-white '>
          <div
            className='mt-24 w-screen h-screen lg:h-[95%] lg:mt-20 bg-cover flex flex-col justify-center items-center'
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className='bg-[#000000] opacity-[0.5] w-full h-full'></div>
          </div>
          <div className='flex p-5 flex-col lg:flex-row items-center gap-7 justify-center absolute top-0 bottom-0 right-0 left-0'>
            <div className='mt-[60px] shadow-lg animate-[moveRight_0.8s_ease-in-out]'>
              <img
                alt='appointment'
                className='lg:w-[500px] lg:h-[350px] rounded-lg shadow-lg'
                src={require('../assets/bgLandLord.jpg')}
              />
            </div>
            <div className='flex flex-col gap-2 mt-[40px] font-Lora animate-[moveLeft_0.8s_ease-in-out]'>
              <h1 className='text-white text-5xl font-bold'>Lawful: BSQ Law Firm</h1>
              <div className='text-white  flex items-center'>
                <img
                  alt='appointment'
                  className='w-5 h-5 rounded-lg invert'
                  src={require('../assets/location.png')}
                />
                <h1 className='text-white font-medium ml-1 text-2xl'>
                  San Juan City | Metro Manila
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Home
