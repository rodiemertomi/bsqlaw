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
  const [searchKeyword, setSearchKeyword] = useState('')

  const [addFormData, setAddFormData] = useState({
    username: '',
    email: '',
    role: 'client',
    contactNo: '',
    firstname: '',
    gender: '',
    lastname: '',
    lawyer: [],
    password: '',
    contactperson: '',
    mailingaddress: '',
    company: '',
  })

  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: 'client',
    contactNo: '',
    firstname: '',
    gender: '',
    lastname: '',
    lawyer: [],
    password: '',
    contactperson: '',
    mailingaddress: '',
    company: '',
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
      contactNo: addFormData.contactNo,
      gender: addFormData.gender,
      firstname: addFormData.firstname,
      lastname: addFormData.lastname,
      mailingaddress: addFormData.mailingaddress,
      contactperson: addFormData.contactperson,
      lawyer: addFormData.lawyer,
      company: addFormData.company,
    }

    try {
      await addDoc(colRef, newClient).then(() => {
        setAddFormData({
          username: '',
          email: '',
          role: 'client',
          password: '',
          contactNo: '',
          firstname: '',
          gender: '',
          lastname: '',
          lawyer: [],
          mailingaddress: '',
          contactperson: '',
          company: '',
        })
        getClients()
      })
    } catch (err) {
      alert(err.message)
    }
    setLoading(false)
  }

  const handleEditFormSubmit = async e => {
    e.preventDefault()
    const docRef = doc(db, 'users', editClientId)

    const editedUser = {
      username: editFormData.username,
      firstname: editFormData.firstname,
      lastname: editFormData.lastname,
      email: editFormData.email,
      mailingaddress: editFormData.mailingaddress,
      contactperson: editFormData.contactperson,
      company: editFormData.company,
    }

    await setDoc(docRef, editedUser, { merge: true }).then(() => {
      alert('Document updated Successfully')
      getClients()
    })

    setEditClientId(null)
  }

  const handleEditClick = (e, client) => {
    e.preventDefault()
    setEditClientId(client.id)

    const formValues = {
      username: client.username,
      firstname: client.firstname,
      lastname: client.lastname,
      email: client.email,
      lawyer: client.lawyer,
      mailingaddress: client.mailingaddress,
      contactperson: client.contactperson,
      company: client.company,
    }

    setEditFormData(formValues)
  }

  const handleCancelClick = () => {
    setEditClientId(null)
  }

  const handleDeleteClick = async clientId => {
    setLoading(true)
    if (window.confirm('Are you sure you want to delete this user?') === true) {
      await deleteDoc(doc(db, 'users', clientId))
    }
    setLoading(false)
    return
  }

  const search = datas => {
    try {
      return datas.filter(
        data =>
          data.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.firstname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.lastname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.lawyer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.company.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    } catch (err) {
      alert(err.message)
    }
  }

  const getClients = async () => {
    const data = await getDocs(clientRef)
    setClients(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
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
                className={`font-semibold w-[60%] md:w-[30%] lg:w-[10%] h-10 transition-all duration-200 rounded-3xl border-gray border-2 bg-maroon shadow-lg hover:font-semibold hover:bg-[#471414] text-white md:text-sm md:py-3 md:px-4 flex gap-[1px] justify-center items-center ${
                  loading ? 'cursor-wait' : 'cursor-pointer'
                }`}
                type='submit'
                disabled={loading}
              >
                Create New
              </button>
            </form>
            <div>
              <span className='font-bold text-xl'>Search Client</span>
              <input
                className='lg:ml-2 w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[49%]'
                type='text'
                placeholder='Enter Username, Firstname, Lastname, Appointed Lawyer or Email...'
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[78%] shadow-lg bg-maroon rounded-md lg:h-[90%] md:h-[86%]'>
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
                          Company Name
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Assigned Lawyer
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Email Address
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Mailing Address
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Contact Person
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {search(clients)?.map(client => (
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
