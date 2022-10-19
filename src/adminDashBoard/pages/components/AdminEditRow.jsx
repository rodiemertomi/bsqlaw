import React from 'react'

export default function AdminEditRow({ admin, editFormData, handleEdit, handleCancelClick }) {
  return (
    <>
      <tr className={`flex justify-around`}>
        {/* Username */}
        <td className={`text-left w-1/4`}>{admin.username}</td>
        <td className={`text-left w-1/4`}>
          {/* Email */}
          {admin.email}
        </td>
        <td className={`text-left w-1/4`}>
          {/* Role */}
          <select onChange={handleEdit}>
            <option value={editFormData.role}>{editFormData.role}</option>
            <option value='client'>Client</option>
            <option value='owner'>Owner</option>
            <option value='lawyer'>Lawyer</option>
          </select>
          <button className='w-14 h-8 rounded-md border-0 bg-maroon text-white' type='submit'>
            Save
          </button>
          <button
            className='w-16 h-8 rounded-md border-0 bg-maroon text-white'
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </td>
        <td className={`text-left w-1/4`}>{admin.expertise}</td>
      </tr>
    </>
  )
}
