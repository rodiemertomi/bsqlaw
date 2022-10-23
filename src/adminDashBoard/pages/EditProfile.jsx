import React, { useEffect, useRef, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

function EditProfile({ closeModal }) {
  const {
    username,
    id,
    photoURL,
    expertise,
    contactNo,
    firstName,
    email,
    lastName,
    gender,
    birthday,
  } = UseUserReducer()

  const {
    setPhotoURL,
    setBirthday,
    setEmail,
    setGender,
    setExpertise,
    setContactNo,
    setFirstName,
    setLastName,
  } = UseUserReducer()

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const expertiseRef = useRef()
  const contactNoRef = useRef()
  const [genderState, setGenderState] = useState()
  const [birthdayState, setBirthdayState] = useState()
  const [formatedBirthday, setFormatedBirthday] = useState()
  const [photoURLState, setPhotoURLState] = useState(photoURL)
  let birthdayArr = []
  let formatedBdayArr = []

  const handleImageChange = async () => {
    const fileUrl = `photos/${username}/${image.name}`
    const imgRef = ref(storage, fileUrl)
    await uploadBytes(imgRef, image).then(snapshot => {
      getDownloadURL(snapshot.ref).then(url => {
        setPhotoURLState(url)
      })
    })
  }

  const handleBirthdayChange = () => {
    if (!birthdayState) return
    console.log('first')
    birthdayArr = birthdayState.split('-', 3)
    for (let i = birthdayArr.length - 1; i >= 0; i--) {
      let data = birthdayArr[i]
      formatedBdayArr.push(data)
      setFormatedBirthday(formatedBdayArr.join('/'))
    }
  }
  console.log(id)
  const handleSave = async () => {
    setLoading(true)
    setFirstName(firstNameRef.current.value)
    setLastName(lastNameRef.current.value)
    setEmail(emailRef.current.value)
    setExpertise(expertiseRef.current.value.split(','))
    setContactNo(contactNoRef.current.value)
    setGender(genderState)
    setBirthday(formatedBirthday)
    setPhotoURL(photoURLState)
    const docRef = doc(db, `users/${id}`)
    const data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      expertise: expertise,
      contactNo: contactNo,
      gender: gender,
      birthday: birthday,
      photoURL: photoURL,
    }
    setDoc(docRef, data, { merge: true }).then(alert('Updated profile successfully'))
    closeModal(false)
    setLoading(false)
  }

  useEffect(() => {
    handleBirthdayChange()
    handleImageChange()
  }, [birthdayState, image])

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-[#f8f4f4]'>
      <div className='bg-[#BABABA] shadow-2xl w-[90%] h-[85%] flex flex-col items-center justify-center rounded-lg md:h-[95%] lg:mt-2 lg:h-[95%] lg:w-[60%] lg:gap-3'>
        <h1 className='font-bold text-2xl'>Edit Profile</h1>
        <div className='flex flex-col justify-center items-center'>
          <div className='flex flex-col justify-center items-center bg-transparent transition-all'>
            <input
              className='hidden'
              id='file'
              type='file'
              accept='image/png, image/gif, image/jpeg, image/jpg'
              onChange={e => {
                setImage(e.target.files[0])
              }}
            />
            <img
              alt='user'
              className='w-[170px] h-[170px] object-cover z-0 rounded-full'
              src={photoURLState === '' ? require('../../assets/user.png') : `${photoURLState}`}
            />
            <div
              className='w-[170px] h-[170px] rounded-full hover:bg-[#000000] opacity-0 hover:opacity-80 cursor-pointer text-transparent hover:object-center hover:text-white
              transition-all absolute flex justify-center items-center'
            >
              <label htmlFor='file' className='cursor-pointer absolute z-[1000]'>
                <span>Change Image</span>
              </label>
            </div>
          </div>
          <hr className='w-64 mb-5' />
          <div className='w-[90%] flex flex-col gap-3'>
            <div className='flex flex-col items-center w-[100%] gap-3 mt-3'>
              <input
                required
                ref={firstNameRef}
                type='text'
                name='firstname'
                placeholder='First Name'
                className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <input
                required
                ref={lastNameRef}
                type='text'
                name='lastname'
                placeholder='Last Name'
                className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <input
                required
                ref={emailRef}
                type='email'
                name='email'
                placeholder='Email'
                className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <input
                required
                ref={expertiseRef}
                type='text'
                name='expertise'
                placeholder='Expertise separate by comma'
                className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            <div className='flex flex-col items-center w-[100%] gap-3 '>
              <input
                required
                ref={contactNoRef}
                type='tel'
                name='phone'
                placeholder='Contact Number'
                className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <div className='flex justify-center items-center w-[95%] gap-[1px] '>
                <div className='flex flex-col w-1/2 pl-20'>
                  <label htmlFor='gender'>Gender</label>
                  <select
                    name='gender'
                    onChange={e => setGenderState(e.target.value)}
                    id='gender'
                    className='h-10 shadow border-[1px] border-gray rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='others'>Others</option>
                  </select>
                </div>
                <div className='flex flex-col w-1/2 pr-20'>
                  <label htmlFor=''>Birthday</label>
                  <input
                    className=' h-10 shadow border-[1px] border-gray rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
                    type='date'
                    onChange={e => {
                      setBirthdayState(e.target.value)
                    }}
                    placeholder='Birthdate'
                    id='date'
                  />
                </div>
              </div>
              <div className='w-[100%] flex justify-end mr-24 gap-3 md:mr-[190px] lg:mr-[190px]'>
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

export default EditProfile
