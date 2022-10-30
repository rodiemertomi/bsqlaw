import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import UseUserReducer from '../../UserReducer'
import { db } from '../../firebase'
import Times from './components/Times'

function Appointments() {
  const [showAppointment, setShowAppoitnment] = useState(false)
  const [appointments, setAppointments] = useState([])
  const { initials, firstName, lastName } = UseUserReducer()
  const [clients, setClients] = useState()
  const colRef = collection(db, 'appointments')
  const q = query(colRef, where('setter', '==', `${initials}`), orderBy('dateTimeStart', 'asc'))

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  const handleCancelAppt = async (apptId, clientId) => {
    if (window.confirm('Sure to cancel appointment?') === true) {
      const apptRef = doc(db, `appointments/${apptId}`)
      await getDoc(apptRef).then(async snap => {
        const clientRef = doc(db, `users/${clientId}`)
        const data = {
          appointments: arrayRemove(snap.data()),
        }
        await setDoc(clientRef, data, { merge: true })
        await deleteDoc(apptRef).then(() => alert('Canceled Appointment'))
        getAppointments()
      })
    } else {
      return
    }
  }

  const getClients = async () => {
    const colRef = collection(db, 'users')
    const clientsRef = query(colRef, where('role', '==', 'client'))
    await getDocs(clientsRef).then(snap => {
      setClients(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  const getAppointments = async () => {
    const snap = await getDocs(q)
    setAppointments(snap.docs.map(doc => ({ ...doc.data() })))
  }
  useEffect(() => {
    getClients()
    getAppointments()
  }, [])

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>
        {firstName} {lastName}'s Appointments
      </h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col gap-2 items-center lg:w-[100%] lg:h-[100%] lg:ml-20  lg:mr-3'>
          <div className='w-[100%] pl-5 pt-5 pr-5 flex flex-wrap gap-3 justify-center lg:justify-center lg:w-[100%] overflow-auto scrollbar-hide'>
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
                  <div className='p-2 flex items-center gap-[80%] text-sm'>
                    <div className='flex gap-2 items-center'>
                      <img
                        className='h-8 w-8'
                        src={require('../../assets/user.png')}
                        alt='user icon'
                      />
                      <span className='font-bold uppercase'>
                        {appointment.clientFirstName} {appointment.clientLastName}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleCancelAppt(appointment.id, appointment.clientId)}
                        className='inline-block self-right px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
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
            <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center'>
              <Times closeShowAppointment={setShowAppoitnment} clients={clients} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments
