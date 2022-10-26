import React, { useState } from 'react'
import UseUserReducer from '../../UserReducer'
import EditProfile from '../pages/EditProfile'

export default function AdminProfile() {
  const {
    firstName,
    lastName,
    username,
    email,
    photoURL,
    expertise,
    initials,
    birthday,
    gender,
    contactNo,
  } = UseUserReducer()
  const [openModal, setOpenModal] = useState(false)

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='w-[90%] h-[90%] rounded-lg shadow-lg bg-[#D9D9D9] flex flex-col items-center justify-center gap-4 lg:w-[90%] lg:h-[95%] lg:ml-24'>
        <div className='m-5 lg:m-5 text-center'>
          <h1 className='text-[50px] font-semibold'>Welcome, {username}!</h1>
        </div>
        <div className='flex flex-col justify-center items-center gap-1'>
          <img
            alt='user'
            className='w-[200px] h-[200px] rounded-full mb-2'
            src={photoURL === '' || !photoURL ? require('../../assets/user.png') : `${photoURL}`}
          />
          <h1>First Name: {firstName}</h1>
          <h1>Last Name: {lastName}</h1>
          <h1>Initials: {initials}</h1>
          <h1>Email: {email}</h1>
          <h1>Expertise: {expertise?.join(', ')}</h1>
          <h1>Gender: {gender}</h1>
          <h1>Birthday: {!birthday || birthday === '' ? '' : formatDate(birthday?.toDate())}</h1>
          <h1>Contact Number: {contactNo}</h1>
          <button
            type='button'
            onClick={() => {
              setOpenModal(true)
            }}
            className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
          >
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
