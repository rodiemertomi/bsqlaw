import React from 'react'

export default function ClientsReadOnlyRow({ client, handleEditClick, handleDeleteClick }) {
  return (
    <>
      <td className='py-4 px-6 border border-slate-700'>{client.username}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.firstname}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.lastname}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.company}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.lawyer}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.email}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.mailingaddress}</td>
      <td className='py-4 px-6 border border-slate-700'>{client.contactperson}</td>
      <td className='py-4 px-6 border border-slate-700 flex'>
        <button
          onClick={e => handleEditClick(e, client)}
          className='w-14 h-8 rounded-md border-0 bg-maroon text-white mr-1'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteClick(client.id)}
          className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
        >
          Delete
        </button>
      </td>
    </>
  )
}
