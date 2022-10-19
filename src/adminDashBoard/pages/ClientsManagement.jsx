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
      console.log(err.message)
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
      console.log('Document updated Successfully')
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
      <div className='h-screen w-screen font-Lora'>
        <div className='m-1 lg:ml-24'>
          <h1 className='text-3xl font-bold'>Create Client</h1>
          <div className='mt-5'>
            <form onSubmit={handleAddFormSubmit} action=''>
              <label className='text-semibold text-lg' htmlFor='email'>
                Email:
              </label>
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
          <div className='mt-5 flex flex-col justify-center items-center'>
            <div className='flex self-start'>
              <h1 className='font-semibold text-xl'>Client Details</h1>
            </div>
            <div className='mt-2'>
              <form onSubmit={handleEditFormSubmit}>
                <table className='w-screen text-center'>
                  <thead>
                    <tr>
                      <th className='p-2'>Username</th>
                      <th className='p-2'>Email Address</th>
                      <th className='p-2'>Role</th>
                    </tr>
                  </thead>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
