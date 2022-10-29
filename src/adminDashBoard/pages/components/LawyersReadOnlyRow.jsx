import React from 'react'

export default function LawyersReadOnlyRow({ lawyer, handleEditClick, handleDeleteClick }) {
  return (
    <>
      <td className='py-4 px-6 border border-slate-700'>{lawyer.username}</td>
      <td className='py-4 px-6 border border-slate-700'>{lawyer.firstname}</td>
      <td className='py-4 px-6 border border-slate-700'>{lawyer.lastname}</td>
      <td className='py-4 px-6 border border-slate-700'>{lawyer.initials}</td>
      <td className='py-4 px-6 border border-slate-700'>{lawyer.email}</td>
      <td className='py-4 px-6 border border-slate-700'>
        <button
          onClick={e => handleEditClick(e, lawyer)}
          className='w-14 h-8 rounded-md border-0 mr-1 bg-maroon text-white'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteClick(lawyer.id)}
          className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
        >
          Delete
        </button>
      </td>
    </>
  )
}
