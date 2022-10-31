import React from 'react'

export default function PartnersReadOnlyRow({ partner, handleDeleteClick, handleEditClick }) {
  return (
    <>
      <tr key={partner.id}>
        <td className='py-4 px-6 border border-slate-700'>{partner.username}</td>
        <td className='py-4 px-6 border border-slate-700'>{partner.firstname}</td>
        <td className='py-4 px-6 border border-slate-700'>{partner.lastname}</td>
        <td className='py-4 px-6 border border-slate-700'>{partner.initials}</td>
        <td className='py-4 px-6 border border-slate-700'>{partner.email}</td>
        <td className='py-4 px-6 border border-slate-700'>
          <button
            onClick={e => handleEditClick(e, partner)}
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white mr-1'
          >
            Edit
          </button>
          <button
            onClick={e => handleDeleteClick(partner.id)}
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  )
}
