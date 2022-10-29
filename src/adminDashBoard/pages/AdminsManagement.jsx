import React, { useState, useEffect, Fragment } from 'react'
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminEditRow from './components/AdminEditRow'
import AdminReadOnlyRow from './components/AdminReadOnlyRow'

export default function AdminsManagement() {
  const colRef = collection(db, 'users')
  const adminRef = query(colRef, where('role', '==', 'admin'))
  const [searchKeyword, setSearchKeyword] = useState('')
  const [role, setRole] = useState()
  const [admins, setAdmins] = useState([])

  const [editFormData, setEditFormData] = useState({
    role: '',
  })

  const [editAdminId, setEditAdminId] = useState(null)

  const handleEdit = e => {
    const selectedOption = e.target.value
    setRole(selectedOption)
  }

  const handleEditFormSubmit = e => {
    e.preventDefault()
    const docRef = doc(db, 'users', editAdminId)

    const editedAdmin = {
      role: role,
    }

    setDoc(docRef, editedAdmin, { merge: true }).then(() => {
      alert('Document updated Successfully')
    })

    setEditAdminId(null)
  }

  const handleEditClick = (e, admin) => {
    e.preventDefault()
    setEditAdminId(admin.id)

    const formValues = {
      role: admin.role,
    }

    setEditFormData(formValues)
  }

  const handleCancelClick = () => {
    setEditAdminId(null)
  }

  const handleSearch = e => {
    e.preventDefault()

    setSearchKeyword(e.target.value)
  }

  const search = datas => {
    try {
      return datas.filter(
        data =>
          data.username.toLowerCase().includes(searchKeyword) ||
          data.email.toLowerCase().includes(searchKeyword) ||
          data.expertise.some(item => item.toLowerCase().includes(searchKeyword))
      )
    } catch (err) {
      alert(err.message)
    }
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
  }, [adminRef])

  return (
    <>
      <div className='h-screen w-screen p-5'>
        <h1 className='self-start text-[30px] font-bold lg:ml-20'>Create Admin</h1>
        <div>
          <input
            className='w-3/4 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline lg:w-1/2 lg:ml-[81px]'
            type='text'
            placeholder='Enter Username, Email or Expertise...'
            value={searchKeyword}
            onChange={handleSearch}
          />
        </div>
        <div className='overflow-auto scrollbar-hide p-5 lg:ml-20 w-[100%] h-[88%] shadow-lg bg-[#D9D9D9] rounded-md lg:w-[94%] lg:h-[85%] md:h-[92%]'>
          <div className='flex flex-col justify-center'>
            {/* ADMIN DETAILS */}
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
                        <th
                          th
                          scope='col'
                          className='py-3 px-6 lg:text-sm   border border-slate-600'
                        >
                          Expertise
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
                              handleEdit={handleEdit}
                              handleCancelClick={handleCancelClick}
                            />
                          ) : (
                            <AdminReadOnlyRow
                              admin={admin}
                              handleEditClick={handleEditClick}
                              searchKeyword={searchKeyword}
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
