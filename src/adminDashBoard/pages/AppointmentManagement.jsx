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
import React, { Fragment, useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import { db } from '../../firebase'
import Times from './components/Times'

function AppointmentManagement() {
  const [showAppointment, setShowAppoitnment] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [clients, setClients] = useState()

  const today = new Date()
  const appointmentsRef = collection(db, 'appointments')
  const q = query(appointmentsRef, orderBy('dateTimeStart', 'asc'), orderBy('dateTimeEnd', 'asc'))

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
        await deleteDoc(apptRef).then(() => {
          alert('Canceled Appointment')
          getAppointments()
        })
      })
    } else {
      return
    }
  }
  const [editFormData, setEditFormData] = useState({
    uid: '',
    setter: '',
    clientId: '',
    clientFirstName: '',
    clientLastName: '',
    eventName: '',
    eventDesc: '',
    timeStart: '',
    timeEnd: '',
    dateTimeStart: '',
    dateTimeEnd: '',
    location: '',
  })
  const [editApptId, setEditApptId] = useState(null)

  const handleEditClick = (e, appointment) => {
    e.preventDefault()
    setEditApptId(appointment.id)
    const formValue = {
      uid: appointment.uid,
      setter: appointment.setter,
      clientId: appointment.clientId,
      clientFirstName: appointment.clientFirstName,
      clientLastName: appointment.clientLastName,
      eventName: appointment.eventName,
      eventDesc: appointment.eventDesc,
      timeStart: appointment.timeStart,
      timeEnd: appointment.timeEnd,
      location: appointment.location,
      remarks: appointment.remarks,
    }
    setEditFormData(formValue)
  }

  const handleEditFormChange = e => {
    e.preventDefault()

    const fieldName = e.target.getAttribute('name')
    const fieldValue = e.target.value
    const newFormData = { ...editFormData }
    newFormData[fieldName] = fieldValue

    setEditFormData(newFormData)
  }

  const editFormSubmit = async e => {
    e.preventDefault()
    const docRef = doc(db, 'appointments', editApptId)
    const editedAppointment = {
      uid: editFormData.uid,
      setter: editFormData.setter,
      clientId: editFormData.clientId,
      clientFirstName: editFormData.clientFirstName,
      clientLastName: editFormData.clientLastName,
      eventName: editFormData.eventName,
      eventDesc: editFormData.eventDesc,
      timeStart: editFormData.timeStart,
      timeEnd: editFormData.timeEnd,
      location: editFormData.location,
      remarks: editFormData.remarks,
    }

    await setDoc(docRef, editedAppointment, { merge: true }).then(() => {
      alert('Appointment updated.')
      getAppointments()
    })

    setEditApptId(null)
  }

  const handleCancelClick = () => {
    setEditApptId(null)
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
    setAppointments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getClients()
    getAppointments()
  }, [])

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
       <div className='w-full flex item-center'>
        <h1 className='self-start text-[30px] w-full mt-3 ml-5 font-bold lg:ml-28'>BSQ Appointments</h1>
        <img
                alt='appointment'
                className='w-[100px] mr-2'
                src={require('../../assets/officialBSQlogo.png')}
              />
      </div>
      <div className='h-full w-full flex flex-col gap-5 overflow-autopb-5 pl-5 pr-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-maroon rounded-md flex flex-col gap-2 items-center lg:w-[100%] lg:h-[100%] lg:ml-20  lg:mr-3'>
          <div className='h-[50px] flex flex-col justify-center item-center self-end mr-5 mt-2'>
            <button
              className='inline-block px-6 py-2.5 bg-blue-600 text-black font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-white hover:bg-[#471414] hover:text-white active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => {
                setShowAppoitnment(true)
              }}
            >
              Add Appointments
            </button>
            {showAppointment && (
              <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center z-20'>
                <Times closeShowAppointment={setShowAppoitnment} clients={clients} />
              </div>
            )}
          </div>
          <div className='w-[100%] pl-5 pr-5 flex flex-wrap gap-3 justify-center lg:justify-center lg:w-[100%] overflow-auto scrollbar-hide pb-5'>
            {appointments?.map(appointment => (
              <Fragment key={appointment.id}>
                {today.getTime() > appointment.dateTimeStart.toDate().getTime() ? (
                  ''
                ) : (
                  <>
                    {editApptId === appointment.id ? (
                      <EditOnlyRow
                        appointment={appointment}
                        editFormData={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        handleCancelClick={handleCancelClick}
                        editFormSubmit={editFormSubmit}
                        formatDate={formatDate}
                      />
                    ) : (
                      <ReadOnlyRow
                        appointment={appointment}
                        handleEditClick={handleEditClick}
                        handleCancelAppt={handleCancelAppt}
                        formatDate={formatDate}
                      />
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentManagement

function ReadOnlyRow({ appointment, handleEditClick, handleCancelAppt, formatDate }) {
  return (
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
                Location
              </th>
              <th scope='col' className='py-3 px-6'>
                Set By
              </th>
              <th scope='col' className='py-3 px-6'>
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
              <td className='py-4 px-6 lg:w-[22%]'>{appointment.eventDesc}</td>
              <td className='py-4 px-6'>{appointment.timeStart}</td>
              <td className='py-4 px-6'>{appointment.timeEnd}</td>
              <td className='py-4 px-6'>{formatDate(appointment.dateTimeStart.toDate())}</td>
              <td className='py-4 px-6'>{appointment.location}</td>
              <td className='py-4 px-6'>{appointment.setter}</td>
              <td className='py-4 px-6'>{appointment.remarks}</td>
            </tr>
          </tbody>
        </table>
        <div className='p-2 w-full flex gap-[53%] text-sm'>
          <div className='flex gap-2 items-center w-[360px]'>
            <img className='h-8 w-8' src={require('../../assets/user.png')} alt='user icon' />
            <span className='font-bold uppercase text-xs w-[650px]'>
              {appointment.clientFirstName} {appointment.clientLastName}
            </span>
          </div>
          <div className='flex justify-end gap-2 w-full'>
            <button
              onClick={e => handleEditClick(e, appointment)}
              className='inline-block self-right px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Edit
            </button>
            <button
              onClick={() => handleCancelAppt(appointment.id, appointment.clientId)}
              className=' inline-block self-right px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditOnlyRow({
  appointment,
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  editFormSubmit,
  formatDate,
}) {
  return (
    <form
      onSubmit={editFormSubmit}
      key={appointment.id}
      className='bg-[#FFF] drop-shadow-lg p-2 w-[100%] rounded-md flex flex-col gap-2 '
    >
      <div>
        <span className='mb-4 pl-2 text-xl font-bold text-maroon leading-none '>
          <input
            className='shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            value={editFormData.eventName}
            onChange={handleEditFormChange}
          />
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
                Location
              </th>
              <th scope='col' className='py-3 px-6'>
                Set By
              </th>
              <th scope='col' className='py-3 px-6'>
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-white dark:bg-gray-900 dark:border-gray-700'>
              <td className='py-4 px-6 lg:w-[22%]'>
                <input
                  className='w-[55%] shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Appt desc'
                  name='eventDesc'
                  value={editFormData.eventDesc}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-[80%] shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='time'
                  placeholder='Appt time start'
                  name='timeStart'
                  value={editFormData.timeStart}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-1/7 shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='time'
                  placeholder='Appt time end'
                  name='timeEnd'
                  value={editFormData.timeEnd}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>{formatDate(appointment.dateTimeStart.toDate())}</td>
              <td className='py-4 px-6'>
                <input
                  className='w-[80%] shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Location'
                  name='location'
                  value={editFormData.location}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-[70%] shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Set by'
                  name='setter'
                  value={editFormData.setter}
                  onChange={handleEditFormChange}
                />
              </td>
              <td className='py-4 px-6'>
                <input
                  className='w-[80%] shadow appearance-none border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='Remarks'
                  name='remarks'
                  value={editFormData.remarks}
                  onChange={handleEditFormChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className='p-2 w-full flex gap-[53%] text-sm'>
          <div className='flex gap-2 items-center w-[360px]'>
            <img className='h-8 w-8' src={require('../../assets/user.png')} alt='user icon' />
            <span className='font-bold uppercase text-xs w-[650px]'>
              {appointment.clientFirstName} {appointment.clientLastName}
            </span>
          </div>
          <div className='flex justify-end gap-2 w-full'>
            <button
              type='submit'
              className=' inline-block self-right px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className=' inline-block self-right px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
