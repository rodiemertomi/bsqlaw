import React, { useState } from 'react'
import UseUserReducer from '../../UserReducer'
import EditProfile from '../pages/EditProfile'

export default function LawyerProfile() {
  const { firstName, lastName, email, photoURL, clients, initials, gender, contactNo } =
    UseUserReducer()
  const [openModal, setOpenModal] = useState(false)

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='w-[90%] h-[90%] rounded-lg shadow-lg bg-[#D9D9D9] flex flex-col items-center justify-center gap-4 lg:w-[90%] lg:h-[95%] lg:ml-24'>
        <div className='flex flex-col justify-center items-center gap-1 bg-white p-5 rounded-lg shadow-lg lg:w-[40%] h-[70%] lg:h-[85%]'>
          <img
            alt='user'
            className='w-[200px] h-[200px] rounded-full mb-2'
            src={photoURL === '' || !photoURL ? require('../../assets/user.png') : `${photoURL}`}
          />
          <h1>
            <span className='font-bold'>First Name:</span> {firstName}
          </h1>
          <h1>
            <span className='font-bold'>Last Name:</span> {lastName}
          </h1>
          <h1>
            <span className='font-bold'>Initials:</span> {initials}
          </h1>
          <h1>
            <span className='font-bold'>Email:</span> {email}
          </h1>

          <h1>
            <span className='font-bold'>Clients:</span>{' '}
          </h1>
          {clients?.map(client => `${client.firstname} ${client.lastname}, `)}
          <h1>
            <span className='font-bold'>Gender:</span> {gender}
          </h1>
          <h1>
            <span className='font-bold'>Contact Number:</span> {contactNo}
          </h1>
          <button
            type='button'
            onClick={() => {
              setOpenModal(true)
            }}
            className='mt-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
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
