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

export default function CaseFolders() {
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
  const [selectedLawyer, setSelectedLawyer] = useState()
  const [lawyerClients, setLawyerClients] = useState()
  const [selectedLawyerClient, setSelectedLawyerClient] = useState()
  const [lawyers, setLawyers] = useState()

  const caseTitleRef = useRef()
  const pleadingRef = useRef()
  const caseNoRef = useRef()
  const folderNameRef = useRef()
  const courtRef = useRef()
  const branchRef = useRef()

  const { username, initials, firstName, lastName } = UseUserReducer()

  const userColRef = collection(db, 'users')
  const lawyerRef = query(userColRef, where('role', '==', 'lawyer'))
  const foldersRef = collection(db, 'folders')

  const handleGetFiles = async folderid => {
    setFileList([])
    const folderRef = doc(db, `folders/${folderid}`)

    const snap = await getDoc(folderRef)

    setFileList(snap.data().files)
  }

  const getLawyerClients = async () => {
    const lawyer = query(userColRef, where('initials', '==', `${selectedLawyer}`))
    await getDocs(lawyer).then(snap => {
      let datas = snap.docs.map(doc => doc.data())
      datas.forEach(data => {
        setLawyerClients(data.clients)
      })
    })
  }

  const addFolder = async () => {
    const data = {
      folders: arrayUnion(`${folderNameRef.current.value}`),
    }
    const folderData = {
      foldername: folderNameRef.current.value,
      lawyer: selectedLawyer,
      clientid: selectedLawyerClient,
    }
    const lawyer = query(userColRef, where('initials', '==', `${selectedLawyer}`))

    await setDoc(doc(foldersRef, `${folderNameRef.current.value}`), folderData)
    await setDoc(lawyer, data, { merge: true }).then(() => {
      alert(`Updated successfully`)
    })
    folderNameRef.current.value = ''
    await getFolders()
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
    const snap = await getDoc(selectedFolderRef)
    const lawyerInitials = snap.data().lawyer

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
          lawyer: lawyerInitials,
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
    const snap = await getDocs(foldersRef)
    setFoldersList(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  const getLawyers = async () => {
    const snap = await getDocs(lawyerRef)
    setLawyers(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }
  useEffect(() => {
    getFolders()
    getLawyers()
    getLawyerClients()
  }, [selectedLawyer])

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
              <form onSubmit={handleEditFormSubmit}>
                <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
                  <details className='p-5'>
                    <summary
                      onClick={() => handleGetFiles(folder.id)}
                      className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold '
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
                <div className='flex flex-col justify-center items-center bg-[#e1dfdf] absolute h-[85%] w-[90%] gap-[10px] drop-shadow-lg rounded-md md:h-[75%] md:w-[70%] lg:h-[95%] lg:w-[35%] p-10'>
                  <div className='flex w-full lg:w-[60%] flex-col items-center justify-evenly mt-2 gap-[2px]'>
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                    shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={folderNameRef}
                      placeholder='Enter folder name'
                    />
                    <select
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                      shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => {
                        setSelectedLawyer(e.target.value)
                        getLawyerClients()
                      }}
                    >
                      <option value=''>-Select Lawyer-</option>
                      {lawyers.map(lawyer => (
                        <option value={lawyer.initials}>
                          {lawyer.firstname} {lawyer.lastname}
                        </option>
                      ))}
                    </select>
                    <select
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                      shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedLawyerClient(e.target.value)}
                    >
                      <option value=''>-Select Client-</option>
                      {lawyerClients?.map(client => (
                        <option value={client.id}>
                          {client.firstname} {client.lastname}
                        </option>
                      ))}
                    </select>
                    <button
                      className=' inline-block px-6 py-2.5 mt-1 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white w-full hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      onClick={addFolder}
                    >
                      Add Folder
                    </button>
                  </div>
                  <div className='flex w-full lg:w-[60%] flex-col items-center justify-evenly gap-[2px]'>
                    <select
                      className='bg-white self-center border-black outline-none border-b-[1px] 
                        shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={caseNoRef}
                      placeholder='Case Number'
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={caseTitleRef}
                      placeholder='Case Title'
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={pleadingRef}
                      placeholder='Pleading / Order'
                    />
                    <label className='font-bold' htmlFor='pleading-date'>
                      Pleading Date
                    </label>
                    <input
                      name='pleading-date'
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='date'
                      placeholder='Pleading Date'
                      onChange={e => setPleadingDate(e.target.value)}
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                        shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Court'
                      ref={courtRef}
                    />
                    <input
                      className='bg-white self-center border-black outline-none border-b-[1px] lg:h-[35px]
                        shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Branch (1-300)'
                      ref={branchRef}
                    />
                    <input
                      className='bg-[#e1dfdf] flex items-center justify-center h-[42px]
                       rounded w-full py-2 px-3 text-gray-700 '
                      type='file'
                      onChange={e => setFileUpload(e.target.files[0])}
                    />
                    <button
                      className=' inline-block mt-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon w-full hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
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

function ReadOnlyRow({ file, handleEditClick }) {
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
                Shareable
              </th>
              <th scope='col' className='py-3 px-6 '>
                Folder
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className=''>
              <th scope='row' className='py-4 px-6 font-bold'>
                {file.casenumber}
              </th>
              <td className='py-4 px-6 font-bold'>
                <a href={file.url}>{file.casetitle}</a>
              </td>
              <td className='py-4 px-6'>{file.pleading}</td>
              <td className='py-4 px-6'>
                {file.pleadingdate?.toDate().toISOString().substr(0, 10)}
              </td>
              <td className='py-4 px-6'>{file.author}</td>
              <td className='py-4 px-6'>{file.court}</td>
              <td className='py-4 px-6'>{file.branch}</td>
              <td className='py-4 px-6'>
                {file.date_created.toDate().toISOString().substr(0, 10)}
              </td>
              <td className='py-4 px-6'>{file.shareable ? 'Shared' : 'Unshared'}</td>
              <td className='py-4 px-6'>{file.folder}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-end mt-5'>
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
              {file.casenumber}
            </th>
            <td className='py-4 px-6 border border-slate-700'>
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
          <tr className=''>
            <th scope='row' className='py-4 px-2 font-normal border-slate-700 text-center'>
              {file.date_created.toDate().toISOString().substr(0, 10)}
            </th>
            <td className='py-4 px-6 border border-slate-700'>
              <select onChange={handleEdit}>
                {file.shareable ? (
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
            <td className='py-4 px-4 border border-slate-700'>{file.folder}</td>
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
