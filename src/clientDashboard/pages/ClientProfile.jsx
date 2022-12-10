import React, { useState } from 'react'
import UseUserReducer from '../../UserReducer'
import EditProfile from '../pages/EditProfile'
import ChangePassword from '../../components/ChangePassword'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useEffect } from 'react'

export default function AdminProfile() {
  const {
    firstName,
    lastName,
    email,
    photoURL,
    gender,
    contactNo,
    lawyers,
    password,
    username,
    role,
  } = UseUserReducer()
  const [openModal, setOpenModal] = useState(false)
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [showLawyerList, setShowLawyerList] = useState(false)
  const [showLawyerProfile, setShowLawyerProfile] = useState(false)
  const [lawyersList, setLawyersList] = useState()
  const [showLawyer, setShowLawyer] = useState({})
  const [error, setError] = useState(false)

  const checkPassword = () => {
    if (password !== 'newclient') {
      setError(false)
      return
    }
    setChangePasswordModal(true)
    setError(true)
  }

  const getLawyers = async () => {
    if (role !== 'client') {
      return
    }
    const colRef = collection(db, 'users')
    let lawyersArr = []
    lawyers?.map(async lawyer => {
      const q = query(colRef, where('initials', '==', `${lawyer}`))
      await getDocs(q).then(snap => {
        snap.docs.map(doc => lawyersArr.push({ ...doc.data(), id: doc.id }))
      })
    })
    setLawyersList(lawyersArr)
  }

  const handleShowLawyerProfile = lawyer => {
    setShowLawyerProfile(true)
    setShowLawyer(lawyer)
  }

  useEffect(() => {
    checkPassword()
    getLawyers()
  }, [])

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='w-[90%] h-[90%] rounded-lg shadow-lg bg-maroon flex flex-col items-center justify-center gap-4 lg:w-[90%] lg:h-[95%] lg:ml-24'>
        <div className='flex flex-col justify-center items-center gap-1 bg-[#fff] rounded-lg shadow-lg lg:w-[500px] lg:h-[580px] h-[80%] w-[90%]  md:w-[80%] md:h-[60%]'>
          <div className='border-4 border-[#5B1D1D] shadow-lg rounded-full w-[201px] h-[208px]'>
            <img
              alt='user'
              className='w-[200px] h-[200px] rounded-full p-[1px] mb-2'
              src={photoURL === '' || !photoURL ? require('../../assets/user.png') : `${photoURL}`}
            />
          </div>
          <h1 className=''>
            <span className='font-bold text-lg lg:text-3xl'>
              {firstName} {lastName}
            </span>
          </h1>
          <h1
            className='font-bold underline text-maroon hover:text-black  hover:cursor-pointer '
            onClick={() => {
              setShowLawyerList(true)
            }}
          >
            My Lawyers
          </h1>
          {showLawyerList && (
            <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center z-20'>
              <div className='bg-white animate-[moveTop_0.3s_ease-in-out] w-[360px] h-[480px] gap-2 rounded-xl flex flex-col items-center shadow-lg'>
                <div className='w-full h-[60px] bg-maroon rounded-t-xl flex items-center justify-center'>
                  <h1 className='text-2xl font-bold text-white'>My Lawyers</h1>
                </div>
                <div className='flex flex-col w-full h-full items-center justify-between pr-6 pl-6 pt-3 pb-3'>
                  <div className='overflow-auto w-full text-base font-light flex flex-col gap-1'>
                    {lawyersList?.map((lawyer, i) => (
                      <div
                        className='w-full bg-maroon rounded-md cursor-pointer text-white p-3 pl-5 '
                        onClick={() => handleShowLawyerProfile(lawyer)}
                      >
                        <h1 key={i}>
                          {lawyer.firstname} {lawyer.lastname}
                        </h1>
                      </div>
                    ))}
                  </div>
                  <div className='text-sm font-thin'>
                    <h1
                      className='text-maroon hover:font-bold hover:cursor-pointer mb-2'
                      onClick={() => setShowLawyerList(false)}
                    >
                      Close
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showLawyerProfile && (
            <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center z-20'>
              <div className='bg-white animate-[moveTop_0.3s_ease-in-out] w-[360px] h-[480px] gap-2 rounded-xl flex flex-col items-center shadow-lg'>
                <div className='flex flex-col justify-center items-center gap-1 bg-[#fff] rounded-lg shadow-lg lg:w-[500px] lg:h-[580px] h-[80%] w-[90%] md:w-[80%] md:h-[60%]'>
                  <div className='border-4 border-[#5B1D1D] shadow-lg rounded-full w-[201px] h-[208px]'>
                    <img
                      alt='user'
                      className='w-[200px] h-[200px] rounded-full p-[1px] mb-2'
                      src={
                        showLawyer.photoURL === '' || !showLawyer.photoURL
                          ? require('../../assets/user.png')
                          : `${showLawyer.photoURL}`
                      }
                    />
                  </div>
                  <h1>
                    <span className='font-bold text-3xl'>
                      {showLawyer.firstName} {showLawyer.lastName}
                    </span>
                  </h1>
                  <h1>
                    <span className='font-bold text-xl'>{showLawyer.initials}</span>
                  </h1>
                  <div className='w-[70%] flex flex-col gap-1'>
                    <div className='flex justify-center items-center gap-1'>
                      <img
                        alt='info icon'
                        className='w-5 h-5'
                        src={require('../../assets/info.png')}
                      />
                      <h1 className='font-bold text-maroon text-lg'>Basic Information</h1>
                    </div>
                    <h1>
                      <span className='font-bold'>Contact Number:</span> {showLawyer.contactNo}
                    </h1>
                    <div className='w-full mt-2 text-xs lg:text-base p-3 bg-black shadow-lg flex items-center justify-center'>
                      <h1 className='flex items-center justify-center'>
                        <img
                          alt='user'
                          className='w-6 h-6 invert mr-1'
                          src={require('../../assets/email.png')}
                        />
                        <span className='text-white mr-[2px]'>Connect with</span>{' '}
                        <span className=' text-white font-Lora italic'> {showLawyer.email}</span>
                      </h1>
                    </div>
                    <div className='text-sm font-thin'>
                      <h1
                        className='text-maroon text-center mt-5 hover:font-bold hover:cursor-pointer mb-2'
                        onClick={() => setShowLawyerProfile(false)}
                      >
                        Close
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          <div className='w-full flex p-3 items-center justify-center gap-1'>
            <button
              type='button'
              onClick={() => {
                setOpenModal(true)
              }}
              className='font-semibold mt-2 w-[50%] lg:w-[40%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center'
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
              className='font-semibold mt-2 w-[50%] lg:w-[40%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center'
            >
              <img
                alt='edit icon'
                className='w-5 h-5 invert'
                src={require('../../assets/password.png')}
              />
              Change Password
            </button>
          </div>
        </div>
      </div>
      <div className='absolute lg:left-[40px]'>
        {openModal && <EditProfile closeModal={setOpenModal} />}
        {changePasswordModal && (
          <ChangePassword closeModal={setChangePasswordModal} username={username} error={error} />
        )}
      </div>
    </div>
  )
}
