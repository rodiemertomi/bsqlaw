import React from 'react'

export default function LawyersReadOnlyRow({ lawyer, handleEditClick, handleDeleteClick }) {
  return (
    <>
      <td>{lawyer.username}</td>
      <td>{lawyer.firstname}</td>
      <td>{lawyer.lastname}</td>
      <td>{lawyer.initials}</td>
      <td>{lawyer.email}</td>
      <td>
        <button
          onClick={e => handleEditClick(e, lawyer)}
          className='w-16 h-7 rounded-md border-0 bg-maroon text-white'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteClick(lawyer.id)}
          className='w-20 h-7 rounded-md border-0 bg-maroon text-white'
        >
          Delete
        </button>
      </td>
    </>
  )
}
