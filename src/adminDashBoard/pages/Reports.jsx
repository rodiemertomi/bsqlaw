import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { db } from '../../firebase'

export default function Reports() {
  const [logs, setLogs] = useState([])

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

  useEffect(() => {
    getLogs()
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
        <div className='w-[100%] h-[100%] shadow-lg bg-maroon rounded-md flex flex-col items-center lg:w-[100%] lg:h-[100%] lg:ml-20 lg:mr-2 '>
          <div className='h-[70%]'>Analytics</div>
          <div className='h-[30%] w-full px-2'>
            <div className='flex flex-col h-full'>
              <div
                className={`font-Lora flex justify-center items-center font-semibold border-black border-[2px] w-full rounded-t-2xl h-14 bg-white text-black`}
              >
                LOGS
              </div>
              <div
                className={`font-Lora flex justify-center overflow-y-scroll border-black border-2 w-full bg-white text-black mb-2`}
              >
                <table className='w-full h-full text-sm text-center text-gray-500 border-collapse border border-slate-500 mb-2'>
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
