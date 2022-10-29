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
import ClientsEditRow from './components/ClientsEditRow'
import ClientsReadOnlyRow from './components/ClientsReadOnlyRow'

export default function ClientsManagement() {
  const colRef = collection(db, 'users')
  const clientRef = query(colRef, where('role', '==', 'client'))
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])

  const [addFormData, setAddFormData] = useState({
    username: '',
    email: '',
    role: 'client',
    birthday: new Date(),
    contactno: '',
    firstname: '',
    gender: '',
    lastname: '',
    lawyer: '',
    password: '',
  })

  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: '',
  })

  const [editClientId, setEditClientId] = useState(null)

  const handleAddFormChange = e => {
    e.preventDefault()

    const fieldName = e.target.getAttribute('name')
    const fieldValue = e.target.value

    const newFormData = { ...addFormData }
    newFormData[fieldName] = fieldValue

    setAddFormData(newFormData)
  }

  const handleEditFormChange = e => {
    e.preventDefault()

    const fieldName = e.target.getAttribute('name')
    const fieldValue = e.target.value

    const newFormData = { ...editFormData }
    newFormData[fieldName] = fieldValue

    setEditFormData(newFormData)
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
        role: 'client',
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

  const handleEditFormSubmit = e => {
    e.preventDefault()
    const docRef = doc(db, 'users', editClientId)

    const editedUser = {
      username: editFormData.username,
      email: editFormData.email,
      role: editFormData.role,
    }

    setDoc(docRef, editedUser, { merge: true }).then(() => {
      alert('Document updated Successfully')
    })

    setEditClientId(null)
  }

  const handleEditClick = (e, client) => {
    e.preventDefault()
    setEditClientId(client.id)

    const formValues = {
      username: client.username,
      email: client.email,
      role: client.role,
    }

    setEditFormData(formValues)
  }

  const handleCancelClick = () => {
    setEditClientId(null)
  }

  const handleDeleteClick = async clientId => {
    setLoading(true)
    await deleteDoc(doc(db, 'users', clientId))
    setLoading(false)
  }

  useEffect(() => {
    const getClients = async () => {
      const data = await getDocs(clientRef)
      setClients(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getClients()
  }, [])

  return (
    <>
      <div className='h-screen w-screen pl-5 pr-5 lg:pr-24 pt-1 pb-24'>
        <div className='lg:ml-[83px]'>
          <h1 className='self-start text-[30px] font-bold'>Create Client</h1>
          <div>
            <form
              className='flex flex-col lg:flex-row gap-[1px] lg:gap-1'
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
                className={`w-28 h-8 lg:self-center rounded-md border-0 bg-maroon text-white ${
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
        <div className='overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[78%] shadow-lg bg-[#D9D9D9] rounded-md lg:h-[92%] md:h-[86%]'>
          <div className='flex flex-col justify-center'>
            {/* CLIENT DETAILS */}
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
                          Assigned Lawyer
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Email Address
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients?.map(client => (
                        <Fragment key={client.id}>
                          {editClientId === client.id ? (
                            <tr>
                              <ClientsEditRow
                                editFormData={editFormData}
                                handleEditFormChange={handleEditFormChange}
                                handleCancelClick={handleCancelClick}
                              />
                            </tr>
                          ) : (
                            <tr>
                              <ClientsReadOnlyRow
                                client={client}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                              />
                            </tr>
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
