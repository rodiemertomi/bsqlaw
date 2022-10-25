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
      console.log(error)
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn()
    } catch (error) {
      console.log(error)
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

  const handleSignUpClick = () => {
    setShowLogin(false)
    setShowSignUp(true)
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
        role: 'user',
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
        className={`shadow-2xl flex flex-col items-center w-[350px] border-black border-[3px] rounded-3xl gap-5 h-[600px] lg:h-[522px] lg:mt-14`}
      >
        <div className='flex'>
          <div
            onClick={handleLoginClick}
            className={`font-Lora flex justify-center items-center font-semibold border-black border-[2px] rounded-tl-3xl w-[175px] h-14 cursor-pointer ${
              showLogin ? `bg-[#632121] text-white` : ``
            }`}
          >
            LOGIN
          </div>
          <div
            onClick={handleSignUpClick}
            className={`font-Lora flex justify-center items-center font-semibold border-black border-[2px] rounded-tr-3xl w-[175px] h-14 cursor-pointer ${
              showSignUp ? `bg-[#632121] text-white` : ``
            }`}
          >
            SIGN UP
          </div>
        </div>

        {/* LOGIN */}
        {showLogin && (
          <div className='flex justify-center flex-col w-[270px] h-[500px]'>
            {error && <AlertBox>{error}</AlertBox>}
            <form onSubmit={handleLogin} className='flex flex-col mt-4 gap-2 w-[270px] h-[290px]'>
              <label htmlFor='email' className=' font-Lora font-semibold'>
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
                type='submit'
                className='font-Lora font-bold mt-5 py-4 px-8 rounded-3xl border-gray border-2 bg-maroon hover:text-black hover:bg-white text-white md:text-sm md:py-3 md:px-4 '
              >
                LOG IN
              </button>
            </form>
            <div className='flex flex-col items-center'>
              <p className=' text-sm font-Lora font-semibold'>Login With</p>
              <hr className='w-64 mt-2' />
              <div className='flex gap-28 mt-2'>
                <img
                  onClick={handleFacebookSignIn}
                  className='w-12 h-12 cursor-pointer'
                  alt='fb.png'
                  src={require('../assets/fb.png')}
                />
                <img
                  onClick={handleGoogleSignIn}
                  className='w-12 h-12 cursor-pointer'
                  alt='gmail.png'
                  src={require('../assets/gmail.png')}
                />
              </div>
            </div>
          </div>
        )}

        {/* SIGNUP */}
        {showSignUp && (
          <div className='flex flex-col w-[270px] h-full '>
            {error && <AlertBox>{error}</AlertBox>}
            <form onSubmit={handleSignup} className='flex flex-col gap-1 w-[270px]'>
              <label htmlFor='email' className='text-sm font-Lora font-semibold'>
                EMAIL ADDRESS:
              </label>
              <input
                required
                ref={signUpEmailRef}
                type='email'
                name='email'
                placeholder='Email'
                className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <label htmlFor='username' className='mt-3 text-sm font-Lora font-semibold'>
                USERNAME:
              </label>
              <input
                required
                ref={signUpUserNameRef}
                type='text'
                name='username'
                placeholder='Username'
                className='bg-white self-center  border-black outline-none border-b-[1px] lg:h-[35px]
                shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <label htmlFor='password' className='mt-3 text-sm font-Lora font-semibold'>
                SET PASSWORD:
              </label>
              <input
                required
                ref={setPasswordRef}
                type='password'
                name='password'
                placeholder='Set Password'
                className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <label htmlFor='confirmPassword' className='mt-3 text-sm font-Lora font-semibold'>
                CONFIRM PASSWORD:
              </label>
              <input
                required
                ref={confirmPasswordRef}
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              {/* <div className='flex gap-2 h-10 items-center mt-3 font-Lora'>
                <input required type='checkbox' name='checkbox' />
                <label htmlFor='checkbox' className='text-xs'>
                  I HAVE READ THE TERMS & CONDITIONS
                </label>
              </div> */}
              <button
                type='submit'
                disabled={loading}
                className='font-Lora font-bold mt-2 px-8 rounded-3xl border-gray border-2 bg-maroon hover:text-black hover:bg-white text-white md:text-sm md:py-3 md:px-4'
              >
                SIGN UP
              </button>
            </form>
            <div className='flex flex-col items-center'>
              <p className='mt-4 text-sm font-Lora font-semibold'>Login With</p>
              <hr className='w-64' />
              <div className='flex gap-28 cursor-pointer'>
                <img
                  onClick={handleFacebookSignIn}
                  className='w-12 h-12'
                  alt='fb.png'
                  src={require('../assets/fb.png')}
                />
                <img
                  onClick={handleGoogleSignIn}
                  className='w-12 h-12 cursor-pointer'
                  alt='gmail.png'
                  src={require('../assets/gmail.png')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignUp
