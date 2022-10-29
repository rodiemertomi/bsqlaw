import React from 'react'

export default function ClientsReadOnlyRow({ client, handleEditClick, handleDeleteClick }) {
  return (
    <>
      <td>{client.username}</td>
      <td>{client.firstname}</td>
      <td>{client.lastname}</td>
      <td>{client.lawyer}</td>
      <td>{client.email}</td>
      <td>
        <button
          onClick={e => handleEditClick(e, client)}
          className='w-16 h-7 rounded-md border-0 bg-maroon text-white'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteClick(client.id)}
          className='w-20 h-7 rounded-md border-0 bg-maroon text-white'
        >
          Delete
        </button>
      </td>
    </>
  )
}
