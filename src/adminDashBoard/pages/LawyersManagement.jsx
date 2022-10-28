import React, { useState, useEffect, Fragment } from 'react'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../firebase'
import LawyersEditRow from './components/LawyersEditRow'
import LawyersReadOnlyRow from './components/LawyersReadOnlyRow'

export default function LawyersManagement() {
  const colRef = collection(db, 'users')
  const lawyerRef = query(colRef, where('role', '==', 'lawyer'))
  const [loading, setLoading] = useState(false)
  const [lawyers, setClients] = useState([])
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
        role: 'lawyer',
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

  const [editLawyerId, setLawyerEditId] = useState(null)

  const handleEditClick = (e, lawyer) => {
    e.preventDefault()
    setLawyerEditId(lawyer.id)

    const formValues = {
      username: lawyer.username,
      firstname: lawyer.firstname,
      lastname: lawyer.lastname,
      initials: lawyer.initials,
      email: lawyer.email,
      role: lawyer.role,
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
    const docRef = doc(db, 'users', editLawyerId)

    const editedLawyer = {
      username: editFormData.username,
      firstname: editFormData.firstname,
      lastname: editFormData.lastname,
      initials: editFormData.initials,
      email: editFormData.email,
    }

    setDoc(docRef, editedLawyer, { merge: true }).then(() => {
      alert('Document updated Successfully')
    })

    setLawyerEditId(null)
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
    setLawyerEditId(null)
  }

  const handleDeleteClick = async clientId => {
    setLoading(true)
    await deleteDoc(doc(db, 'users', clientId))
    setLoading(false)
  }

  useEffect(() => {
    const getLawyers = async () => {
      const data = await getDocs(lawyerRef)
      setClients(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getLawyers()
  }, [])

  return (
    <>
      <div className='h-screen w-screen font-Lora'>
        <div className='m-1 lg:ml-24'>
          <h1 className='text-3xl font-bold'>Create Lawyer</h1>
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
          <h1 className='text-3xl font-bold pt-4'>Search Lawyer</h1>
          <input
            className='w-1/2 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Enter Username, Firstname, Lastname, Initials or Email...'
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
          />
          <div className='mt-5 flex flex-col justify-center items-center'>
            <div className='flex self-start'>
              <h1 className='font-semibold text-xl'>Lawyer Details</h1>
            </div>
            <div className='mt-2'>
              <form onSubmit={handleEditFormSubmit}>
                <table className='w-screen text-center'>
                  <thead>
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
                  <tbody>
                    {search(lawyers).map(lawyer => (
                      <Fragment key={lawyer.id}>
                        {editLawyerId === lawyer.id ? (
                          <tr>
                            <LawyersEditRow
                              editFormData={editFormData}
                              handleEditFormChange={handleEditFormChange}
                              handleCancelClick={handleCancelClick}
                            />
                          </tr>
                        ) : (
                          <tr>
                            <LawyersReadOnlyRow
                              lawyer={lawyer}
                              handleEditClick={handleEditClick}
                              handleDeleteClick={handleDeleteClick}
                            />
                          </tr>
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
