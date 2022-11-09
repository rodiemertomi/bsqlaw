import React, { useState } from 'react'
import UseUserReducer from '../../UserReducer'
import EditProfile from '../pages/EditProfile'

export default function AdminProfile() {
  const { firstName, lastName, email, photoURL, gender, contactNo } = UseUserReducer()
  const [openModal, setOpenModal] = useState(false)

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='w-[90%] h-[90%] rounded-lg shadow-lg bg-maroon flex flex-col items-center justify-center gap-4 lg:w-[90%] lg:h-[95%] lg:ml-24'>
        <div className='flex flex-col justify-center items-center gap-1 bg-[#fff] rounded-lg shadow-lg lg:w-[39%] h-[70%] lg:h-[85%] md:w-[80%] md:h-[60%]'>
          <div className='border-4 border-[#5B1D1D] shadow-lg rounded-full w-[201px] h-[208px]'>
            <img
              alt='user'
              className='w-[200px] h-[200px] rounded-full p-[1px] mb-2'
              src={photoURL === '' || !photoURL ? require('../../assets/user.png') : `${photoURL}`}
            />
          </div>
          <h1>
            <span className='font-bold text-3xl'>
              {firstName} {lastName}
            </span>
          </h1>
          <div className='flex flex-col mt-1 gap-1'>
            <div className='flex justify-center items-center gap-1'>
              <img alt='info icon' className='w-5 h-5' src={require('../../assets/info.png')} />
              <h1 className='font-bold text-maroon text-lg'>Basic Information</h1>
            </div>
            <h1>
              <span className='font-bold'>Gender:</span> {gender}
            </h1>
            <h1>
              <span className='font-bold'>Contact Number:</span> {contactNo}
            </h1>
          </div>
          <div className='w-full mt-2 p-3 bg-black shadow-lg flex items-center justify-center'>
            <h1>
              <span className='text-white'>Connect with</span>{' '}
              <span className=' text-white font-Lora italic'> {email}</span>
            </h1>
          </div>
          <button
            type='button'
            onClick={() => {
              setOpenModal(true)
            }}
            className='font-semibold mt-2 w-[60%] md:w-[30%] lg:w-[35%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center'
          >
            <img
              alt='edit icon'
              className='w-6 h-6 invert'
              src={require('../../assets/edit.png')}
            />
            Edit Profile
          </button>
        </div>
      </div>
      <div className='absolute lg:left-[40px]'>
        {openModal && <EditProfile closeModal={setOpenModal} />}
      </div>
    </div>
  )
}
