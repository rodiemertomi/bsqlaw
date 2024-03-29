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
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'
import { nanoid } from 'nanoid'
import reportLog from '../../components/ReportLog'

export default function CaseFolders() {
  const [loading, setLoading] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [foldersList, setFoldersList] = useState([])
  const [pleadingDate, setPleadingDate] = useState()
  const [folderOption, setFolderOption] = useState('')
  const [editFileId, setEditFileId] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [selectedLawyer, setSelectedLawyer] = useState()
  const [lawyerClients, setLawyerClients] = useState()
  const [selectedLawyerClient, setSelectedLawyerClient] = useState()
  const [lawyers, setLawyers] = useState()
  const [partnersList, setPartnersList] = useState()
  const [selectedPartner, setSelectedPartner] = useState()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [files, setFiles] = useState([])

  const caseTitleRef = useRef()
  const pleadingRef = useRef()
  const caseNoRef = useRef()
  const folderNameRef = useRef()
  const courtRef = useRef()
  const branchRef = useRef()

  const { username, initials } = UseUserReducer()

  const userColRef = collection(db, 'users')
  const lawyerRef = query(userColRef, where('role', '==', 'lawyer'))
  const partnersRef = query(userColRef, where('role', '==', 'partner'))
  const foldersRef = collection(db, 'folders')
  const activeFolders = query(foldersRef, where('active', '==', true))

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
    setLoading(true)
    const folderData = {
      foldername: folderNameRef.current.value,
      lawyer: selectedLawyer,
      clientid: selectedLawyerClient,
      handlingpartner: selectedPartner,
      active: true,
    }
    await setDoc(doc(foldersRef, `${folderNameRef.current.value}`), folderData).then(() => {
      reportLog(`${username} added folder ${folderNameRef.current.value}.`)
      alert('Added folder successfully')
      getFolders()
      setLoading(false)
    })
    folderNameRef.current.value = ''
    setLoading(false)
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
    const fileUrl = `caseFiles/${username}/${folderOption}/${pleadingRef.current.value}.${extension}`
    const fileRef = ref(storage, fileUrl)
    await uploadBytes(fileRef, fileUpload).then(snapshot => {
      getDownloadURL(snapshot.ref).then(async url => {
        const data = {
          active: true,
          id: nanoid(),
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
        const filesRef = doc(db, `files/${data.id}`)
        await setDoc(filesRef, data).then(() => {
          reportLog(`${username} uploaded ${pleadingRef.current.value} to ${folderOption}.`)
          alert('Successfully added file in firestore')
          getFolders()
          getFiles()
          setLoading(false)
        })
      })
    })
    setLoading(false)
  }

  const handleEditClick = (e, data, folderid) => {
    e.preventDefault()
    setEditFileId(data.id)

    const formValues = {
      active: data.active,
      branch: data.branch,
      casenumber: data.casenumber,
      casetitle: data.casetitle,
      court: data.court,
      date_created: data.date_created,
      folder: data.folder,
      id: data.id,
      lawyer: data.lawyer,
      pleading: data.pleading,
      pleadingdate: data.pleadingdate,
      shareable: data.shareable,
      uploadby: data.uploadby,
      url: data.url,
    }
    setEditFormData(formValues)
  }

  const handleEditFormChange = e => {
    e.preventDefault()
    const fieldName = e.target.getAttribute('name')
    const fieldValue = e.target.value

    const newFormData = { ...editFormData }
    newFormData[fieldName] = fieldValue

    setEditFormData(newFormData)
  }

  const handleCancel = () => {
    setEditFileId(null)
  }

  const handleEditFormSubmit = async e => {
    setLoading(true)
    e.preventDefault()
    const fileRef = doc(db, `files/${editFileId}`)

    const editedFile = {
      active: editFormData.active,
      branch: editFormData.branch,
      casenumber: editFormData.casenumber,
      casetitle: editFormData.casetitle,
      court: editFormData.court,
      date_created: editFormData.date_created,
      folder: editFormData.folder,
      id: editFormData.id,
      lawyer: editFormData.lawyer,
      pleading: editFormData.pleading,
      pleadingdate: editFormData.pleadingdate,
      shareable: editFormData.shareable,
      uploadby: editFormData.uploadby,
      url: editFormData.url,
    }
    await setDoc(fileRef, editedFile, { merge: true }).then(() => {
      alert('Update Successful')
      reportLog(`${username} edited ${editFormData.pleading} in ${editFormData.folder}`)
      setEditFileId(null)
      getFolders()
      getFiles()
      setLoading(false)
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

  const handleDeleteFolder = async (e, folderid) => {
    setLoading(true)
    e.preventDefault()
    if (
      window.confirm('Are you sure you want to delete this folder and all its contents?') === true
    ) {
      const ref = doc(db, `folders/${folderid}`)
      reportLog(`${username} deleted folder ${folderid}`)
      await deleteDoc(ref).then(() => {
        alert('Deleted Folder.')
        getFolders()
        setLoading(false)
      })
    } else {
      setLoading(false)
      return
    }
  }

  const archiveFolder = async (e, folderId) => {
    setLoading(true)
    e.preventDefault()
    if (
      window.confirm('Are you sure you want to archive this folder and all its contents?') === true
    ) {
      const ref = doc(db, `folders/${folderId}`)
      reportLog(`${username} archived folder ${folderId}`)

      await setDoc(ref, { active: false }, { merge: true }).then(() => {
        alert('Archived Folder.')
        getFolders()
        setLoading(false)
        return
      })
    } else {
      setLoading(false)
      return
    }
  }

  const handleDeleteFile = async (e, file) => {
    setLoading(true)
    e.preventDefault()
    const filesRef = doc(db, `files/${file.id}`)
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
      await deleteDoc(filesRef).then(() => {
        reportLog(`${username} deleted ${deleteFile.pleading} in ${deleteFile.folder}`)
        alert('File deleted')
        getFiles()
        setLoading(true)
      })
    } else {
      setLoading(false)
      return
    }
    return
  }

  const getFolders = async () => {
    const snap = await getDocs(activeFolders)
    setFoldersList(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  const getLawyers = async () => {
    const snap = await getDocs(lawyerRef)
    setLawyers(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  const getPartners = async () => {
    await getDocs(partnersRef).then(snap => {
      setPartnersList(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getFiles = async () => {
    const filesRef = collection(db, 'files')
    await getDocs(filesRef).then(snap => {
      setFiles(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getFolders()
    getLawyers()
    getPartners()
    getLawyerClients()
    getFiles()
  }, [selectedLawyer])

  const [showModal, setShowModal] = useState(false)
  const [showUpdateFolder, setShowUpdateFolder] = useState(false)

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
              <div className='flex lg:gap-2'>
                <button
                  disabled={loading}
                  type='button'
                  onClick={() => {
                    setShowModal(true)
                  }}
                  className=' inline-block font-bold px-6 py-2.5 bg-blue-600 text-black text-xs leading-tight uppercase rounded-3xl shadow-md bg-white hover:bg-[#471414] hover:text-white active:shadow-lg transition duration-150 ease-in-out'
                >
                  Add Folder
                </button>
                <button
                  disabled={loading}
                  type='button'
                  onClick={() => {
                    setShowUpdateFolder(true)
                  }}
                  className=' inline-block px-6 font-bold py-2.5 bg-blue-600 text-black text-xs leading-tight uppercase rounded-3xl shadow-md bg-white hover:bg-[#471414] hover:text-white active:shadow-lg transition duration-150 ease-in-out'
                >
                  Upload File
                </button>
              </div>
            </div>
            {showModal && (
              <div className='w-screen h-screen z-20 bg-modalbg absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex p-4 flex-col animate-[moveTop_0.3s_ease-in-out] justify-center items-center bg-[#e1dfdf] absolute h-[55%] w-[90%] drop-shadow-lg gap-5 rounded-md md:h-[50%] md:w-[60%] lg:h-[450px] lg:w-[420px]'>
                  <div className='flex w-full lg:w-[60%] flex-col items-center justify-evenly mt-3 gap-5'>
                    <h1 className='font-bold text-3xl'>ADD FOLDER</h1>
                    <input
                      className='h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                    shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      ref={folderNameRef}
                      placeholder='Enter folder name'
                    />
                    <select
                      className='h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => {
                        setSelectedPartner(e.target.value)
                      }}
                    >
                      <option value=''>Select Handling Partner</option>
                      {partnersList.map(partner => (
                        <option value={partner.initials}>
                          {partner.firstname} {partner.lastname}
                        </option>
                      ))}
                    </select>
                    <select
                      className='h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedLawyer(e.target.value)}
                    >
                      <option value=''>Select Lawyer</option>
                      {lawyers.map(lawyer => (
                        <option value={lawyer.initials}>
                          {lawyer.firstname} {lawyer.lastname}
                        </option>
                      ))}
                    </select>
                    <select
                      className='h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedLawyerClient(e.target.value)}
                    >
                      <option value=''>Select Client</option>
                      {lawyerClients?.map(client => (
                        <option value={client.id}>{client.username}</option>
                      ))}
                    </select>
                    <button
                      className=' inline-block px-6 py-2.5 mt-1 text-white text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white w-full hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      onClick={addFolder}
                    >
                      Add Folder
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
            {showUpdateFolder && (
              <div className='w-screen z-20 h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex w-[90%] h-[70%] animate-[moveTop_0.3s_ease-in-out]  pt-2 pb-2 md:w-[50%] bg-[#D9D9D9] rounded-md lg:h-[620px] lg:w-[420px] flex-col items-center justify-evenly gap-1'>
                  <h1 className='font-bold text-2xl'>UPDATE FOLDER</h1>
                  <select
                    className='mt-2 bg-white h-10 self-center border-black outline-none border-b-[1px] 
                        shadow border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                    className='bg-white self-center border-black outline-none border-b-[1px] h-10
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    ref={caseNoRef}
                    placeholder='Case Number'
                  />
                  <input
                    className='bg-white self-center border-black outline-none border-b-[1px] h-10
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    ref={caseTitleRef}
                    placeholder='Case Title'
                  />
                  <input
                    className='bg-white self-center border-black outline-none border-b-[1px] h-10
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
                    className='bg-white self-center border-black outline-none border-b-[1px] h-10
                          shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='date'
                    placeholder='Pleading Date'
                    onChange={e => setPleadingDate(e.target.value)}
                  />
                  <input
                    className='bg-white self-center border-black outline-none border-b-[1px] h-10
                        shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Enter Court'
                    ref={courtRef}
                  />
                  <input
                    className='bg-white self-center border-black outline-none border-b-[1px] h-10
                        shadow appearance-none border rounded w-[65%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Enter Branch (1-300)'
                    ref={branchRef}
                  />
                  <input
                    className='bg-[#e1dfdf] flex items-center justify-center h-10
                       rounded w-[65%] py-2 px-3 text-gray-700 '
                    type='file'
                    onChange={e => setFileUpload(e.target.files[0])}
                  />
                  <button
                    className=' inline-block mt-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon w-[65%] hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                    disabled={loading}
                    onClick={uploadFile}
                  >
                    Upload
                  </button>
                  <p
                    className='mt-2 text-maroon text-sm cursor-pointer hover:text-black hover:font-bold'
                    onClick={() => setShowUpdateFolder(false)}
                  >
                    Close
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className='w-[100%] h-[100%] pt-3 pl-5 pr-5 flex flex-col gap-2 lg:w-[100%] overflow-auto pb-5'>
            {foldersList?.map(folder => (
              <>
                {folder.id === 'DONOTDELETE' ? (
                  ''
                ) : (
                  <form onSubmit={handleEditFormSubmit}>
                    <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] '>
                      <details className='p-5 w-full'>
                        <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-between'>
                          <div>{folder.foldername}</div> <div>{folder.handlingpartner}</div>{' '}
                          <div>
                            <button
                              className='mr-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                              onClick={e => archiveFolder(e, folder.id)}
                            >
                              Archive Folder
                            </button>
                            <button
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
                              editFileId === file.id ? (
                                <EditRow
                                  editFormData={editFormData}
                                  file={file}
                                  handleCancel={handleCancel}
                                  handleEditFormChange={handleEditFormChange}
                                  lawyers={lawyers}
                                />
                              ) : (
                                <ReadOnlyRow
                                  file={file}
                                  handleEditClick={handleEditClick}
                                  folderid={folder.id}
                                  handleDeleteFile={handleDeleteFile}
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
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ file, handleEditClick, folderid, handleDeleteFile }) {
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
      <div className='flex justify-end mt-5 gap-4'>
        <button
          onClick={e => handleEditClick(e, file, folderid)}
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
        >
          Edit
        </button>
        <button
          onClick={e => handleDeleteFile(e, file, folderid)}
          className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
        >
          Delete File
        </button>
      </div>
    </>
  )
}

function EditRow({ handleCancel, file, editFormData, handleEditFormChange, lawyers }) {
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
                <input
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Case Number'
                  name='casenumber'
                  value={editFormData.casenumber}
                  onChange={handleEditFormChange}
                />
              </th>
              <td className='py-4 px-6 font-bold'>
                <input
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Case Title'
                  name='casetitle'
                  value={editFormData.casetitle}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Pleading / Order'
                  name='pleading'
                  value={editFormData.pleading}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  type='date'
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  name='pleadingdate'
                  value={editFormData.pleadingdate}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <select name='lawyer' onChange={handleEditFormChange}>
                  {lawyers.map(lawyer => (
                    <option value={lawyer.initials}>
                      {lawyer.firstname} {lawyer.lastname}
                    </option>
                  ))}
                </select>
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Court'
                  name='court'
                  value={editFormData.court}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Branch'
                  name='branch'
                  value={editFormData.branch}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                {file.date_created.toDate().toISOString().substr(0, 10)}
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-3/4 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Folder'
                  name='folder'
                  value={editFormData.folder}
                  onChange={handleEditFormChange}
                />
              </td>
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
