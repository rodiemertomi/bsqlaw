import React from 'react'

export default function AdminEditRow({ editFormData, handleEditFormChange, handleCancelClick }) {
  return (
    <>
      <td>
        <input
          type='text'
          placeholder='Username'
          name='username'
          value={editFormData.username}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          placeholder='Email'
          name='email'
          value={editFormData.email}
          onChange={handleEditFormChange}
        />
      </td>
      <td>
        <input
          type='text'
          placeholder='Role'
          name='role'
          value={editFormData.role}
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
