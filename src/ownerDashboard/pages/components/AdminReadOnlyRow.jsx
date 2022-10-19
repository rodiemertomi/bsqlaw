import React from 'react'

export default function AdminReadOnlyRow({ admin, handleEditClick, handleDeleteClick }) {
  return (
    <>
      <td>{admin.username}</td>
      <td>{admin.email}</td>
      <td>{admin.role}</td>
      <td>
        <button
          onClick={e => handleEditClick(e, admin)}
          className='w-16 h-7 rounded-md border-0 bg-maroon text-white'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteClick(admin.id)}
          className='w-20 h-7 rounded-md border-0 bg-maroon text-white'
        >
          Delete
        </button>
      </td>
    </>
  )
}
