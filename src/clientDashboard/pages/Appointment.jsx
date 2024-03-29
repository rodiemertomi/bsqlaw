import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import 'react-calendar/dist/Calendar.css'
import { db } from '../../firebase'
import UseUserReducer from '../../UserReducer'

export default function Appointment() {
  const { id } = UseUserReducer()
  const [appointments, setAppointments] = useState()

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  const getAppointments = async () => {
    const colRef = collection(db, 'appointments')
    const q = query(colRef, where('clientId', '==', id))
    await getDocs(q).then(snap => {
      setAppointments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getAppointments()
  }, [])

  return (
    <div className='h-screen w-screen font-poppins overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <div className='w-full flex item-center mb-2'>
        <h1 className='self-center text-base lg:text-[30px] w-full mt-3 ml-5 font-bold lg:ml-28'>
          Appointments
        </h1>
        <img
          alt='bsq logo'
          className='w-[80px] mr-4 pt-3'
          src={require('../../assets/officialBSQlogoBlack.png')}
        />
      </div>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto pb-2 pl-5 pr-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-maroon rounded-md flex flex-col gap-2 items-center lg:w-[100%] lg:h-[100%] lg:ml-20  lg:mr-3'>
          <div className='w-[100%] pl-5 pt-5 pr-5 flex flex-wrap gap-3 justify-center lg:justify-center lg:w-[100%] overflow-auto'>
            {appointments?.map(appointment => (
              <div
                key={appointment.id}
                className='bg-[#FFF] drop-shadow-lg p-2 w-[100%] rounded-md flex flex-col gap-2 '
              >
                <div>
                  <span className='mb-4 pl-2 text-xl font-bold text-maroon leading-none '>
                    {appointment.eventName}
                  </span>
                </div>
                <div className='overflow-x-auto relative shadow-lg rounded-lg '>
                  <table className='w-full text-sm text-center text-gray-500 border border-gray '>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
                      <tr>
                        <th scope='col' className='py-3 px-6 '>
                          Event Description
                        </th>
                        <th scope='col' className='py-3 px-6'>
                          Event Time Start
                        </th>
                        <th scope='col' className='py-3 px-6'>
                          Event Time End
                        </th>
                        <th scope='col' className='py-3 px-6'>
                          Event Date
                        </th>
                        <th scope='col' className='py-3 px-6'>
                          Set By
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
                        <td className='py-4 px-6 lg:w-[22%]'>{appointment.eventDesc}</td>
                        <td className='py-4 px-6'>{appointment.timeStart}</td>
                        <td className='py-4 px-6'>{appointment.timeEnd}</td>
                        <td className='py-4 px-6'>
                          {formatDate(appointment.dateTimeStart.toDate())}
                        </td>
                        <td className='py-4 px-6'>{appointment.setter}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='flex gap-2 items-center w-[650px]'>
                    <img
                      className='h-8 w-8'
                      src={require('../../assets/user.png')}
                      alt='user icon'
                    />
                    <span className='font-bold uppercase text-xs w-[650px]'>
                      {appointment.clientFirstName} {appointment.clientLastName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
