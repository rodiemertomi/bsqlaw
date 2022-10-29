import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import UseUserReducer from '../../UserReducer'
import { db } from '../../firebase'
import Times from './components/Times'

function Appointments() {
  const [showAppointment, setShowAppoitnment] = useState(false)
  const [appointments, setAppointments] = useState([])
  const { initials } = UseUserReducer()
  const { id } = UseUserReducer()
  const colRef = collection(db, 'appointments')
  const q = query(colRef, where('setter', '==', `${initials}`), orderBy('eventDateStart', 'asc'))

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  const getData = async () => {
    const snap = await getDocs(q)
    setAppointments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Appointments</h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col gap-2 items-center lg:w-[100%] lg:h-[100%] lg:ml-20 '>
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-wrap gap-2 justify-center lg:w-[100%] overflow-auto scrollbar-hide'>
            {appointments?.map(appointment => (
              <div
                key={appointment.id}
                className='bg-[#9C9999] w-[100%] h-60 rounded-md pl-2 flex flex-col gap-2 '
              >
                <div>
                  <span className='font-bold text-2xl'> {appointment.eventName} </span>
                </div>
                <div>
                  <span className='font-bold'>Client:</span> {appointment.client}
                </div>
                <div>
                  <span className='font-bold'>Event Desc:</span> {appointment.eventDesc}
                </div>
                <div>
                  <span className='font-bold'>Event Time Start: </span>
                  {appointment.eventTimeStart}
                </div>
                <div>
                  <span className='font-bold'>Event Time End: </span>
                  {appointment.eventTimeEnd}
                </div>
                <div>
                  <span className='font-bold'>Event Date Start: </span>
                  {formatDate(appointment.eventDateStart.toDate())}
                </div>
                <div>
                  <span className='font-bold'>Event Date End: </span>
                  {formatDate(appointment.eventDateEnd.toDate())}
                </div>
              </div>
            ))}
          </div>
          <div className='h-[50px] flex flex-col justify-center item-center self-end mb-2 mr-5'>
            <button
              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => {
                setShowAppoitnment(true)
              }}
            >
              Add Appointments
            </button>
          </div>
          {showAppointment && (
            <div className='w-screen h-screen backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center'>
              <Times closeShowAppointment={setShowAppoitnment} getData={getData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments
