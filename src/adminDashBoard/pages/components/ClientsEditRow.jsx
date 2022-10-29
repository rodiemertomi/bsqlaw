import React from 'react'

export default function ClientsEditRow({ editFormData, handleEditFormChange, handleCancelClick }) {
  return (
    <>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Username'
          name='username'
          value={editFormData.username}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'></td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Role'
          name='role'
          value={editFormData.role}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'></td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Email'
          name='email'
          value={editFormData.email}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <div className='flex'>
          <button className='w-14 h-8 rounded-md border-0 bg-maroon mr-1 text-white' type='submit'>
            Save
          </button>
          <button
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </td>
    </>
  )
}
