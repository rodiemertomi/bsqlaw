import React, { useState } from 'react'
import UseUserReducer from '../../UserReducer'
import EditProfile from '../pages/EditProfile'
import ChangePassword from '../../components/ChangePassword'

export default function LawyerProfile() {
  const { firstName, lastName, email, photoURL, clients, initials, gender, contactNo } =
    UseUserReducer()
  const [openModal, setOpenModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)

  const [showClientList, setShowClientList] = useState(false)

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='w-[90%] h-[90%] rounded-lg shadow-lg bg-maroon flex flex-col items-center justify-center gap-4 lg:w-[90%] lg:h-[95%] lg:ml-24'>
        <div className='flex flex-col justify-center items-center gap-1 bg-[#fff] rounded-lg shadow-lg lg:w-[500px] lg:h-[580px] h-[80%] w-[90%] md:w-[80%] md:h-[60%]'>
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
          <h1>
            <span className='font-bold text-xl'>{initials}</span>
          </h1>
          <div className='w-[70%] flex flex-col gap-1'>
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
            <div>
              <h1>
                <span className='font-bold'>List of Clients:</span>
                <span
                  className='ml-1 text-xs font-bold text-maroon cursor-pointer hover:underline'
                  onClick={() => {
                    setShowClientList(true)
                  }}
                >
                  Click here to see List of Clients
                </span>
              </h1>
              {showClientList && (
                <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center z-20'>
                  <div className='bg-white animate-[moveTop_0.3s_ease-in-out] w-[360px] h-[480px] gap-2 rounded-xl flex flex-col items-center shadow-lg'>
                    <div className='w-full h-[60px] bg-maroon rounded-t-xl flex items-center justify-center'>
                      <h1 className='text-2xl font-bold text-white'>List of Clients</h1>
                    </div>
                    <div className='flex flex-col w-full h-full items-center justify-between pr-6 pl-6 pt-3 pb-3'>
                      <div className='overflow-auto w-full text-base font-light flex flex-col gap-1'>
                        {clients?.map((client, i) => (
                          <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                            <h1 key={i}>
                              {client.firstname} {client.lastname}
                            </h1>
                          </div>
                        ))}
                      </div>
                      <div className='text-sm font-thin'>
                        <h1
                          className='text-maroon hover:font-bold hover:cursor-pointer mb-2'
                          onClick={() => setShowClientList(false)}
                        >
                          close
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='w-full mt-2 text-xs lg:text-base p-3 bg-black shadow-lg flex items-center justify-center'>
            <h1 className='flex items-center justify-center'>
              <img
                alt='user'
                className='w-6 h-6 invert mr-1'
                src={require('../../assets/email.png')}
              />
              <span className='text-white mr-[2px]'>Connect with</span>{' '}
              <span className=' text-white font-Lora italic'> {email}</span>
            </h1>
          </div>
          <button
            type='button'
            onClick={() => {
              setOpenModal(true)
            }}
            className='font-semibold mt-2 w-[60%] md:w-[30%] lg:w-[30%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center'
          >
            <img
              alt='edit icon'
              className='w-6 h-6 invert'
              src={require('../../assets/edit.png')}
            />
            Edit Profile
          </button>
          <button
            type='button'
            onClick={() => {
              setChangePasswordModal(true)
            }}
            className='font-semibold mt-2 w-[60%] md:w-[30%] lg:w-[30%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center'
          >
            <img
              alt='edit icon'
              className='w-6 h-6 invert'
              src={require('../../assets/edit.png')}
            />
            Change Password
          </button>
        </div>
      </div>
      <div className='absolute lg:left-[40px]'>
        {openModal && <EditProfile closeModal={setOpenModal} />}
        {changePasswordModal && <ChangePassword closeModal={setChangePasswordModal} />}
      </div>
    </div>
  )
}
