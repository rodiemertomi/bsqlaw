import React from 'react'

export default function ClientsEditRow({ editFormData, handleEditFormChange, handleCancelClick }) {
  return (
    <>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Username'
          name='username'
          value={editFormData.username}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Firstname'
          name='firstname'
          value={editFormData.firstname}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Lastname'
          name='lastname'
          value={editFormData.lastname}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Company'
          name='company'
          value={editFormData.company}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>{editFormData.lawyer}</td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Email'
          name='email'
          value={editFormData.email}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Mailing Address'
          name='mailingaddress'
          value={editFormData.mailingaddress}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <input
          type='text'
          placeholder='Contact Person'
          name='contactperson'
          value={editFormData.contactperson}
          onChange={handleEditFormChange}
        />
      </td>
      <td className='py-4 px-6 border border-slate-700'>
        <div className='flex items-center justify-center'>
          <button className='w-14 h-8 rounded-md border-0 bg-maroon mr-1 text-white' type='submit'>
            Save
          </button>
          <button
            className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </td>
    </>
  )
}
