import React, { useState, useEffect, Fragment } from 'react'
import { db } from '../../firebase'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'
import reportLog from '../../components/ReportLog'

export default function CaseFolders() {
  const [loading, setLoading] = useState(false)
  const [foldersList, setFoldersList] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [files, setFiles] = useState([])

  const { username } = UseUserReducer()

  const foldersRef = collection(db, 'folders')
  const inactiveFolders = query(foldersRef, where('active', '==', false))

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

  const handleDeleteFolder = async (e, folderid) => {
    e.preventDefault()
    setLoading(true)
    if (
      window.confirm('Are you sure you want to delete this folder and all its contents?') === true
    ) {
      const ref = doc(db, `folders/${folderid}`)
      reportLog(`${username} deleted folder ${folderid}`)
      await deleteDoc(ref).then(() => {
        alert('Deleted Folder.')
        setLoading(false)
        getFolders()
        return
      })
    } else {
      setLoading(false)
      return
    }
  }

  const unarchiveFolder = async (e, folderId) => {
    e.preventDefault()
    if (
      window.confirm('Are you sure you want to unarchive this folder and all its contents?') ===
      true
    ) {
      const ref = doc(db, `folders/${folderId}`)
      reportLog(`${username} unarchived folder ${folderId}`)

      await setDoc(ref, { active: true }, { merge: true }).then(() => {
        alert('Unarchived Folder.')
        setLoading(false)
        getFolders()
        return
      })
    } else {
      setLoading(false)
      return
    }
  }

  const handleDeleteFile = async (e, file, folderid) => {
    e.preventDefault()
    const docRef = doc(db, `folders/${folderid}`)
    if (window.confirm('Are you sure you want to delete this file?') === true) {
      const deleteFile = {
        active: file.active,
        branch: file.branch,
        casenumber: file.casenumber,
        casetitle: file.casetitle,
        court: file.court,
        date_created: file.date_created,
        folder: file.folder,
        id: file.id,
        lawyer: file.lawyer,
        pleading: file.pleading,
        pleadingdate: file.pleadingdate,
        shareable: file.shareable,
        uploadby: file.uploadby,
        url: file.url,
      }
      const deleteData = { files: arrayRemove(deleteFile) }
      reportLog(`${username} deleted ${deleteFile.pleading} in ${deleteFile.folder}`)
      await setDoc(docRef, deleteData, { merge: true }).then(() => {
        alert('Deleted file.')
        getFolders()
      })
    } else {
      return
    }
    return
  }

  const getFolders = async () => {
    const snap = await getDocs(inactiveFolders)
    setFoldersList(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  const getFiles = async () => {
    const filesRef = collection(db, 'files')
    await getDocs(filesRef).then(snap => {
      setFiles(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getFolders()
  }, [])

  return (
    <div className='h-screen w-screen font-poppins overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <div className='w-full flex item-center mb-2'>
        <h1 className='self-center text-base lg:text-[30px] w-full mt-3 ml-5 font-bold lg:ml-28'>
          BSQ Case Folders
        </h1>
        <img
          alt='bsq logo'
          className='w-[80px] mr-4 pt-3'
          src={require('../../assets/officialBSQlogoBlack.png')}
        />
      </div>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto pb-2 pl-5 pr-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col  lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='h-[50px] flex pl-5 flex-row gap-2 item-center mb-2 mt-1 mr-6'>
            <div className='w-full flex pt-3 items-center justify-between gap-2'>
              <div className='w-[70%] flex items-center'>
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
          </div>
          <div className='w-[100%] h-[100%] pt-3 pl-5 pr-5 flex flex-col gap-2 lg:w-[100%] overflow-auto pb-5'>
            {foldersList?.map(folder => (
              <>
                {folder.id === 'DONOTDELETE' ? (
                  ''
                ) : (
                  <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
                    <details className='p-5 w-full'>
                      <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-between'>
                        <div>{folder.foldername}</div> <div>{folder.handlingpartner}</div>{' '}
                        <div>
                          <button
                            disabled={loading}
                            className='mr-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                            onClick={e => unarchiveFolder(e, folder.id)}
                          >
                            Unarchive Folder
                          </button>
                          <button
                            disabled={loading}
                            className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                            onClick={e => handleDeleteFolder(e, folder.id)}
                          >
                            Delete Folder
                          </button>
                        </div>
                      </summary>
                      {search(files)?.map(file => (
                        <Fragment key={file.id}>
                          {file.folder === folder.foldername ? (
                            <ReadOnlyRow
                              file={file}
                              folderid={folder.id}
                              handleDeleteFile={handleDeleteFile}
                            />
                          ) : (
                            ''
                          )}
                        </Fragment>
                      ))}
                    </details>
                  </div>
                )}
              </>
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
              <th scope='col' className='py-3 px-6'>
                Branch
              </th>
              <th scope='col' className='py-3 px-6'>
                Date Created
              </th>
              <th scope='col' className='py-3 px-6'>
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
              <td className='py-4 px-6'>{file.lawyer}</td>
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
