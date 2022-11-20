import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function Accounting() {
  const [ors, setOrs] = useState()
  const [soas, setSoas] = useState()

  const { id } = UseUserReducer()

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  const getOrs = async () => {
    const colRef = collection(db, 'or')
    const clientRef = query(colRef, where('clientid', '==', `${id}`))
    await getDocs(clientRef).then(snap => {
      setOrs(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getSoas = async () => {
    const colRef = collection(db, 'soa')
    const clientRef = query(colRef, where('clientid', '==', `${id}`))
    await getDocs(clientRef).then(snap => {
      setSoas(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getOrs()
    getSoas()
  }, [])

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Accounting</h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='w-[100%] h-[100%] pl-5 pr-5 flex flex-col items-center gap-2 lg:w-[100%] overflow-auto scrollbar-hide pb-5 pt-4'>
            <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%]'>
              <details className='p-5 w-full'>
                <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-center'>
                  Statement of Accounts
                </summary>
                {soas?.map(soa =>
                  soa.id === 'DONOTDELETE' ? '' : <SOAReadOnly soa={soa} formatDate={formatDate} />
                )}
              </details>
            </div>
            <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
              <details className='p-5 w-full'>
                <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-center'>
                  Official Receipts
                </summary>
                {ors?.map(or =>
                  or.id === 'DONOTDELETE' ? '' : <ORReadOnly or={or} formatDate={formatDate} />
                )}
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SOAReadOnly({ soa, formatDate }) {
  return (
    <div
      key={soa.id}
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
                <a href={soa.fileurl}>{soa.filename}</a>
              </td>
              <td className='py-4 px-6'>{soa.uploadby}</td>
              <td className='py-4 px-6'>{formatDate(soa.uploaddate.toDate())}</td>
              <td className='py-4 px-6'>{soa.remarks}</td>
            </tr>
          </tbody>
        </table>
        <div className='p-2 w-full flex gap-[53%] text-sm'>
          <div className='flex gap-2 items-center w-[360px]'>
            <img
              className='h-8 w-8'
              src={
                soa.clientphoto || soa.clientphoto !== ''
                  ? `${soa.clientphoto}`
                  : require('../../assets/user.png')
              }
              alt='user icon'
            />
            <span className='font-bold uppercase text-xs w-[650px]'>{soa.clientname}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ORReadOnly({ or, formatDate }) {
  return (
    <div
      key={or.id}
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
                <a href={or.fileurl}>{or.filename}</a>
              </td>
              <td className='py-4 px-6'>{or.uploadby}</td>
              <td className='py-4 px-6'>{formatDate(or.uploaddate.toDate())}</td>
              <td className='py-4 px-6'>{or.remarks}</td>
            </tr>
          </tbody>
        </table>
        <div className='p-2 w-full flex gap-[53%] text-sm'>
          <div className='flex gap-2 items-center w-[360px]'>
            <img
              className='h-8 w-8'
              src={
                or.clientphoto || or.clientphoto !== ''
                  ? `${or.clientphoto}`
                  : require('../../assets/user.png')
              }
              alt='user icon'
            />
            <span className='font-bold uppercase text-xs w-[650px]'>{or.clientname}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
