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
      <div className='h-screen w-screen p-5'>
        <div className='m-1 lg:ml-24'>
          <h1 className='text-3xl font-bold'>Create Admin</h1>
          <div className='mt-5'>
            <form onSubmit={handleAddFormSubmit} action=''>
              <input
                className='w-38 pl-2 ml-2 rounded-md border-2 border-gray'
                type='email'
                name='email'
                value={addFormData.email}
                placeholder='Email'
                onChange={handleAddFormChange}
              />
              <input
                className='w-38 pl-2 ml-2 rounded-md border-2 border-gray'
                type='text'
                name='username'
                value={addFormData.username}
                placeholder='Username'
                onChange={handleAddFormChange}
              />
              <input
                className='w-38 pl-2 ml-2 rounded-md border-2 border-gray'
                type='password'
                name='password'
                value={addFormData.password}
                placeholder='Password'
                onChange={handleAddFormChange}
              />
              <button
                className={`w-28 h-7 rounded-md border-0 bg-maroon text-white ml-2 ${
                  loading ? 'cursor-wait' : 'cursor-pointer'
                }`}
                type='submit'
                disabled={loading}
              >
                Create New
              </button>
            </form>
          </div>
        </div>
        <div className='mt-2 overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[100%] shadow-lg bg-[#D9D9D9] rounded-md lg:w-[94%] lg:h-[93%]'>
          <div>
            <h1 className='text-3xl font-bold pt-4'>Search Admin</h1>
            <input
              className='w-1/2 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='text'
              placeholder='Enter Username, Firstname, Lastname, Initials or Email...'
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className='mt-2 flex flex-col justify-center'>
            <div className='flex self-start'>
              <h1 className='font-semibold text-xl'>Admin Details</h1>
            </div>
            {/* ADMIN DETAILS */}
            <div className='mt-2'>
              <form onSubmit={handleEditFormSubmit}>
                <table className='w-full text-xs text-center lg:text-sm lg:ml-2 border-collapse border border-slate-500 mt-2 mb-2'>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
