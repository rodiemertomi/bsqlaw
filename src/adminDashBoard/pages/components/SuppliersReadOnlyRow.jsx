import React from 'react'

export default function SuppliersReadOnlyRow({ supplier, handleEditClick, handleDeleteClick }) {
  return (
    <>
      <td className='py-4 px-2 border border-slate-700'>{supplier.username}</td>
      <td className='py-4 px-2 border border-slate-700'>{supplier.company}</td>
      <td className='py-4 px-2 border border-slate-700'>{supplier.mailingaddress}</td>
      <td className='py-4 px-2 border border-slate-700'>{supplier.contactNo}</td>
      <td className='py-4 px-2 border border-slate-700'>
        <button
          onClick={e => handleEditClick(e, supplier)}
          className='w-14 h-8 rounded-md mb-1 border-0 bg-maroon text-white mr-1'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteClick(supplier.id)}
          className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
        >
          Delete
        </button>
      </td>
    </>
  )
}
