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
import AdminEditRow from './components/AdminEditRow'
import AdminReadOnlyRow from './components/AdminReadOnlyRow'

export default function AdminsManagement() {
  const colRef = collection(db, 'users')
  const adminRef = query(colRef, where('role', '==', 'admin'))
  const [loading, setLoading] = useState(false)
  const [admins, setAdmins] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const [addFormData, setAddFormData] = useState({
    username: '',
    email: '',
    role: 'lawyer',
    birthday: new Date(),
    contactno: '',
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
      birthday: addFormData.birthday,
      contactno: addFormData.contactno,
      gender: addFormData.gender,
      firstname: addFormData.firstname,
      lastname: addFormData.lastname,
    }

    try {
      await addDoc(colRef, newClient)
      setAddFormData({
        username: '',
        email: '',
        role: 'admin',
        password: '',
        birthday: new Date(),
        contactno: '',
        firstname: '',
        gender: '',
        lastname: '',
        lawyer: '',
      })
    } catch (err) {
      alert(err.message)
    }
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

  const [editAdminId, setEditAdminId] = useState(null)

  const handleEditClick = (e, admin) => {
    e.preventDefault()
    setEditAdminId(admin.id)

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
    const docRef = doc(db, 'users', editAdminId)

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

    setEditAdminId(null)
  }

  const search = datas => {
    try {
      return datas.filter(
        data =>
          data.username.toLowerCase().includes(searchKeyword) ||
          data.email.toLowerCase().includes(searchKeyword) ||
          data.firstname.toLowerCase().includes(searchKeyword) ||
          data.lastname.toLowerCase().includes(searchKeyword) ||
          data.initials.toLowerCase().includes(searchKeyword)
      )
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCancelClick = () => {
    setEditAdminId(null)
  }

  const handleDeleteClick = async clientId => {
    setLoading(true)
    await deleteDoc(doc(db, 'users', clientId))
    setLoading(false)
  }

  useEffect(() => {
    const getAdmins = async () => {
      try {
        const data = await getDocs(adminRef)
        setAdmins(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      } catch (err) {
        alert(err.message)
      }
    }

    getAdmins()
  }, [])

  return (
    <>
      <div className='h-screen w-screen pl-5 pr-3 pt-1 mb-20'>
        <div className='lg:ml-[83px]'>
          <h1 className='self-start text-[30px] font-bold'>Create Admin</h1>
          <div>
            <form
              className='flex flex-col lg:flex-row gap-2'
              onSubmit={handleAddFormSubmit}
              action=''
            >
              <input
                className='w-3/4 pl-2 lg:w-[20%]  rounded-md border-2 border-gray'
                type='email'
                name='email'
                value={addFormData.email}
                placeholder='Email'
                onChange={handleAddFormChange}
              />
              <input
                className='w-3/4 pl-2 lg:w-[20%] rounded-md border-2 border-gray'
                type='text'
                name='username'
                value={addFormData.username}
                placeholder='Username'
                onChange={handleAddFormChange}
              />
              <input
                className='w-3/4 pl-2 lg:w-[20%] rounded-md border-2 border-gray'
                type='password'
                name='password'
                value={addFormData.password}
                placeholder='Password'
                onChange={handleAddFormChange}
              />
              <button
                className={`w-28 h-7 rounded-md border-0 bg-maroon text-white ${
                  loading ? 'cursor-wait' : 'cursor-pointer'
                }`}
                type='submit'
                disabled={loading}
              >
                Create New
              </button>
            </form>
            <div>
              <input
                className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[40.5%]'
                type='text'
                placeholder='Enter Username, Firstname, Lastname, Initials or Email...'
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[78%] shadow-lg bg-[#D9D9D9] rounded-md lg:w-[94%] lg:h-[90%] md:h-[86%]'>
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
                      {search(admins).map(admin => (
                        <Fragment key={admin.id}>
                          {editAdminId === admin.id ? (
                            <AdminEditRow
                              admin={admin}
                              editFormData={editFormData}
                              handleEditFormChange={handleEditFormChange}
                              handleCancelClick={handleCancelClick}
                            />
                          ) : (
                            <AdminReadOnlyRow
                              admin={admin}
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
