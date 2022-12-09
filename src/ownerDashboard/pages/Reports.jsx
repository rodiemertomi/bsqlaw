import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { db } from '../../firebase'

export default function Reports() {
  const [logs, setLogs] = useState([])
  const [totalCaseFolders, setTotalCaseFolders] = useState(0)
  const [activeCaseFolders, setActiveCaseFolders] = useState(0)
  const [inactiveCaseFolders, setInactiveCaseFolders] = useState(0)
  const [totalAccounts, setTotalAccounts] = useState(0)
  const [partnerAccounts, setPartnerAccounts] = useState(0)
  const [adminAccounts, setAdminAccounts] = useState(0)
  const [lawyerAccounts, setLawyerAccounts] = useState(0)
  const [clientAccounts, setClientAccounts] = useState(0)
  const [totalAccounting, setTotalAccounting] = useState(0)
  const [totalSoa, setTotalSoa] = useState(0)
  const [totalOr, setTotalOr] = useState(0)
  const [totalCv, setTotalCv] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [lawyerList, setLawyerList] = useState([])
  const [handledBy, setHandledBy] = useState([])

  const getLogs = async () => {
    const logRef = doc(db, 'reports', 'LOGS')
    const data = await getDoc(logRef)
    setLogs(data.data().logArray)
  }

  const formatDate = date => {
    let hoursArray = [date.getHours(), date.getMinutes()]
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return hoursArray.join(':') + ' - ' + dateArray.join('/')
  }
  const sortedLogs = logs.slice().sort((a, b) => b.timestamp - a.timestamp)

  const getCaseFolders = async () => {
    const foldersRef = collection(db, 'folders')
    const activeQ = query(foldersRef, where('active', '==', true))
    const inactiveQ = query(foldersRef, where('active', '==', false))
    await getDocs(foldersRef).then(snap => setTotalCaseFolders(snap.size - 1))
    await getDocs(activeQ).then(snap => setActiveCaseFolders(snap.size))
    await getDocs(inactiveQ).then(snap => setInactiveCaseFolders(snap.size))
  }

  const getAllFiles = async () => {
    const filesRef = collection(db, 'files')
    await getDocs(filesRef).then(snap => setTotalFiles(snap.size))
  }

  const getAccounts = async () => {
    const accountsRef = collection(db, 'users')
    const partnersQ = query(accountsRef, where('role', '==', 'partner'))
    const adminQ = query(accountsRef, where('role', '==', 'admin'))
    const lawyerQ = query(accountsRef, where('role', '==', 'lawyer'))
    const clientQ = query(accountsRef, where('role', '==', 'client'))
    await getDocs(accountsRef).then(snap => setTotalAccounts(snap.size - 1))
    await getDocs(partnersQ).then(snap => setPartnerAccounts(snap.size))
    await getDocs(adminQ).then(snap => setAdminAccounts(snap.size))
    await getDocs(lawyerQ).then(snap => {
      setLawyerAccounts(snap.size)
      setLawyerList(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
    await getDocs(clientQ).then(snap => setClientAccounts(snap.size))
  }

  const getHandledFiles = async () => {
    const filesRef = collection(db, 'files')
    let data = []
    lawyerList?.map(async lawyer => {
      const filesQ = query(filesRef, where('lawyer', '==', lawyer.initials))
      await getDocs(filesQ).then(snap => data.push({ lawyer: lawyer.initials, size: snap.size }))
    })
    setHandledBy(data)
  }
  console.log(handledBy)

  const getAccounting = async () => {
    const soaRef = collection(db, 'soa')
    const orRef = collection(db, 'or')
    const cvRef = collection(db, 'cv')
    let totalAccountingFiles = 0
    await getDocs(soaRef).then(snap => {
      totalAccountingFiles = totalAccountingFiles + snap.size - 1
      setTotalSoa(snap.size - 1)
    })
    await getDocs(orRef).then(snap => {
      totalAccountingFiles = totalAccountingFiles + snap.size - 1
      setTotalOr(snap.size - 1)
    })
    await getDocs(cvRef).then(snap => {
      totalAccountingFiles = totalAccountingFiles + snap.size - 1
      setTotalCv(snap.size - 1)
    })
    setTotalAccounting(totalAccountingFiles)
  }

  useEffect(() => {
    getAccounts()
    getLogs()
    getCaseFolders()
    getAccounting()
    getAllFiles()
    getHandledFiles()
  }, [])

  return (
    <div className='h-screen w-screen font-poppins overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <div className='w-full flex item-center mb-2'>
        <h1 className='self-center text-base lg:text-[30px] w-full mt-3 ml-5 font-bold lg:ml-28'>
          BSQ Reports
        </h1>
        <img
          alt='bsq logo'
          className='w-[80px] mr-4 pt-3'
          src={require('../../assets/officialBSQlogoBlack.png')}
        />
      </div>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto pb-2 pl-5 pr-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center gap-1 lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='h-[60%] w-full flex items-center justify-center'>
            <div className=' w-[350px] px-2 pt-2 flex flex-col items-center justify-center '>
              <div
                className={`flex justify-center items-center font-semibold border-black border-[2px] w-full rounded-t-2xl h-10 bg-white text-black`}
              >
                CASE FOLDERS
              </div>
              <div className='flex flex-col w-full h-[230px] border-[2px] border-black items-center justify-center pr-6 pl-6 pt-3 pb-3 bg-white rounded-b-2xl'>
                <div className='overflow-auto w-full text-base font-light flex flex-col gap-2'>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Total: {totalCaseFolders}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Active: {activeCaseFolders}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Archive: {inactiveCaseFolders}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className=' w-[350px] px-2 pt-2 flex flex-col items-center justify-center '>
              <div
                className={`flex justify-center items-center font-semibold border-black border-[2px] w-full rounded-t-2xl h-10 bg-white text-black`}
              >
                CASE FILES
              </div>
              <div className='flex flex-col w-full h-[230px] border-[2px] border-black items-center justify-center pr-6 pl-6 pt-3 pb-3 bg-white rounded-b-2xl'>
                <div className='overflow-auto w-full text-base font-light flex flex-col gap-2'>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 mt-5'>
                    <span>Total Case Files: {totalFiles}</span>
                  </div>
                  {lawyerList?.map((lawyer, i) =>
                    handledBy?.map(handler =>
                      i === lawyerList.length - 1 ? (
                        handler.lawyer === lawyer.initials ? (
                          <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 mb-5'>
                            <span>
                              Handled By {lawyer.initials}: {handler.size}
                            </span>
                          </div>
                        ) : (
                          ''
                        )
                      ) : handler.lawyer === lawyer.initials ? (
                        <div className='w-full bg-maroon rounded-md text-white p-3 pl-5'>
                          <span>
                            Handled By {lawyer.initials}: {handler.size}
                          </span>
                        </div>
                      ) : (
                        ''
                      )
                    )
                  )}
                </div>
              </div>
            </div>
            <div className=' w-[350px] px-2 pt-2 flex flex-col items-center justify-center '>
              <div
                className={`flex justify-center items-center font-semibold border-black border-[2px] w-full rounded-t-2xl h-10 bg-white text-black`}
              >
                USER ACCOUNTS
              </div>
              <div className='flex flex-col w-full h-[230px] border-[2px] border-black items-center justify-center pr-6 pl-6 pt-3 pb-3 bg-white rounded-b-2xl'>
                <div className='overflow-auto w-full text-base font-light flex flex-col gap-2'>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 mt-5'>
                    <span>Total: {totalAccounts}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Partners: {partnerAccounts}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Admins: {adminAccounts}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Lawyers: {lawyerAccounts}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 mb-5'>
                    <span>Clients: {clientAccounts}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className=' w-[350px] px-2 pt-2 flex flex-col items-center justify-center '>
              <div
                className={`flex justify-center items-center font-semibold border-black border-[2px] w-full rounded-t-2xl h-10 bg-white text-black`}
              >
                ACCOUNTING
              </div>
              <div className='flex flex-col w-full h-[230px] border-[2px] border-black items-center justify-center pr-6 pl-6 pt-3 pb-3 bg-white rounded-b-2xl'>
                <div className='overflow-auto w-full text-base font-light flex flex-col gap-2'>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 mt-5'>
                    <span>Total: {totalAccounting}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Statement of Accounts: {totalSoa}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                    <span>Official Receipts: {totalOr}</span>
                  </div>
                  <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 mb-5'>
                    <span>Check Vouchers: {totalCv}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='h-[40%] w-full px-2 pb-2'>
            <div className='flex flex-col h-full'>
              <div
                className={` flex justify-center items-center font-semibold border-black border-[2px] w-full rounded-t-2xl h-14 bg-white text-black`}
              >
                LOGS
              </div>
              <div
                className={` flex justify-center overflow-y-scroll border-black border-2 w-full bg-white text-black`}
              >
                <table className='w-full h-full text-sm text-center text-gray-500 border-collapse border border-slate-500'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='px-2 text-left lg:text-sm border border-slate-600 w-[70%]'
                      >
                        Description
                      </th>
                      <th
                        scope='col'
                        className='px-2 text-right lg:text-sm border border-slate-600 w-[30%]'
                      >
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLogs?.map(log => (
                      <Logs data={log} formatDate={formatDate} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Logs({ data, formatDate }) {
  return (
    <>
      <tr>
        <td className='px-2 text-left border border-slate-700'>{data.description}</td>
        <td className='px-2 text-right border border-slate-700'>
          {formatDate(data.timestamp.toDate())}
        </td>
      </tr>
    </>
  )
}
