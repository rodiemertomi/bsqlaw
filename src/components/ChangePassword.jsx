import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import UseUserReducer from '../UserReducer'
import { UserAuth } from '../context/AuthContext'
import validator from 'validator'

function ChangePassword({ closeModal }) {
  const { id, password } = UseUserReducer()

  const { changePassword } = UserAuth()

  const [loading, setLoading] = useState(false)
  const [isStrong, setIsStrong] = useState(false)
  const [currentPasswordState, setCurrentPasswordState] = useState('')
  const [newPasswordState, setNewPasswordState] = useState('')
  const [confirmPasswordState, setConfirmPasswordState] = useState('')

  const validate = value => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setIsStrong(true)
    } else {
      setIsStrong(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    const docRef = doc(db, `users/${id}`)
    if (currentPasswordState !== password) {
      alert('Current password is incorrect.')
      setLoading(false)
      return
    }
    if (newPasswordState !== confirmPasswordState) {
      alert('New password and confirm password do not match.')
      setLoading(false)
      return
    }
    const data = {
      password: newPasswordState,
    }
    await setDoc(docRef, data, { merge: true }).then(() => {
      alert('Updated password successfully. Please refresh page.')
      changePassword(newPasswordState)
      closeModal(false)
      setLoading(false)
    })
  }

  useEffect(() => {
    validate(newPasswordState)
  }, [newPasswordState])

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-modalbg'>
      <div className='bg-[#e1dfdf] animate-[popUp_0.3s_ease-in-out] shadow-2xl w-[85%] h-[75%] flex flex-col items-center justify-center rounded-lg md:h-[95%] lg:h-[620px] lg:w-[520px] lg:gap-3'>
        <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='font-bold text-2xl'>Change Password</h1>
          <div className='w-[100%] flex flex-col gap-3'>
            <div className='flex flex-col items-center w-[100%] gap-4 mt-3'>
              <input
                required
                value={currentPasswordState}
                onChange={e => setCurrentPasswordState(e.target.value)}
                type='password'
                name='currentPassword'
                placeholder='Current Password'
                className=' h-9  pl-4 shadow appearance-none border-[1px] border-gray rounded py-2 px-3 w-1/2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <input
                required
                value={newPasswordState}
                onChange={e => setNewPasswordState(e.target.value)}
                type='password'
                name='newPassword1'
                placeholder='New Password'
                className=' h-9  pl-4 shadow appearance-none border-[1px] border-gray rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />

              <input
                required
                value={confirmPasswordState}
                onChange={e => setConfirmPasswordState(e.target.value)}
                type='password'
                name='confirmPassword'
                placeholder='Confirm New Password'
                className=' h-9  pl-4 shadow appearance-none border-[1px] border-gray rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <label className='pl-4 appearance-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs'>
                Password must contain at least 1 Uppercase, 1 Lowercase, 1 number, and a special
                character.
              </label>
              {newPasswordState && (
                <div className='h-6'>
                  {isStrong ? (
                    <GreenAlert>Password Is Strong</GreenAlert>
                  ) : (
                    <RedAlert>Password Is Weak</RedAlert>
                  )}
                </div>
              )}
            </div>
            <div className='flex flex-col items-center w-[100%] gap-4 '>
              <div className='w-[100%] flex justify-center gap-2 mt-2'>
                <button
                  onClick={() => closeModal(false)}
                  className='bg-white w-20 text-black font-bold py-2 px-4 rounded-3xl shadow-md hover:bg-maroon hover:text-white active:shadow-lg transition duration-150 ease-in-out'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`bg-maroon w-20 text-white font-bold py-2 px-4 rounded-3xl shadow-md hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out ${
                    loading ? `cursor-wait` : `cursor-pointer`
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword

function RedAlert({ children }) {
  return <div className='text-[#FF0000] font-semibold text-center mt-1'>{children}</div>
}

function GreenAlert({ children }) {
  return <div className='text-[#008000] font-semibold text-center mt-1'>{children}</div>
}
