import React, { useState, useEffect, Fragment } from 'react'
import { db } from '../../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function Folders() {
  const { id, firstName, lastName } = UseUserReducer()
  const [folders, setFolders] = useState()
  const [searchKeyword, setSearchKeyword] = useState('')

  const getFolders = async () => {
    const folderRef = collection(db, 'folders')
    const folderQuery = query(folderRef, where('clientid', '==', `${id}`))
    await getDocs(folderQuery).then(snap => {
      setFolders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const search = datas => {
    try {
      return datas.filter(
        data =>
          data.casenumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.casetitle.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.pleading.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.pleadingdate.toDate().toISOString().substr(0, 10).includes(searchKeyword) ||
          data.lawyer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.court.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.branch.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.date_created.toDate().toISOString().substr(0, 10).includes(searchKeyword) ||
          data.folder.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          data.uploadby.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    getFolders()
  }, [])
  return (
    <div className='h-screen w-screen font-poppins overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <div className='w-full flex item-center mb-2'>
        <h1 className='self-center text-base lg:text-[30px] mt-3 ml-5 font-bold lg:ml-28'>
          {firstName} {lastName}'s Case Files
        </h1>
        <img
          alt='bsq logo'
          className='w-[80px] mr-4 pt-3'
          src={require('../../assets/officialBSQlogoBlack.png')}
        />
      </div>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto pb-2 pl-5 pr-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='w-full flex items-center'>
            <div className='w-[70%] pl-6 pt-3 flex items-center'>
              <span className='font-bold text-xs lg:text-base text-white'>Search Files</span>
              <input
                className='lg:ml-2 w-[80%] py-2 my-2 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                type='text'
                placeholder='Enter Case No./Title, Pleading Order/Date, etc...'
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-col gap-2 lg:w-[100%] overflow-auto'>
            {folders?.map(folder => (
              <div
                key={folder.id}
                className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '
              >
                <details className='p-5 w-full'>
                  <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold'>
                    {folder.foldername}
                  </summary>
                  {search(folder.files)?.map(file => (
                    <Fragment key={file.id}>
                      {file.folder === folder.foldername ? <ReadOnlyRow file={file} /> : ''}
                    </Fragment>
                  ))}
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ file }) {
  return (
    <>
      <div className='overflow-x-auto relative shadow-lg rounded-lg mt-5'>
        <table className='w-full text-sm text-center text-gray-500 border border-gray'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='py-3 px-6 '>
                Case No.
              </th>
              <th scope='col' className='py-3 px-6 '>
                Case Title
              </th>
              <th scope='col' className='py-3 px-6 '>
                Pleading / Order
              </th>
              <th scope='col' className='py-3 px-6 '>
                Pleading / Order Date
              </th>
              <th scope='col' className='py-3 px-6 '>
                Handling Associate
              </th>
              <th scope='col' className='py-3 px-6 '>
                Court
              </th>
              <th scope='col' className='py-3 px-6 '>
                Branch
              </th>
              <th scope='col' className='py-3 px-6 '>
                Date Created
              </th>
              <th scope='col' className='py-3 px-6 '>
                Folder
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
              <th scope='row' className='py-4 px-6 font-bold'>
                {file.casenumber}
              </th>
              <td className='py-4 px-6'>{file.casetitle}</td>
              <td className='py-4 px-6 font-bold'>
                <a href={file.url}>{file.pleading}</a>
              </td>
              <td className='py-4 px-6'>
                {file.pleadingdate?.toDate().toISOString().substr(0, 10)}
              </td>
              <td className='py-4 px-6'>{file.author}</td>
              <td className='py-4 px-6'>{file.court}</td>
              <td className='py-4 px-6'>{file.branch}</td>
              <td className='py-4 px-6'>
                {file.date_created.toDate().toISOString().substr(0, 10)}
              </td>
              <td className='py-4 px-6'>{file.folder}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
