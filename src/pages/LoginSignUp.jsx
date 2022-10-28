import React, { useState, useRef, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AlertBox from '../components/AlertBox'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

function LoginSignUp() {
  const { user, login, signup } = UserAuth()
  const navigate = useNavigate()
  const loginEmailRef = useRef()
  const loginPasswordRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user !== null) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  async function handleLogin(e) {
    e.preventDefault()
    if (await checkUser(loginEmailRef.current.value, loginPasswordRef.current.value)) {
      try {
        await login(loginEmailRef.current.value, loginPasswordRef.current.value)
      } catch (err) {
        switch (err.code) {
          case 'auth/user-not-found':
            await signup(loginEmailRef.current.value, loginPasswordRef.current.value)
            break
          default:
            break
        }
      }
    } else {
      setError('Account not found.')
    }
    setLoading(false)
  }

  const checkUser = async (email, password) => {
    const docRef = collection(db, 'users')
    const q1 = query(
      docRef,
      where('email', '==', `${email}`),
      where('password', '==', `${password}`)
    )
    const docSnap = await getDocs(q1)
    if (docSnap.docs.length === 1) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className='bg-white flex justify-center items-center h-screen transition-all duration-200 '>
      <div
        className={`shadow-2xl flex flex-col jus items-center w-[350px] border-black border-[3px] rounded-3xl h-[600px] lg:h-[450px] lg:mt-14`}
      >
        <div className='flex'>
          <div
            className={`font-Lora flex justify-center items-center font-semibold border-black border-[2px] w-[345px] rounded-t-2xl h-14 bg-[#632121] text-white`}
          >
            BSQ Law
          </div>
        </div>
        {/* LOGIN */}
        <div className='flex justify-center flex-col w-[270px] h-[500px]'>
          <form onSubmit={handleLogin} className='flex flex-col gap-2 w-[270px] h-[300px]'>
            <p className='font-Lora text-xs text-center text-[#8C760A]'>
              Login with the email provided by the firm
            </p>
            <div className='text-red-300'>{error && <AlertBox>{error}</AlertBox>}</div>
            <label htmlFor='email' className=' font-Lora font-semibold mt-2'>
              EMAIL:
            </label>
            <input
              required
              ref={loginEmailRef}
              type='email'
              name='email'
              placeholder='Email'
              className='bg-white self-center h-11 border-black outline-none border-b-[1px]
                shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            <label htmlFor='password' className='font-Lora mt-3 font-semibold'>
              PASSWORD:
            </label>
            <input
              required
              ref={loginPasswordRef}
              type='password'
              name='password'
              placeholder='Password'
              className='bg-white self-center h-11 border-black outline-none border-b-[1px] 
                shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            <button
              disabled={loading}
              type='submit'
              className='font-Lora font-bold mt-5 py-4 px-8 rounded-3xl border-gray border-2 bg-maroon hover:text-black hover:bg-white text-white md:text-sm md:py-3 md:px-4 '
            >
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginSignUp
