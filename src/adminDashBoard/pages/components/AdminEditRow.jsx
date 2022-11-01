import React from 'react'

export default function AdminEditRow({ editFormData, handleCancelClick, handleEditFormChange }) {
  return (
    <>
      <tr>
        <td className='py-4 px-6 border border-slate-700'>
          <input
            className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Username'
            name='username'
            value={editFormData.username}
            onChange={handleEditFormChange}
          />
        </td>
        <td className='py-4 px-6 border border-slate-700'>
          <input
            className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='First Name'
            name='firstname'
            value={editFormData.firstname}
            onChange={handleEditFormChange}
          />
        </td>
        <td className='py-4 px-6 border border-slate-700'>
          <input
            className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Last Name'
            name='lastname'
            value={editFormData.lastname}
            onChange={handleEditFormChange}
          />
        </td>
        <td className='py-4 px-6 border border-slate-700'>
          <input
            className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Initials'
            name='initials'
            value={editFormData.initials}
            onChange={handleEditFormChange}
          />
        </td>
        <td className='py-4 px-6 border border-slate-700'>
          <input
            className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Email'
            name='email'
            value={editFormData.email}
            onChange={handleEditFormChange}
          />
        </td>
        <td className='py-4 px-6 border border-slate-700'>
          <div className='flex items-center justify-center'>
            <button
              className='w-14 h-8 rounded-md border-0 mr-1 bg-maroon text-white'
              type='submit'
            >
              Save
            </button>
            <button
              className='w-16 h-8 rounded-md border-0 bg-maroon text-white'
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    </>
  )
}
