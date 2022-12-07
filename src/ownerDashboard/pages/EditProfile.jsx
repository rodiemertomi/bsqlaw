import React, { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

function EditProfile({ closeModal }) {
  const { username, id, photoURL, firstName, lastName, contactNo, gender, initials } =
    UseUserReducer()

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [firstNameState, setFirstNameState] = useState(firstName)
  const [lastNameState, setLastNameState] = useState(lastName)
  const [contactNoState, setContactNumberState] = useState(contactNo)
  const [initialsState, setInitialsState] = useState(initials)
  const [genderState, setGenderState] = useState(gender)
  const [photoURLState, setPhotoURLState] = useState(photoURL)

  const handleImageChange = async () => {
    if (image == null) return
    const fileUrl = `photos/${username}/${image.name}`
    const imgRef = ref(storage, fileUrl)
    await uploadBytes(imgRef, image).then(snapshot => {
      getDownloadURL(snapshot.ref).then(url => {
        setPhotoURLState(url)
      })
    })
  }

  const handleSave = async () => {
    setLoading(true)
    const docRef = doc(db, `users/${id}`)
    let data = {}
    if (photoURLState === '' || photoURLState === null || !photoURLState) {
      data = {
        firstname: firstNameState,
        lastname: lastNameState,
        contactNo: contactNoState,
        gender: genderState,
        initials: initialsState,
      }
    } else
      data = {
        firstname: firstNameState,
        lastname: lastNameState,
        contactNo: contactNoState,
        gender: genderState,
        initials: initialsState,
        photoURL: photoURLState,
      }
    setDoc(docRef, data, { merge: true }).then(() => {
      alert('Updated profile successfully.')
      window.location.reload(false)
    })
    closeModal(false)
    setLoading(false)
  }

  useEffect(() => {
    handleImageChange()
  }, [image])

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-modalbg'>
      <div className='bg-[#e1dfdf] animate-[popUp_0.3s_ease-in-out] shadow-2xl w-[85%] h-[80%] flex flex-col items-center justify-center rounded-lg md:h-[95%] lg:h-[620px] lg:w-[520px] lg:gap-3'>
        <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='font-bold text-2xl'>Edit Profile</h1>
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
              className='w-[200px] h-[200px] object-cover z-0 rounded-full'
              src={
                photoURLState === '' || !photoURLState
                  ? require('../../assets/user.png')
                  : `${photoURLState}`
              }
            />
            <div
              className='w-[200px] h-[200px] rounded-full hover:bg-[#000000] opacity-0 hover:opacity-80 cursor-pointer text-transparent hover:object-center hover:text-white
              transition-all absolute flex justify-center items-center'
            >
              <label htmlFor='file' className='cursor-pointer absolute z-[1000]'>
                <span>Change Image</span>
              </label>
            </div>
          </div>
          <div className='w-[100%] flex flex-col gap-2'>
            <div className='flex flex-col items-center w-[100%] gap-2 mt-2'>
              <input
                required
                value={firstNameState}
                onChange={e => setFirstNameState(e.target.value)}
                type='text'
                name='firstname'
                placeholder='First Name'
                className=' h-9 pl-4 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <input
                required
                value={lastNameState}
                onChange={e => setLastNameState(e.target.value)}
                type='text'
                name='lastname'
                placeholder='Last Name'
                className=' h-9  pl-4 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              <input
                required
                value={initialsState}
                onChange={e => setInitialsState(e.target.value)}
                type='text'
                name='initials'
                placeholder='Initials'
                className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            <div className='flex flex-col items-center w-[100%] gap-3 '>
              <input
                required
                value={contactNoState}
                onChange={e => setContactNumberState(e.target.value)}
                type='tel'
                name='phone'
                placeholder='Contact Number'
                className=' h-9  pl-4 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />

              <select
                name='gender'
                onChange={e => setGenderState(e.target.value)}
                id='gender'
                className='h-9 pl-4 w-full  shadow border-[1px] border-gray rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
              >
                {gender === '' || !gender ? (
                  <>
                    <option defaultValue value=''>
                      Select Gender
                    </option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Others'>Others</option>
                  </>
                ) : gender !== '' && gender === 'Male' ? (
                  <>
                    <option defaultValue value='Male'>
                      Male
                    </option>
                    <option value='Female'>Female</option>
                    <option value='Others'>Others</option>
                  </>
                ) : gender !== '' && gender === 'Female' ? (
                  <>
                    <option value='Male'>Male</option>
                    <option defaultValue value='Female'>
                      Female
                    </option>
                    <option value='Others'>Others</option>
                  </>
                ) : (
                  <>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option defaultValue value='Others'>
                      Others
                    </option>
                  </>
                )}
              </select>
              <div className='w-[100%] flex justify-center gap-2 mt-1'>
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
