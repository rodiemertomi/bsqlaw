import React, { useState, useEffect, Fragment } from 'react'
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
  arrayRemove,
} from 'firebase/firestore'
import UseUserReducer from '../../UserReducer'
import moment from 'moment'

export default function Timesheets() {
  const months = moment.months()
  const weeks = ['First', 'Second', 'Third', 'Fourth']
  let years = []
  let i = 0
  for (i; i <= 10; i++) {
    let year = moment().year() - i
    years.push(year)
  }

  const [loading, setLoading] = useState(false)
  const [fileUpload, setFileUpload] = useState(null)
  const [selectedYear, setSelectedYear] = useState(moment().year().toString())
  const [selectedMonth, setSelectedMonth] = useState()
  const [selectedWeek, setSelectedWeek] = useState()
  const [searchYear, setSearchYear] = useState(moment().year())
  const [files, setFiles] = useState([])
  const [remarks, setRemarks] = useState('')

  const { username, initials } = UseUserReducer()

  const uploadFile = async () => {
    setLoading(true)
    if (fileUpload === null) {
      alert('Please select a file.')
      setLoading(false)
      return
    }
    const filename = fileUpload.name.replace(/\.[^/.]+$/, '')
    const timesheetsref = doc(db, `timesheets/${selectedYear}-${selectedMonth}-${selectedWeek}`)
    const fileUrl = `timesheets/${username}/${selectedYear}/${selectedMonth}/${selectedWeek}/${fileUpload.name}`
    const fileRef = ref(storage, fileUrl)
    await uploadBytes(fileRef, fileUrl).then(snap => {
      getDownloadURL(snap.ref).then(async url => {
        const data = {
          filename: filename,
          year: selectedYear.toString(),
          month: selectedMonth,
          week: selectedWeek,
          uploader: initials,
          url: url,
          remarks: remarks,
        }
        const dataInput = {
          files: arrayUnion(data),
          year: selectedYear.toString(),
          week: selectedWeek,
          month: selectedMonth,
        }
        await setDoc(timesheetsref, dataInput, { merge: true }).then(() => {
          alert('Uploaded file successfully.')
          getFiles()
        })
      })
    })

    setLoading(false)
  }

  const handleDeleteFile = async (e, file, id) => {
    e.preventDefault()
    const docRef = doc(db, `timesheets/${id}`)
    if (window.confirm('Are you sure you want to delete this file?') === true) {
      const data = {
        filename: file.filename,
        year: file.year,
        month: file.month,
        week: file.week,
        uploader: file.uploader,
        url: file.url,
        remarks: file.remarks,
      }
      const remove = {
        files: arrayRemove(data),
      }

      await setDoc(docRef, remove, { merge: true }).then(() => {
        alert('Deleted File.')
        getFiles()
      })
    } else {
      return
    }
    return
  }

  const getFiles = async () => {
    const colRef = collection(db, 'timesheets')
    const yearRef = query(colRef, where('year', '==', `${searchYear}`))
    await getDocs(yearRef).then(snap => {
      setFiles(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getFiles()
  }, [searchYear])

  const [showModal, setShowModal] = useState(false)

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>BSQ Timesheets</h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='h-[50px] flex flex-row justify-center gap-2 item-center self-end mb-2 mt-1 mr-6'>
            <select
              className='mt-2 h-9 bg-white self-center border-black outline-none border-b-[1px]
                      shadow border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              onChange={e => setSearchYear(e.target.value)}
            >
              <option value={moment().year()}>{moment().year()}</option>
              {years?.map(year =>
                year === moment().year() ? '' : <option value={year}>{year}</option>
              )}
            </select>
            <button
              type='button'
              onClick={() => {
                setShowModal(true)
              }}
              className='mt-2 w-full inline-block px-5 bg-blue-600 text-black font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-white hover:bg-[#471414] hover:text-white active:shadow-lg transition duration-150 ease-in-out'
            >
              Upload Timesheet
            </button>

            {showModal && (
              <div className='w-screen h-screen z-20 bg-modalbg absolute top-0 left-0 flex justify-center items-center'>
                <div className='flex flex-col animate-[moveTop_0.3s_ease-in-out] justify-center items-center bg-[#e1dfdf] absolute h-[65%] w-[90%] drop-shadow-lg gap-5 rounded-md md:h-[50%] md:w-[60%] lg:h-[77%] lg:w-[30%] p-14'>
                  <div className=' flex w-full flex-col items-center justify-evenly mt-2 gap-4'>
                    <h1 className='font-bold w-full text-xl text-center'>UPLOAD TIMESHEET</h1>
                    <select
                      className=' h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedYear(e.target.value)}
                    >
                      <option value={moment().year()}>{moment().year()}</option>
                      {years?.map(year =>
                        year === moment().year() ? '' : <option value={year}>{year}</option>
                      )}
                    </select>
                    <select
                      className=' h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedMonth(e.target.value)}
                    >
                      <option value=''>Select Month</option>
                      {months?.map(month => (
                        <option value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      className='h-10 bg-white self-center border-maroon outline-none border-b-[1px]
                      shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={e => setSelectedWeek(e.target.value)}
                    >
                      <option value=''>Select Week</option>
                      {weeks?.map(week => (
                        <option value={week}>{week}</option>
                      ))}
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
                      Upload Timesheet
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
            {months?.map(month => (
              <Fragment>
                <div className='bg-[#FFF] flex items-center rounded-lg shadow-lg w-[100%] lg:w-[100%] '>
                  <details className='p-5 w-full'>
                    <summary className='cursor-pointer text-md uppercase lg:text-2xl md:text-2xl font-bold flex justify-between'>
                      {month}
                    </summary>
                    {weeks?.map(week => (
                      <>
                        <summary className='cursor-pointer text-maroon pl-5 text-md uppercase lg:text-md md:text-md font-bold flex justify-between pt-2'>
                          {week} Week
                        </summary>
                        {files?.map(file =>
                          file.month === month && file.week === week ? (
                            <ReadOnlyRow
                              files={file.files}
                              month={month}
                              week={week}
                              id={file.id}
                              handleDeleteFile={handleDeleteFile}
                            />
                          ) : (
                            ''
                          )
                        )}
                      </>
                    ))}
                  </details>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadOnlyRow({ files, handleDeleteFile, id }) {
  return (
    <>
      {files.map(file => (
        <>
          <div className='overflow-x-auto relative shadow-lg rounded-lg mt-5'>
            <table className='w-full text-sm text-center text-gray-500 border border-gray'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
                <tr>
                  <th scope='col' className='py-3 px-6 '>
                    File Name
                  </th>
                  <th scope='col' className='py-3 px-6 '>
                    Upload By
                  </th>
                  <th scope='col' className='py-3 px-6 '>
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
                  <td className='py-4 px-6 font-bold'>
                    <a href={file.url}>{file.filename}</a>
                  </td>
                  <td className='py-4 px-6'>{file.uploader}</td>
                  <td className='py-4 px-6'>{file.remarks}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='flex justify-end mt-5 gap-4'>
            <button
              onClick={e => handleDeleteFile(e, file, id)}
              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Delete File
            </button>
          </div>
        </>
      ))}
    </>
  )
}
