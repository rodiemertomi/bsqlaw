import React from 'react'

export default function AdminEditRow({ admin, editFormData, handleEdit, handleCancelClick }) {
  return (
    <>
      <tr>
        {/* Username */}
        <td className='py-4 px-6 border border-slate-700'>{admin.username}</td>
        <td className='py-4 px-6 border border-slate-700'>
          {/* Email */}
          {admin.email}
        </td>
        <td className='py-4 px-6 border border-slate-700'>
          {/* Role */}
          <select onChange={handleEdit}>
            <option value={editFormData.role}>{editFormData.role}</option>
            <option value='client'>Client</option>
            <option value='owner'>Owner</option>
            <option value='lawyer'>Lawyer</option>
          </select>
          <div className='mt-2 flex justify-center gap-2'>
            <button className='w-14 h-8 rounded-md border-0 bg-maroon text-white' type='submit'>
              Save
            </button>
            <button
              className='w-16 h-8 rounded-md border-0 bg-maroon text-white'
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </td>
        <td className='py-4 px-6 border border-slate-700'>{admin.expertise}</td>
      </tr>
    </>
  )
}
