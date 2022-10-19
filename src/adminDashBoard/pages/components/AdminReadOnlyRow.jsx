import React from 'react'

export default function AdminReadOnlyRow({ searchKeyword, admin, handleEditClick }) {
  return (
    <>
      <tr className={`flex justify-around`} key={admin.id}>
        <td className={`text-left w-1/4`}>{admin.username}</td>
        <td className={`text-left w-1/4`}>{admin.email}</td>
        <td className={`text-left w-1/4`}>
          {admin.role}{' '}
          <button
            onClick={e => handleEditClick(e, admin)}
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
          >
            Edit
          </button>
        </td>
        <td className={`text-left w-1/4`}>{admin.expertise}</td>
      </tr>
    </>
  )
}
