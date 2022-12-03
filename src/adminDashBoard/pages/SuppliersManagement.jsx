import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { db } from '../../firebase'
import SuppliersEditRow from './components/SuppliersEditRow'
import SuppliersReadOnlyRow from './components/SuppliersReadOnlyRow'

export default function SuppliersManagement() {
  const colRef = collection(db, 'users')
  const suppliersRef = query(colRef, where('role', '==', 'supplier'))
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const [addFormData, setAddFormData] = useState({
    username: '',
    role: 'supplier',
    contactNo: '',
    mailingaddress: '',
    company: '',
  })

  const [editFormData, setEditFormData] = useState({
    username: '',
    role: 'supplier',
    contactNo: '',
    mailingaddress: '',
    company: '',
  })

  const [editSupplierId, setEditSupplierId] = useState(null)

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
    if (!addFormData.username) return

    const newSupplier = {
      username: addFormData.username,
      role: addFormData.role,
      contactNo: addFormData.contactNo,
      mailingaddress: addFormData.mailingaddress,
      company: addFormData.company,
    }

    await addDoc(colRef, newSupplier).then(() => {
      setAddFormData({
        username: '',
        role: 'supplier',
        contactNo: '',
        mailingaddress: '',
        company: '',
      })
      getSuppliers()
      setLoading(false)
    })
    return
  }

  const handleEditFormSubmit = async e => {
    e.preventDefault()
    const docRef = doc(db, 'users', editSupplierId)

    const editedUser = {
      username: editFormData.username,
      mailingaddress: editFormData.mailingaddress,
      contactNo: editFormData.contactNo,
      company: editFormData.company,
    }

    await setDoc(docRef, editedUser, { merge: true }).then(() => {
      alert('Document updated Successfully')
      getSuppliers()
    })

    setEditSupplierId(null)
  }

  const handleEditClick = (e, supplier) => {
    e.preventDefault()
    setEditSupplierId(supplier.id)

    const formValues = {
      username: supplier.username,
      mailingaddress: supplier.mailingaddress,
      company: supplier.company,
      contactNo: supplier.contactNo,
    }

    setEditFormData(formValues)
  }

  const handleCancelClick = () => {
    setEditSupplierId(null)
  }

  const handleDeleteClick = async supplierId => {
    setLoading(true)
    if (window.confirm('Are you sure you want to delete this user?') === true) {
      await deleteDoc(doc(db, 'users', supplierId))
    }
    setLoading(false)
    return
  }

  const search = datas => {
    try {
      return datas.filter(
        data =>
          data.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.company.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.mailingaddress.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.contactNo.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    } catch (err) {
      alert(err.message)
    }
  }

  const getSuppliers = async () => {
    const data = await getDocs(suppliersRef)
    setSuppliers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getSuppliers()
  }, [])

  return (
    <>
      <div className='h-screen w-screen font-poppins pl-5 pr-5 lg:pr-24 pt-1 pb-24'>
        <div className='lg:ml-[83px]'>
          <h1 className='self-start text-[30px] font-bold'>Create Supplier</h1>
          <div>
            <form
              className='flex flex-col lg:flex-row gap-[1px] lg:gap-1'
              onSubmit={handleAddFormSubmit}
              action=''
            >
              <input
                className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[20%] h-8'
                type='text'
                name='username'
                value={addFormData.username}
                placeholder='Username'
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
              <span className='font-bold text-xl'>Search Supplier</span>
              <input
                className='lg:ml-2 w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-[49%]'
                type='text'
                placeholder='Enter Username, Firstname, Lastname, Email, Company or Assigned Lawyer...'
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='overflow-auto p-5 lg:ml-20 w-[100%] h-[78%] shadow-lg bg-maroon rounded-md lg:h-[90%] md:h-[86%]'>
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
                          Company Name
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Mailing Address
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Contact Number
                        </th>
                        <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {search(suppliers)?.map(supplier => (
                        <Fragment key={supplier.id}>
                          {editSupplierId === supplier.id ? (
                            <tr>
                              <SuppliersEditRow
                                editFormData={editFormData}
                                handleEditFormChange={handleEditFormChange}
                                handleCancelClick={handleCancelClick}
                              />
                            </tr>
                          ) : (
                            <tr>
                              <SuppliersReadOnlyRow
                                supplier={supplier}
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
