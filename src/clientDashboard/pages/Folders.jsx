import React, { useState, useEffect, Fragment } from 'react'
import { db } from '../../firebase'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function Folders() {
  const { id, firstName, lastName } = UseUserReducer()
  const [folders, setFolders] = useState()
  const [fileList, setFileList] = useState()

  const getFolders = async () => {
    const folderRef = collection(db, 'folders')
    const folderQuery = query(folderRef, where('clientid', '==', `${id}`))
    await getDocs(folderQuery).then(snap => {
      setFolders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }
  const handleGetFiles = async folderid => {
    setFileList([])
    const folderRef = doc(db, `folders/${folderid}`)

    const snap = await getDoc(folderRef)

    setFileList(snap.data().files)
  }

  useEffect(() => {
    getFolders()
  }, [])
  return (
    <div className='h-screen w-screen overflow-auto lg:overflow-hidden scrollbar-hide md:w-screen md:h-screen lg:w-screen lg:ml-48'>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold'>
        {firstName} {lastName}'s Case Files
      </h1>
      <div className='h-full flex flex-col gap-5 items-center  md:w-full md:h-full lg:w-full lg:h-full lg:flex lg:flex-row'>
        <div className='w-[95%] gap-5 mt-6 lg:w-[95%] lg:h-[100%] lg:ml-2'>
          <div className=' rounded-md  flex flex-col shadow-lg  bg-[#D9D9D9] lg:h-[85%]'>
            <div className='m-5 lg:m-5 text-justify'>
              <div className='flex flex-col gap-10 lg:ml-10 '>
                {folders?.map(folder => (
                  <details className='p-1 md:ml-5'>
                    <summary
                      onClick={() => handleGetFiles(folder.id)}
                      className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold'
                    >
                      {folder.foldername}
                    </summary>
                    {fileList?.map(file => (
                      <Fragment key={file.id}>
                        {file.folder === folder.foldername ? <ReadOnlyRow file={file} /> : ''}
                      </Fragment>
                    ))}
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ file }) {
  return (
    <>
      <table className='w-full text-xs text-center lg:text-sm lg:ml-2 border-collapse border border-slate-500 mt-2 mb-2'>
        <thead className='text-xs text-gray-700 '>
          <tr>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Case No.
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Case Title
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Pleading / Order
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Pleading / Order Date
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Handling Associate
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm    border border-slate-600'>
              Court
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm    border border-slate-600'>
              Branch
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className=''>
            <th scope='row' className='py-4 px-6 border border-slate-700'>
              {file.casenumber}
            </th>
            <td className='py-4 px-6 font-bold border border-slate-700'>
              <a href={file.url}>{file.casetitle}</a>
            </td>
            <td className='py-4 px-6 border border-slate-700'>{file.pleading}</td>
            <td className='py-4 px-6 border border-slate-700'>
              {file.pleadingdate?.toDate().toISOString().substr(0, 10)}
            </td>
            <td className='py-4 px-6 border border-slate-700'>{file.author}</td>
            <td className='py-4 px-6 border border-slate-700'>{file.court}</td>
            <td className='py-4 px-6 border border-slate-700'>{file.branch}</td>
          </tr>
        </tbody>
        <thead className='text-xs text-gray-700 '>
          <tr>
            <th scope='col' className='py-3 px-6 lg:text-sm  border border-slate-600'>
              Date Created
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Shareable
            </th>
            <th scope='col' className='py-3 px-6 lg:text-sm   border border-slate-600'>
              Folder
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='text-center'>
            <th scope='row' className='py-4 px-2 font-normal border-slate-700 text-center'>
              {file.date_created.toDate().toISOString().substr(0, 10)}
            </th>
            <td className='py-4 px-6 border border-slate-700'>
              {file.shareable ? 'Shared' : 'Unshared'}
            </td>
            <td className={`text-center w-1/5 border border-slate-700`}>{file.folder}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
