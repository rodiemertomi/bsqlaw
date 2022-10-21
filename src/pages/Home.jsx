import React, { Fragment } from 'react'
import background from '../assets/homebg.jpg'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

function Home() {
  const { user } = UserAuth()
  return (
    <Fragment>
      {user ? (
        <Navigate to='./dashboard' />
      ) : (
        <div className='w-screen h-screen overflow-hidden bg-white  '>
          <div
            className='w-screen h-screen lg:h-[95%] lg:mt-20 bg-cover flex flex-col justify-center items-center'
            style={{ backgroundImage: `url(${background})` }}
          >
            {/* <img
          className='w-[900px] h-[700px]'
          src={require('../assets/officialBSQlogo.png')}
          alt='bsqlogo'
        /> */}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Home
