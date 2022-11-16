import React, { useState, useEffect } from 'react'
import { storage, db } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function Accounting() {
  const [loading, setLoading] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [clients, setClients] = useState()
  const [ors, setOrs] = useState()
  const [soas, setSoas] = useState()
  const [selectedClient, setSelectedClient] = useState()
  const [selectedFileType, setSelectedFileType] = useState()
  const [remarks, setRemarks] = useState('')

  const { username, initials } = UseUserReducer()

  const uploadFile = async () => {
    setLoading(true)

    const clientRef = doc(db, `users/${selectedClient}`)
    const clientDoc = await getDoc(clientRef)
    const client = clientDoc.data()
    const fileTypeRef = collection(db, `${selectedFileType}`)
    const filename = fileUpload.name.replace(/\.[^/.]+$/, '')
    const fileUrl = `${selectedFileType}/${username}/${client.username}/${fileUpload.name}`
    const fileRef = ref(storage, fileUrl)
    await uploadBytes(fileRef, fileUpload).then(snap => {
      getDownloadURL(snap.ref).then(async url => {
        const data = {
          clientname: client.username,
          clientphoto: client.photoURL,
          clientid: clientDoc.id,
          filename: filename,
          fileurl: url,
          uploadby: initials,
          uploaddate: new Date(),
          remarks: remarks,
        }

        await addDoc(fileTypeRef, data).then(() => {
          alert('Upload Successful')
          getOrs()
          getSoas()
        })
      })
    })

    setLoading(false)
  }

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  const handleDeleteSoa = async (e, id) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to delete this file?') === true) {
      const fileRef = doc(db, `soa/${id}`)
      await deleteDoc(fileRef).then(() => {
        alert('File Delete Successful')
        getOrs()
        getSoas()
      })
    } else {
      return
    }
    return
  }
  const handleDeleteOr = async (e, id) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to delete this file?') === true) {
      const fileRef = doc(db, `or/${id}`)
      await deleteDoc(fileRef).then(() => {
        alert('File Delete Successful')
        getOrs()
        getSoas()
      })
    } else {
      return
    }
    return
  }

  const getClients = async () => {
    const colRef = collection(db, 'users')
    const clientRef = query(colRef, where('role', '==', 'client'))
    await getDocs(clientRef).then(snap => {
      setClients(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getOrs = async () => {
    const colRef = collection(db, 'or')
    await getDocs(colRef).then(snap => {
      setOrs(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getSoas = async () => {
    const colRef = collection(db, 'soa')
    await getDocs(colRef).then(snap => {
      setSoas(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getClients()
    getOrs()
    getSoas()
  }, [])

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>BSQ Accounting</h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='h-[50px] flex flex-row justify-center gap-2 item-center self-end mb-2 mt-1 mr-6'>
            <button
              type='button'
              onClick={() => {
                setShowModal(true)
              }}
              className='mt-2 w-full inline-block px-5 bg-blue-600 text-black font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-white hover:bg-[#471414] hover:text-white active:shadow-lg transition duration-150 ease-in-out'
            >
              Upload File
            </button>

            {showModal && (
              <div className='w-screen h-screen z-20 bg-modalbg absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex flex-col justify-center animate-[moveTop_0.3s_ease-in-out] items-center bg-[#e1dfdf] absolute h-[65%] w-[90%] drop-shadow-lg gap-5 rounded-md md:h-[50%] md:w-[60%] lg:h-[77%] lg:w-[30%] p-14'>
                  <div className=' flex w-full flex-col items-center justify-evenly mt-2 gap-4'>
                    <h1 className='font-bold w-full text-xl text-center'>UPLOAD FILE</h1>
                    <select
                      className=' h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedClient(e.target.value)}
                    >
                      <option value=''>Select Client</option>
                      {clients.map(client => (
                        <option value={client.id}>{client.username}</option>
                      ))}
                    </select>
                    <select
                      className=' h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedFileType(e.target.value)}
                    >
                      <option value=''>Select File Type</option>
                      <option value='soa'>Statement of Account</option>
                      <option value='or'>Original Receipt</option>
                    </select>
                    <textarea
                      rows='4'
                      cols='30'
                      name='eventDesc'
                      className=' h-24 pl-4 shadow border-[1px] border-maroon rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
                      value={remarks}
                      placeholder='Remarks'
                      onChange={event => setRemarks(event.target.value)}
                    ></textarea>
                    <input
                      className='bg-[#e1dfdf] w-full flex items-center justify-center h-10
                       rounded py-2 px-3 text-gray-700 '
                      type='file'
                      accept='application/msword, application/vnd.ms-excel, application/pdf'
                      onChange={e => setFileUpload(e.target.files[0])}
                    />
                    <button
                      disabled={loading}
                      className=' inline-block px-6 py-2.5 mt-1 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white w-full hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      onClick={uploadFile}
                    >
                      Upload File
                    </button>
                  </div>
                  <p
                    className='text-maroon text-sm cursor-pointer hover:text-black hover:font-bold'
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className='w-[100%] h-[100%] pl-5 pr-5 flex flex-col items-center gap-2 lg:w-[100%] overflow-auto scrollbar-hide pb-5'>
            <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
              <details className='p-5 w-full'>
                <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-center'>
                  Statement of Accounts
                </summary>
                {soas?.map(soa =>
                  soa.id === 'DONOTDELETE' ? (
                    ''
                  ) : (
                    <SOAReadOnly
                      soa={soa}
                      handleDeleteSoa={handleDeleteSoa}
                      formatDate={formatDate}
                    />
                  )
                )}
              </details>
            </div>
            <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
              <details className='p-5 w-full'>
                <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-center'>
                  Official Receipts
                </summary>
                {ors?.map(or =>
                  or.id === 'DONOTDELETE' ? (
                    ''
                  ) : (
                    <ORReadOnly or={or} handleDeleteOr={handleDeleteOr} formatDate={formatDate} />
                  )
                )}
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SOAReadOnly({ soa, handleDeleteSoa, formatDate }) {
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
          <div className='flex justify-end gap-2 w-full'>
            <button
              onClick={e => handleDeleteSoa(e, soa.id)}
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

function ORReadOnly({ or, handleDeleteOr, id, formatDate }) {
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
          <div className='flex justify-end gap-2 w-full'>
            <button
              onClick={e => handleDeleteOr(e, or.id)}
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
