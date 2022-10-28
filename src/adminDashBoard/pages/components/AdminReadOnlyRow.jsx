import React from 'react'

export default function AdminReadOnlyRow({ searchKeyword, admin, handleEditClick }) {
  return (
    <>
      <tr key={admin.id}>
        <td className='py-4 px-6 border border-slate-700'>{admin.username}</td>
        <td className='py-4 px-6 border border-slate-700'>{admin.email}</td>
        <td className='py-4 px-6 border border-slate-700'>
          {admin.role}{' '}
          <div className='mt-2'>
            <button
              onClick={e => handleEditClick(e, admin)}
              className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
            >
              Edit
            </button>
          </div>
        </td>
        <td className='py-4 px-6 border border-slate-700'>{admin.expertise}</td>
      </tr>
    </>
  )
}
