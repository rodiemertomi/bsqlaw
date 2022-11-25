import React, { useState, useEffect, Fragment } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore'
import { db } from '../../firebase'
import PartnersEditRow from './components/PartnersEditRow'
import PartnersReadOnlyRow from './components/PartnersReadOnlyRow'

export default function PartnersManagement() {
  const colRef = collection(db, 'users')
  const partnersRef = query(colRef, where('role', '==', 'partner'))
  const [loading, setLoading] = useState(false)
  const [partners, setPartners] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const [addFormData, setAddFormData] = useState({
    username: '',
    email: '',
    role: 'partner',
    contactNo: '',
    firstname: '',
    gender: '',
    lastname: '',
    lawyer: '',
    password: '',
  })

  const handleAddFormChange = e => {
    e.preventDefault()

    const fieldName = e.target.getAttribute('name')
    const fieldValue = e.target.value

    const newFormData = { ...addFormData }
    newFormData[fieldName] = fieldValue

    setAddFormData(newFormData)
  }

  const handleAddFormSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    if (!addFormData.email || !addFormData.username || !addFormData.password) return

    const newClient = {
      username: addFormData.username,
      email: addFormData.email,
      role: addFormData.role,
      password: addFormData.password,
      contactNo: addFormData.contactNo,
      gender: addFormData.gender,
      firstname: addFormData.firstname,
      lastname: addFormData.lastname,
    }

    try {
      await addDoc(colRef, newClient)
      setAddFormData({
        username: '',
        email: '',
        role: 'partner',
        password: '',
        contactNo: '',
        firstname: '',
        gender: '',
        lastname: '',
        lawyer: '',
      })
    } catch (err) {
      alert(err.message)
    }
    getPartners()
    setLoading(false)
  }

  const [editFormData, setEditFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    initials: '',
    email: '',
    role: '',
  })

  const [editPartnerId, setEditPartnerId] = useState(null)

  const handleEditClick = (e, admin) => {
    e.preventDefault()
    setEditPartnerId(admin.id)

    const formValues = {
      username: admin.username,
      firstname: admin.firstname,
      lastname: admin.lastname,
      initials: admin.initials,
      email: admin.email,
      role: admin.role,
    }

    setEditFormData(formValues)
  }

  const handleEditFormChange = e => {
    e.preventDefault()

    const fieldName = e.target.getAttribute('name')
    const fieldValue = e.target.value

    const newFormData = { ...editFormData }
    newFormData[fieldName] = fieldValue

    setEditFormData(newFormData)
  }

  const handleEditFormSubmit = e => {
    e.preventDefault()
    const docRef = doc(db, 'users', editPartnerId)

    const editedAdmin = {
      username: editFormData.username,
      firstname: editFormData.firstname,
      lastname: editFormData.lastname,
      initials: editFormData.initials,
      email: editFormData.email,
    }

    setDoc(docRef, editedAdmin, { merge: true }).then(() => {
      alert('Document updated Successfully')
    })

    setEditPartnerId(null)
  }

  const search = datas => {
    try {
      return datas.filter(
        data =>
          data.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.firstname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.lastname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.initials.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCancelClick = () => {
    setEditPartnerId(null)
  }

  const handleDeleteClick = async clientId => {
    setLoading(true)
    if (window.confirm('Are you sure you want to delete this user?') === true) {
      await deleteDoc(doc(db, 'users', clientId))
    }
    setLoading(false)
    getPartners()
    return
  }

  const getPartners = async () => {
    try {
      const data = await getDocs(partnersRef)
      setPartners(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    getPartners()
  }, [])

  return (
    <>
      <div className='h-screen w-screen font-poppins pl-5 pr-5 lg:pr-24 pt-1 pb-24'>
        <div className='lg:ml-[83px]'>
          <h1 className='self-start text-[30px] font-bold'>Create Partner</h1>
          <div>
            <form
              className='flex flex-col lg:flex-row gap-2'
              onSubmit={handleAddFormSubmit}
              action=''
            >
              <input
                className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[20%] h-8'
                type='email'
                name='email'
                value={addFormData.email}
                placeholder='Email'
                onChange={handleAddFormChange}
              />
              <input
                className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[20%] h-8'
                type='text'
                name='username'
                value={addFormData.username}
                placeholder='Username'
                onChange={handleAddFormChange}
              />
              <input
                className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[20%] h-8'
                type='password'
                name='password'
                value={addFormData.password}
                placeholder='Password'
                onChange={handleAddFormChange}
              />
              <button
                className={`font-semibold w-[60%] md:w-[30%] lg:w-[15%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center ${
                  loading ? 'cursor-wait' : 'cursor-pointer'
                }`}
                type='submit'
                disabled={loading}
              >
                Create New
              </button>
            </form>
            <div>
              <span className='font-bold text-xl'>Search Partner</span>
              <input
                className=' lg:ml-2 md:ml-2 w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[49%]'
                type='text'
                placeholder='Enter Username, Firstname, Lastname, Initials or Email...'
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[78%] shadow-lg bg-maroon rounded-md lg:h-[90%] md:h-[86%]'>
          <div className=' flex flex-col justify-center'>
            {/* ADMIN DETAILS */}
            <div>
              <form onSubmit={handleEditFormSubmit}>
                <div className='overflow-x-auto relative bg-white shadow-lg sm:rounded-lg p-2'>
                  <table className='w-full text-sm text-center text-gray-500 border-collapse border border-slate-500 mt-2 mb-2'>
                    <thead className={`text-xs text-gray-700 `}>
                      <tr>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Username
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          First Name
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Last Name
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Initials
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Email Address
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    {/* {loading ? ( */}
                    <tbody>
                      {search(partners).map(partner => (
                        <Fragment key={partner.id}>
                          {editPartnerId === partner.id ? (
                            <PartnersEditRow
                              partner={partner}
                              editFormData={editFormData}
                              handleEditFormChange={handleEditFormChange}
                              handleCancelClick={handleCancelClick}
                            />
                          ) : (
                            <PartnersReadOnlyRow
                              partner={partner}
                              handleEditClick={handleEditClick}
                              handleDeleteClick={handleDeleteClick}
                            />
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
