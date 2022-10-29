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
    if (!addFormData.email || !addFormData.username) return

    const newClient = {
      username: addFormData.username,
      email: addFormData.email,
      role: addFormData.role,
    }

    try {
      await addDoc(colRef, newClient)
      setAddFormData({
        username: '',
        email: '',
        role: 'client',
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

    setDoc(docRef, editedUser, { merge: true }).then(docRef => {
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
    await deleteDoc(doc(db, 'users', clientId))
  }

  useEffect(() => {
    const getAdmins = async () => {
      const data = await getDocs(clientRef)
      setClients(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getAdmins()
  }, [clientRef])

  useEffect(() => {
    const getClients = async () => {
      const data = await getDocs(clientRef)
      setClients(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getClients()
  }, [clientRef])

  return (
    <>
      <div className='h-screen w-screen p-5'>
        <h1 className='self-start text-[30px] font-bold lg:ml-20'>Create Client</h1>
        <div>
          <form
            onSubmit={handleAddFormSubmit}
            action=''
            className='flex flex-col lg:flex-row gap-2'
          >
            <input
              className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[30%] lg:ml-[81px]'
              type='email'
              name='email'
              value={addFormData.email}
              placeholder='Email'
              onChange={handleAddFormChange}
            />
            <input
              className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[30%]'
              type='text'
              name='username'
              value={addFormData.username}
              placeholder='Username'
              onChange={handleAddFormChange}
            />
            <button
              className={`w-[120px] h-[37px] mt-2 rounded-md border-0 bg-maroon text-white ${
                loading ? 'cursor-wait' : 'cursor-pointer'
              }`}
              type='submit'
              disabled={loading}
            >
              Create New
            </button>
          </form>
        </div>
        <div className='overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[88%] shadow-lg bg-[#D9D9D9] rounded-md lg:w-[94%] lg:h-[85%] md:h-[92%]'>
          <div className='flex flex-col justify-center'>
            {/* CLIENT DETAILS */}
            <div>
              <form onSubmit={handleEditFormSubmit}>
                <div className='overflow-x-auto relative bg-white shadow-lg sm:rounded-lg p-2'>
                  <table className='w-full text-sm text-center text-gray-500 border-collapse border border-slate-500 mt-2 mb-2'>
                    <thead className={`text-xs text-gray-700 `}>
                      <tr>
                        <th
                          th
                          scope='col'
                          className='py-3 px-6 lg:text-sm   border border-slate-600'
                        >
                          Username
                        </th>
                        <th
                          th
                          scope='col'
                          className='py-3 px-6 lg:text-sm   border border-slate-600'
                        >
                          Email Address
                        </th>
                        <th
                          th
                          scope='col'
                          className='py-3 px-6 lg:text-sm   border border-slate-600'
                        >
                          Role
                        </th>
                      </tr>
                    </thead>
                    {/* {loading ? ( */}
                    <tbody>
                      {clients.map(client => (
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
