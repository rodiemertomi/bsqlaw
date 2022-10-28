import React, { useState, useRef, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AlertBox from '../components/AlertBox'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

function LoginSignUp() {
  const [showLogin, setShowLogin] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)
  const { googleSignIn, user, signup, login, facebookSignIn } = UserAuth()
  const navigate = useNavigate()
  const signUpEmailRef = useRef()
  const signUpUserNameRef = useRef()
  const setPasswordRef = useRef()
  const confirmPasswordRef = useRef()
  const loginEmailRef = useRef()
  const loginPasswordRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      alert(error)
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn()
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    if (user !== null) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLoginClick = () => {
    setShowSignUp(false)
    setShowLogin(true)
  }

  async function handleLogin(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(loginEmailRef.current.value, loginPasswordRef.current.value)
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError(`User not found.`)
          break
        default:
          setError(`Password is incorrect.`)
      }
    }
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    const colRef = collection(db, 'users')

    if (setPasswordRef.current.value !== confirmPasswordRef.current.value) {
      setError('Passwords do not match')
      return
    }

    try {
      setError('')
      setLoading(true)
      await signup(signUpEmailRef.current.value, setPasswordRef.current.value)
      const data = {
        appointments: [],
        birthday: new Date(),
        contactNo: '',
        email: signUpEmailRef.current.value,
        expertise: [],
        firstname: '',
        folders: [],
        gender: '',
        initials: '',
        lastname: '',
        photoURL: '',
        role: 'client',
        username: signUpUserNameRef.current.value,
      }
      await addDoc(colRef, data)
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError(`Email address ${signUpEmailRef.current.value} already in use.`)
          break
        case 'auth/invalid-email':
          setError(`Email address ${signUpEmailRef.current.value} is invalid.`)
          break
        case 'auth/operation-note-allowed':
          setError(`Error during signup.`)
          break
        case 'auth/weak-password':
          setError(`Password should contain atleast 6 characters.`)
          break
        default:
          setError(error.message)
          break
      }
    }
    setLoading(false)
  }

  return (
    <div className='bg-white flex justify-center items-center h-screen transition-all duration-200 '>
      <div
        className={`shadow-2xl flex flex-col jus items-center w-[350px] border-black border-[3px] rounded-3xl h-[600px] lg:h-[450px] lg:mt-14`}
      >
        <div className='flex'>
          <div
            onClick={handleLoginClick}
            className={`font-Lora flex justify-center items-center font-semibold border-black border-[2px] w-[345px] rounded-t-2xl h-14 ${
              showLogin ? `bg-[#632121] text-white` : ``
            }`}
          >
            BSQ LAW
          </div>
        </div>

        {/* LOGIN */}
        {showLogin && (
          <div className='flex justify-center flex-col w-[270px] h-[500px]'>
            <form onSubmit={handleLogin} className='flex flex-col gap-2 w-[270px] h-[300px]'>
              <p className='font-Lora text-xs text-center text-[#8C760A]'>
                Login with the email provided by the firm
              </p>
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
              {error && <AlertBox>{error}</AlertBox>}
              <button
                type='submit'
                className='font-Lora font-bold mt-2 py-4 px-8 rounded-3xl border-gray border-2 bg-maroon hover:text-black hover:bg-white text-white md:text-sm md:py-3 md:px-4 '
              >
                LOG IN
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignUp
