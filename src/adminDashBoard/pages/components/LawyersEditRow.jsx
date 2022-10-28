import React from 'react'
export default function ClientsEditRow({ editFormData, handleEditFormChange, handleCancelClick }) {
  return (
    <>
      <td>
        <input
          className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Username'
          name='username'
          value={editFormData.username}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='First Name'
          name='firstname'
          value={editFormData.firstname}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Last Name'
          name='lastname'
          value={editFormData.lastname}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Initials'
          name='initials'
          value={editFormData.initials}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Email'
          name='email'
          value={editFormData.email}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <button className='w-16 h-7 rounded-md border-0 bg-maroon text-white' type='submit'>
          Save
        </button>
        <button
          className='w-16 h-7 rounded-md border-0 bg-maroon text-white'
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </td>
    </>
  )
}
