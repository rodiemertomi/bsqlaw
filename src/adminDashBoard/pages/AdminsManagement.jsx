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
      <div className='h-screen w-screen'>
        <div className='m-1 lg:ml-24'>
          <h1 className='text-3xl font-bold'>Create Admin</h1>
          <div className='mt-5'>
            <input
              className='w-1/2 py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='text'
              placeholder='Enter Username, Email or Expertise...'
              value={searchKeyword}
              onChange={handleSearch}
            />
          </div>

          <div className='mt-5 flex flex-col justify-center items-center'>
            <div className='flex self-start'>
              <h1 className='font-semibold text-xl'>Admin Details</h1>
            </div>
            {/* ADMIN DETAILS */}
            <div className='mt-2 xl:ml-40'>
              <form onSubmit={handleEditFormSubmit}>
                <table className='w-screen'>
                  <thead className={`w-screen`}>
                    <tr className={`flex text-left w-screen justify-around`}>
                      <th className={`text-left w-1/4`}>Username</th>
                      <th className={`text-left w-1/4`}>Email Address</th>
                      <th className={`text-left w-1/4`}>Role</th>
                      <th className={`text-left w-1/4`}>Expertise</th>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
