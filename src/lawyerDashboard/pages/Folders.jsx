import React, { useState, useEffect, useRef, Fragment } from 'react'
import { storage, db } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function Folders() {
  const [loading, setLoading] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [foldersList, setFoldersList] = useState([])
  const [pleadingDate, setPleadingDate] = useState()
  const [folderOption, setFolderOption] = useState('')
  const [fileList, setFileList] = useState([])
  const [readState, setReadState] = useState(true)
  const [share, setShare] = useState()
  const [editShareId, setEditShareId] = useState()
  const [editFormData, setEditFormData] = useState({})

  const caseTitleRef = useRef()
  const pleadingRef = useRef()
  const caseNoRef = useRef()
  const courtRef = useRef()
  const branchRef = useRef()

  const { username, initials, firstName, lastName } = UseUserReducer()

  const foldersRef = collection(db, 'folders')

  const handleGetFiles = async folderid => {
    setFileList([])
    const folderRef = doc(db, `folders/${folderid}`)

    const snap = await getDoc(folderRef)

    setFileList(snap.data().files)
  }

  const uploadFile = async () => {
    setLoading(true)
    if (folderOption === '') {
      alert('Please select a folder.')
      setLoading(false)
      return
    }
    if (fileUpload === null) {
      alert('Please select a file.')
      setLoading(false)
      return
    }

    const selectedFolderRef = doc(db, `folders/${folderOption}`)
    const extension = fileUpload.name.split('.').pop()
    const fileUrl = `caseFiles/${username}/${folderOption}/${caseTitleRef.current.value}.${extension}`
    const fileRef = ref(storage, fileUrl)
    await uploadBytes(fileRef, fileUpload).then(snapshot => {
      getDownloadURL(snapshot.ref).then(async url => {
        const dateNow = new Date()
        const setPleadingDate = new Date(pleadingDate)
        if (dateNow.getTime() > setPleadingDate.getTime()) {
          alert('Date set has already passed.')
          return
        }
        const data = {
          active: true,
          casenumber: caseNoRef.current.value,
          casetitle: caseTitleRef.current.value,
          pleading: pleadingRef.current.value,
          pleadingdate: new Date(pleadingDate),
          date_created: new Date(),
          uploadby: initials,
          lawyer: initials,
          folder: folderOption,
          shareable: false,
          url: url,
          court: courtRef.current.value,
          branch: branchRef.current.value,
        }
        const fileInput = {
          files: arrayUnion(data),
        }
        await setDoc(selectedFolderRef, fileInput, { merge: true }).then(() => {
          alert('Successfully added file in firestore')
        })
      })
    })
    setLoading(false)
  }

  const handleEditClick = (e, data) => {
    e.preventDefault()
    setEditShareId(data.id)

    const formValues = {
      shareable: data.shareable,
    }
    setEditFormData(formValues)
    setReadState(false)
  }

  const handleEdit = e => {
    const selectedOption = e.target.value
    setShare(selectedOption)
  }

  const handleCancel = () => {
    setEditShareId(null)
    setReadState(true)
  }

  const handleEditFormSubmit = e => {
    e.preventDefault()
    const docRef = doc(db, `files`, editShareId)

    const editedFile = {
      shareable: share,
    }

    setDoc(docRef, editedFile, { merge: true }).then(() => {
      alert('Document updated Successfully')
    })
    setReadState(true)
    setEditShareId(null)
  }

  const getFolders = async () => {
    const folderQuery = query(foldersRef, where('lawyer', '==', `${initials}`))
    await getDocs(folderQuery).then(snap => {
      setFoldersList(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getFolders()
  }, [])

  const [showModal, setShowModal] = useState(false)

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>
        {firstName} {lastName}'s Case Files
      </h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-col gap-2 lg:w-[100%] overflow-auto scrollbar-hide'>
            {foldersList?.map(folder => (
              <>
                {folder?.lawyer === `${initials}` ? (
                  <form onSubmit={handleEditFormSubmit}>
                    <details className='p-1 md:ml-5'>
                      <summary
                        className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold '
                        onClick={() => handleGetFiles(folder.id)}
                      >
                        {folder.foldername}
                      </summary>
                      {fileList?.map(file => (
                        <Fragment key={file.id}>
                          {file.folder === folder.foldername ? (
                            readState ? (
                              <ReadOnlyRow file={file} handleEditClick={handleEditClick} />
                            ) : (
                              <EditRow
                                editFormData={editFormData}
                                file={file}
                                handleCancel={handleCancel}
                                handleEdit={handleEdit}
                              />
                            )
                          ) : (
                            ''
                          )}
                        </Fragment>
                      ))}
                    </details>
                  </form>
                ) : (
                  ''
                )}
              </>
            ))}
          </div>
          <div className='h-[50px] flex flex-col justify-center item-center self-end mb-2 mt-1 mr-6'>
            <button
              type='button'
              onClick={() => {
                setShowModal(true)
              }}
              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Add File
            </button>
            {showModal && (
              <div className='w-screen h-screen backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center bg-[#BABABA] absolute h-[65%] w-[90%] gap-5 shadow-lg rounded-md md:h-[55%] md:w-[70%] lg:h-[95%] lg:w-[40%] '>
                  <div className='flex flex-col items-center gap-2'>
                    <h1 className='font-bold text-2xl'>ADD FILE</h1>
                    <hr className='w-64' />
                  </div>

                  <div className='flex flex-col items-center justify-evenly gap-2'>
                    <select
                      className='bg-white self-center border-black outline-none border-b-[1px] 
                        shadow border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      name='folders'
                      id='folders'
                      value={folderOption}
                      onChange={e => setFolderOption(e.target.value)}
                    >
                      <option default value=''>
                        -Select Folder-
                      </option>
                      {foldersList?.map(folder => (
                        <option value={`${folder.foldername}`}>{folder.foldername}</option>
                      ))}
                    </select>
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={caseNoRef}
                      placeholder='Case Number'
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={caseTitleRef}
                      placeholder='Case Title'
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={pleadingRef}
                      placeholder='Pleading / Order'
                    />
                    <label htmlFor='pleading-date'>Pleading Date</label>
                    <input
                      name='pleading-date'
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='date'
                      placeholder='Pleading Date'
                      onChange={e => setPleadingDate(e.target.value)}
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                        shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Court'
                      ref={courtRef}
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                        shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Branch (1-300)'
                      ref={branchRef}
                    />
                    <input
                      className='bg-[#BABABA] lg:h-[40px]
                       rounded w-[70%] py-2 px-3 text-gray-700 '
                      type='file'
                      onChange={e => setFileUpload(e.target.files[0])}
                    />
                    <button
                      className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      disabled={loading}
                      onClick={uploadFile}
                    >
                      Upload
                    </button>
                  </div>

                  <p
                    className='text-maroon font-bold cursor-pointer hover:text-white'
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ file, handleEditClick }) {
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
              {file?.casenumber}
            </th>
            <td className='py-4 px-6 font-bold border border-slate-700'>
              <a href={file?.url}>{file?.casetitle}</a>
            </td>
            <td className='py-4 px-6 border border-slate-700'>{file?.pleading}</td>
            <td className='py-4 px-6 border border-slate-700'>
              {file?.pleadingdate?.toDate().toISOString().substr(0, 10)}
            </td>
            <td className='py-4 px-6 border border-slate-700'>{file?.author}</td>
            <td className='py-4 px-6 border border-slate-700'>{file?.court}</td>
            <td className='py-4 px-6 border border-slate-700'>{file?.branch}</td>
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
              {file?.date_created.toDate().toISOString().substr(0, 10)}
            </th>
            <td className='py-4 px-6 border border-slate-700'>
              {file?.shareable ? 'Shared' : 'Unshared'}
            </td>
            <td className={`text-center w-1/5 border border-slate-700`}>{file?.folder}</td>
          </tr>
        </tbody>
      </table>
      <div className='flex justify-end'>
        <button
          onClick={e => handleEditClick(e, file)}
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
        >
          Edit
        </button>
      </div>
    </>
  )
}

function EditRow({ handleCancel, handleEdit, file }) {
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
            <th scope='row' className='py-4 px-6 font-bold border border-slate-700'>
              {file?.casenumber}
            </th>
            <td className='py-4 px-6 border border-slate-700'>
              <a href={file?.url}>{file?.casetitle}</a>
            </td>
            <td className='py-4 px-6 border border-slate-700'>{file?.pleading}</td>
            <td className='py-4 px-6 border border-slate-700'>
              {file?.pleadingdate?.toDate().toISOString().substr(0, 10)}
            </td>
            <td className='py-4 px-6 border border-slate-700'>{file?.author}</td>
            <td className='py-4 px-6 border border-slate-700'>{file?.court}</td>
            <td className='py-4 px-6 border border-slate-700'>{file?.branch}</td>
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
          <tr className=''>
            <th scope='row' className='py-4 px-2 font-normal border-slate-700 text-center'>
              {file?.date_created.toDate().toISOString().substr(0, 10)}
            </th>
            <td className='py-4 px-6 border border-slate-700'>
              <select onChange={handleEdit}>
                {file?.shareable ? (
                  <>
                    <option value={true}>Shared</option>
                    <option value={false}>Unshared</option>
                  </>
                ) : (
                  <>
                    <option value={false}>Unshared</option>
                    <option value={true}>Shared</option>
                  </>
                )}
              </select>
            </td>
            <td className='py-4 px-4 border border-slate-700'>{file?.folder}</td>
          </tr>
        </tbody>
      </table>
      <div className='flex justify-end gap-1'>
        <button
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
          type='submit'
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
        >
          Cancel
        </button>
      </div>
    </>
  )
}
