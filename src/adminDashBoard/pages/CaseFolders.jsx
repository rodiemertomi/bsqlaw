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
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'

export default function CaseFolders() {
  const [loading, setLoading] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [foldersList, setFoldersList] = useState([])
  const caseTitleRef = useRef()
  const pleadingRef = useRef()
  const caseNoRef = useRef()
  const folderNameRef = useRef()
  const courtRef = useRef()
  const branchRef = useRef()
  const [pleadingDate, setPleadingDate] = useState()
  const [folderOption, setFolderOption] = useState('')
  const [fileList, setFileList] = useState([])
  const { username, id, initials } = UseUserReducer()
  const [readState, setReadState] = useState(true)
  const [share, setShare] = useState()
  const [editShareId, setEditShareId] = useState()
  const [editFormData, setEditFormData] = useState({})

  const handleGetFiles = async () => {
    setFileList([])
    const colRef = collection(db, `files`)
    const authorRef = query(colRef, where('author', '==', `${initials}`))
    const shareRef = query(colRef, where('shareable', '==', true))
    const authorDocs = await getDocs(authorRef)
    const shareDocs = await getDocs(shareRef)
    const data1 = authorDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    const data2 = shareDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    setFileList([data1, data2])
  }

  const addFolder = () => {
    const docRef = doc(db, `users/${id}`)
    const data = {
      folders: arrayUnion(`${folderNameRef.current.value}`),
    }
    updateDoc(docRef, data, { merge: true }).then(() => {
      alert(`Updated successfully`)
    })
    folderNameRef.current.value = ''
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

    const extension = fileUpload.name.split('.').pop()
    const fileUrl = `caseFiles/${username}/${folderOption}/${caseTitleRef.current.value}.${extension}`
    const fileRef = ref(storage, fileUrl)
    await uploadBytes(fileRef, fileUpload).then(snapshot => {
      getDownloadURL(snapshot.ref).then(async url => {
        const data = {
          active: true,
          casenumber: caseNoRef.current.value,
          casetitle: caseTitleRef.current.value,
          pleading: pleadingRef.current.value,
          pleadingdate: new Date(pleadingDate),
          date_created: new Date(),
          author: initials,
          folder: folderOption,
          shareable: false,
          url: url,
          court: courtRef.current.value,
          branch: branchRef.current.value,
        }
        const colRef = collection(db, `files`)
        const docRef = doc(colRef)
        await setDoc(docRef, data, { merge: true }).then(() => {
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

  useEffect(() => {
    const docRef = doc(db, `users/${id}`)
    const getFolders = async () => {
      const snap = await getDoc(docRef)
      const data = snap.data()
      setFoldersList(data.folders)
    }

    getFolders()
    handleGetFiles()
  }, [])

  const [showModal, setShowModal] = useState(false)

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>
        {username}'s Case Files
      </h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-col gap-2 lg:w-[100%] overflow-auto scrollbar-hide'>
            {foldersList?.map(folder => (
              <form onSubmit={handleEditFormSubmit}>
                <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
                  <details className='p-5'>
                    <summary
                      className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold '
                      onClick={() => handleGetFiles()}
                    >
                      {folder}
                    </summary>
                    {fileList?.map(file =>
                      file?.map(data => (
                        <Fragment key={data.id}>
                          {data.folder === folder ? (
                            readState ? (
                              <ReadOnlyRow data={data} handleEditClick={handleEditClick} />
                            ) : (
                              <EditRow
                                editFormData={editFormData}
                                data={data}
                                handleCancel={handleCancel}
                                handleEdit={handleEdit}
                              />
                            )
                          ) : (
                            ''
                          )}
                        </Fragment>
                      ))
                    )}
                  </details>
                </div>
              </form>
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
              <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center bg-[#e1dfdf] absolute h-[70%] w-[90%] gap-[10px] drop-shadow-lg rounded-md md:h-[60%] md:w-[70%] lg:h-[85%] lg:w-[30%] '>
                  <div className='flex justify-center gap-2 flex-col'>
                    <h1 className='font-bold text-2xl text-center'>Add File</h1>
                    <input
                      className='mt-2 bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                         shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={folderNameRef}
                      placeholder='Enter folder name'
                    />
                    <button
                      className=' inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      onClick={addFolder}
                    >
                      Add Folder
                    </button>
                  </div>
                  {/* secret */}
                  <div className='flex flex-col items-center justify-evenly gap-[5px]'>
                    <select
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                        shadow border rounded w-[65%] pl-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      name='folders'
                      id='folders'
                      value={folderOption}
                      onChange={e => {
                        setFolderOption(e.target.value)
                      }}
                    >
                      <option default value=''>
                        -Select Folder-
                      </option>
                      {foldersList?.map(folder => (
                        <option value={`${folder}`}>{folder}</option>
                      ))}
                    </select>
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={caseNoRef}
                      placeholder='Case Number'
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={caseTitleRef}
                      placeholder='Case Title'
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={pleadingRef}
                      placeholder='Pleading / Order'
                    />
                    <label className='text-maroon text-sm' htmlFor='pleading-date'>
                      Pleading Date
                    </label>
                    <input
                      name='pleading-date'
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='date'
                      placeholder='Pleading Date'
                      onChange={e => setPleadingDate(e.target.value)}
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                        shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Court'
                      ref={courtRef}
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[30px]
                        shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Branch (1-300)'
                      ref={branchRef}
                    />
                    <input
                      className='bg-[#e1dfdf] lg:h-[40px]
                       rounded w-[70%] py-2 px-3 text-gray-700 '
                      type='file'
                      onChange={e => setFileUpload(e.target.files[0])}
                    />
                    <button
                      className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon w-[65%] hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      disabled={loading}
                      onClick={uploadFile}
                    >
                      Upload
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
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ data, handleEditClick }) {
  return (
    <>
      <div className='overflow-x-auto relative shadow-lg rounded-lg'>
        <table className='w-full text-sm text-center text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='py-3 px-6 '>
                Case No.
              </th>
              <th scope='col' className='py-3 px-6'>
                Case Title
              </th>
              <th scope='col' className='py-3 px-6'>
                Pleading / Order
              </th>
              <th scope='col' className='py-3 px-6'>
                Pleading / Order Date
              </th>
              <th scope='col' className='py-3 px-6'>
                Handling Associate
              </th>
              <th scope='col' className='py-3 px-6'>
                Court
              </th>
              <th scope='col' className='py-3 px-6'>
                Branch
              </th>
              <th scope='col' className='py-3 px-6'>
                Date Created
              </th>
              <th scope='col' className='py-3 px-6'>
                Shareable
              </th>
              <th scope='col' className='py-3 px-6'>
                Folder
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
              <th scope='row' className='py-4 px-6 font-bold'>
                <a href={data.url}>{data.casenumber}</a>
              </th>
              <td class='py-4 px-6'>{data.casetitle}</td>
              <td class='py-4 px-6'>{data.pleading}</td>
              <td class='py-4 px-6'>{data.pleadingdate?.toDate().toISOString().substr(0, 10)}</td>
              <td class='py-4 px-6'>{data.author}</td>
              <td class='py-4 px-6'>{data.court}</td>
              <td class='py-4 px-6'>{data.branch}</td>
              <td class='py-4 px-6'> {data.date_created.toDate().toISOString().substr(0, 10)}</td>
              <td class='py-4 px-6'> {data.shareable ? 'Shared' : 'Unshared'}</td>
              <td class='py-4 px-6'>{data.folder}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-end mt-5'>
        <button
          onClick={e => handleEditClick(e, data)}
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
        >
          Edit
        </button>
      </div>
    </>
  )
}

function EditRow({ handleCancel, handleEdit, data }) {
  return (
    <>
      <div className='overflow-x-auto relative shadow-lg rounded-lg'>
        <table className='w-full text-sm text-center text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='py-3 px-6 '>
                Case No.
              </th>
              <th scope='col' className='py-3 px-6'>
                Case Title
              </th>
              <th scope='col' className='py-3 px-6'>
                Pleading / Order
              </th>
              <th scope='col' className='py-3 px-6'>
                Pleading / Order Date
              </th>
              <th scope='col' className='py-3 px-6'>
                Handling Associate
              </th>
              <th scope='col' className='py-3 px-6'>
                Court
              </th>
              <th scope='col' className='py-3 px-6'>
                Branch
              </th>
              <th scope='col' className='py-3 px-6'>
                Date Created
              </th>
              <th scope='col' className='py-3 px-6'>
                Shareable
              </th>
              <th scope='col' className='py-3 px-6'>
                Folder
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
              <th scope='row' className='py-4 px-6 font-bold'>
                <a href={data.url}>{data.casenumber}</a>
              </th>
              <td class='py-4 px-6'>{data.casetitle}</td>
              <td class='py-4 px-6'>{data.pleading}</td>
              <td class='py-4 px-6'>{data.pleadingdate?.toDate().toISOString().substr(0, 10)}</td>
              <td class='py-4 px-6'>{data.author}</td>
              <td class='py-4 px-6'>{data.court}</td>
              <td class='py-4 px-6'>{data.branch}</td>
              <td class='py-4 px-6'> {data.date_created.toDate().toISOString().substr(0, 10)}</td>
              <td class='py-4 px-6'>
                <select onChange={handleEdit}>
                  {data.shareable ? (
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
              <td class='py-4 px-6'>{data.folder}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-end gap-1 mt-5'>
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
