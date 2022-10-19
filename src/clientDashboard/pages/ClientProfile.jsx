import React from 'react'

export default function ClientProfile() {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='w-[90%] h-[80%] rounded-lg shadow-lg bg-[#D9D9D9] flex flex-col items-center justify-center gap-40 lg:w-[90%] lg:h-[95%] lg:ml-24'>
        <div className='m-5 lg:m-5 text-center'>
          <h1 className='text-[50px] font-semibold'>Welcome, Client!</h1>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <img
            alt='user'
            className='w-[60%] md:w-[35%] lg:w-[40%]'
            src={require('../../assets/user.png')}
          />
          <button
            type='button'
            class=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}
