import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function Accounting() {
  const [files, setFiles] = useState([])
  const [fileSearch, setFileSearch] = useState('soa')
  const { id } = UseUserReducer
  const fileTypes = [
    {
      name: 'Statement of Account',
      type: 'soa',
    },
    { name: 'Check Vouchers', type: 'cv' },
    { name: 'Official Receipt', type: 'or' },
  ]

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }
  const getFiles = async () => {
    const colRef = collection(db, `${fileSearch}`)
    const clientRef = query(colRef, where('clientid', '==', `${id}`))
    await getDocs(clientRef).then(snap => {
      setFiles(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getFiles()
  }, [fileSearch])

  return (
    <div className='h-screen w-screen font-poppins overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <div className='w-full flex item-center mb-2'>
        <h1 className='self-center text-base lg:text-[30px] w-full mt-3 ml-5 font-bold lg:ml-28'>
          BSQ Accounting
        </h1>
        <img
          alt='bsq logo'
          className='w-[80px] mr-4 pt-3'
          src={require('../../assets/officialBSQlogoBlack.png')}
        />
      </div>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto pb-2 pl-5 pr-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='h-[50px] w-[70%] lg:w-[22%] flex flex-row justify-center pr-5 item-center self-end mb-2 mt-1 mr-6'>
            <select
              className='mt-2 h-9 bg-white self-center border-black outline-none border-b-[1px]
                      shadow border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              onChange={e => setFileSearch(e.target.value)}
            >
              {fileTypes?.map(file => (
                <option value={file.type}>{file.name}</option>
              ))}
            </select>
          </div>
          <div className='w-[100%] h-[100%] pl-5 pr-5 flex flex-col items-center gap-2 lg:w-[100%] overflow-auto scrollbar-hide pb-5 '>
            <div className='w-[100%] h-[100%] pl-5 pr-5 flex flex-col items-center gap-2 lg:w-[100%] overflow-auto scrollbar-hide pb-5'>
              <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
                <details className='p-5 w-full'>
                  <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-center'>
                    {fileTypes?.map(fileType =>
                      fileType.type === fileSearch ? `${fileType.name}` : ''
                    )}
                  </summary>
                  {files?.map(file =>
                    file.id === 'DONOTDELETE' ? (
                      ''
                    ) : (
                      <FileReadOnly file={file} formatDate={formatDate} />
                    )
                  )}
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FileReadOnly({ file, handleDeleteFile, formatDate }) {
  return (
    <div
      key={file.id}
      className='bg-[#FFF] drop-shadow-lg p-2 w-[100%] rounded-md flex flex-col gap-2 '
    >
      <div className='overflow-x-auto relative shadow-lg rounded-lg '>
        <table className='w-full text-sm text-center text-gray-500 border border-gray '>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='py-3 px-6 '>
                File Name
              </th>
              <th scope='col' className='py-3 px-6'>
                Upload By
              </th>
              <th scope='col' className='py-3 px-6'>
                Upload Date
              </th>
              <th scope='col' className='py-3 px-6'>
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
              <td className='py-4 px-6'>
                <a href={file.fileurl}>{file.filename}</a>
              </td>
              <td className='py-4 px-6'>{file.uploadby}</td>
              <td className='py-4 px-6'>{formatDate(file.uploaddate.toDate())}</td>
              <td className='py-4 px-6'>{file.remarks}</td>
            </tr>
          </tbody>
        </table>
        <div className='p-2 w-full flex gap-[53%] text-sm'>
          <div className='flex gap-2 items-center w-[360px]'>
            <img
              className='h-8 w-8'
              src={
                file.clientphoto || file.clientphoto !== ''
                  ? `${file.clientphoto}`
                  : require('../../assets/user.png')
              }
              alt='user icon'
            />
            <span className='font-bold uppercase text-xs w-[650px]'>{file.clientname}</span>
          </div>
          <div className='flex justify-end gap-2 w-full'>
            <button
              onClick={e => handleDeleteFile(e, file.id)}
              className=' inline-block self-right px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
