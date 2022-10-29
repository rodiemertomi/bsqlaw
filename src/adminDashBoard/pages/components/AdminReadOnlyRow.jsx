import React from 'react'

export default function AdminReadOnlyRow({ admin, handleDeleteClick, handleEditClick }) {
  return (
    <>
      <tr key={admin.id}>
        <td className='py-4 px-6 border border-slate-700'>{admin.username}</td>
        <td className='py-4 px-6 border border-slate-700'>{admin.firstname}</td>
        <td className='py-4 px-6 border border-slate-700'>{admin.lastname}</td>
        <td className='py-4 px-6 border border-slate-700'>{admin.initials}</td>
        <td className='py-4 px-6 border border-slate-700'>{admin.email}</td>
        <td className='py-4 px-6 border border-slate-700'>
          <button
            onClick={e => handleEditClick(e, admin)}
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white mr-1'
          >
            Edit
          </button>
          <button
            onClick={e => handleDeleteClick(admin.id)}
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  )
}
