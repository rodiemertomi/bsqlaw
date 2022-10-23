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
  const fileNameRef = useRef()
  const folderNameRef = useRef()
  const courtRef = useRef()
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
      console.log(`updated successfully`)
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
    const fileUrl = `caseFiles/${username}/${folderOption}/${fileNameRef.current.value}.${extension}`
    const fileRef = ref(storage, fileUrl)
    await uploadBytes(fileRef, fileUpload).then(snapshot => {
      getDownloadURL(snapshot.ref).then(async url => {
        const data = {
          active: true,
          filename: snapshot.ref.name,
          date_created: new Date().toString(),
          author: initials,
          folder: folderOption,
          shareable: false,
          url: url,
          court: courtRef.current.value,
        }
        const colRef = collection(db, `files`)
        const docRef = doc(colRef)
        await setDoc(docRef, data).then(() => {
          alert('successfully added file in firestore')
        })
      })
    })
    setFileUpload(null)
    setFolderOption('')
    fileNameRef.current.value = ''
    courtRef.current.value = ''
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
        <div className='w-[100%] h-[100%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-col gap-2 lg:w-[100%] overflow-auto scrollbar-hide'>
            {foldersList?.map(folder => (
              <form onSubmit={handleEditFormSubmit}>
                <div className='bg-[#9C9999] flex items-center rounded-lg shadow-lg w-[100%] '>
                  <details className='p-2'>
                    <summary
                      className='cursor-pointer text-md uppercase pl-2 font-bold '
                      onClick={() => handleGetFiles()}
                    >
                      {folder}
                    </summary>
                    {fileList?.map(file =>
                      file?.map(data => (
                        <Fragment key={data.id}>
                          {data.folder === folder ? (
                            readState ? (
                              <ReadOnlyRow
                                filename={data.filename}
                                shareable={data.shareable}
                                url={data.url}
                                date_created={data.date_created}
                                court={data.court}
                                initials={initials}
                                data={data}
                                handleEditClick={handleEditClick}
                                folder={data.folder}
                              />
                            ) : (
                              <EditRow
                                editFormData={editFormData}
                                filename={data.filename}
                                shareable={data.shareable}
                                url={data.url}
                                date_created={data.date_created}
                                court={data.court}
                                initials={initials}
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
              <div className='w-screen h-screen backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center bg-[#BABABA] absolute h-[65%] w-[90%] gap-5 shadow-lg rounded-md md:h-[55%] md:w-[70%] lg:h-[80%] lg:w-[40%] '>
                  <div className='flex flex-col items-center gap-2'>
                    <h1 className='font-bold text-2xl'>ADD FILE</h1>
                    <hr className='w-64' />
                  </div>
                  <div className='flex flex-col items-center justify-evenly gap-5 mt-5'>
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                        shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={fileNameRef}
                      placeholder='Enter Filename'
                    />
                    <select
                      className='bg-white self-center border-black outline-none border-b-[1px] 
                        shadow border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      name='folders'
                      id='folders'
                      value={folderOption}
                      onChange={e => {
                        setFolderOption(e.target.value)
                        console.log(e.target.value)
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
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                        shadow appearance-none border rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Court'
                      ref={courtRef}
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
                  <div className='flex justify-center gap-2'>
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                         shadow appearance-none border rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={folderNameRef}
                      placeholder='Enter folder name'
                    />
                    <button
                      className=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      onClick={addFolder}
                    >
                      Add Folder
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
        {/* Second Div */}
        <div className='w-[100%] h-[100%] lg:h-[100%] lg:w-[30%]'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start shadow-lg  text-white bg-maroon rounded-md lg:h-[50%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({
  filename,
  url,
  shareable,
  date_created,
  initials,
  court,
  handleEditClick,
  data,
  folder,
}) {
  return (
    <>
      <table className='w-full text-sm  border-solid border-[1px]'>
        <thead className='text-xs text-gray-700 uppercase '></thead>
        <tr>
          <th scope='col' className='py-3 px-6  border-solid border-[1px]'>
            Case No.
          </th>
          <th scope='col' className='py-3 px-6  border-solid border-[1px]'>
            Handling Associate
          </th>
          <th scope='col' className='py-3 px-6  border-solid border-[1px]'>
            Court
          </th>
        </tr>
      </table>
      <tbody>
        <tr className='border-b dark:bg-gray-800 dark:border-gray-700'>
          <th
            scope='row'
            className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
          >
            <a href={url}>{filename}</a>
          </th>
          <td className='py-4 px-6'>{initials}</td>
          <td className='py-4 px-6'>{court}</td>
        </tr>
      </tbody>
    </>
  )
}

function EditRow({
  filename,
  url,
  shareable,
  date_created,
  initials,
  court,
  handleCancel,
  handleEdit,
}) {
  return <></>
}
