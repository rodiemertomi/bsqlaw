import React from 'react'
import { collection, addDoc, doc, setDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../../firebase'
import UseAppointmentStore from '../../reducers/AppointmentReducer'
import UseUserReducer from '../../../UserReducer'
import { nanoid } from 'nanoid'

function Times({ closeShowAppointment }) {
  const appointmentsRef = collection(db, 'appointments')
  const { initials, id } = UseUserReducer()
  const userRef = doc(db, `users/${id}`)

  const {
    setEventTimeStart,
    setEventTimeEnd,
    setEventName,
    setEventDesc,
    setEventDateEnd,
    setEventDateStart,
    setClient,
  } = UseAppointmentStore()
  const {
    eventTimeStart,
    eventTimeEnd,
    eventName,
    eventDateStart,
    eventDateEnd,
    eventDesc,
    client,
  } = UseAppointmentStore()

  const saveEvent = async e => {
    e.preventDefault()
    const data = {
      id: nanoid(10),
      setter: initials,
      client: client,
      eventName: eventName,
      eventDesc: eventDesc,
      eventTimeStart: eventTimeStart,
      eventTimeEnd: eventTimeEnd,
      eventDateStart: new Date(eventDateStart),
      eventDateEnd: new Date(eventDateEnd),
    }
    await addDoc(appointmentsRef, data).then(alert('Appointment is set!'))
    const appointments = {
      appointments: arrayUnion(data),
    }
    await setDoc(userRef, appointments, { merge: true })
    setEventName('')
    setEventDesc('')
    setClient('')
    setEventTimeStart('')
    setEventTimeEnd('')
    setEventDateStart('')
    setEventDateEnd('')
  }

  return (
    <div className='flex rounded-md justify-center items-center flex-col  border-1 border-black shadow-lg bg-[#e1dfdf] rounded-r h-[63%] w-[90%] lg:w-[40%] lg:h-[92%]'>
      <h1 className='font-bold text-2xl'>Set Appointment</h1>
      <form onSubmit={saveEvent} className='mt-5'>
        <div className='mt-5 flex flex-col justify-center items-center gap-5'>
          <select
            name='clientName'
            id='clientName'
            value={client}
            onChange={e => setClient(e.target.value)}
            className='h-10 pl-4 shadow border-[1px] border-gray rounded w-[85%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
          >
            <option default value=''>
              Client Name
            </option>
            <option value='Jastoni'>Jastoni</option>
            <option value='Eduard'>Eduard</option>
            <option value='Rona'>Rona</option>
          </select>
          {/* Event Name */}
          <input
            type='text'
            id='eventName'
            name='eventName'
            placeholder='Event Name'
            className='h-10 pl-4 shadow border-[1px] border-gray rounded w-[85%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            onChange={event => setEventName(event.target.value)}
            value={eventName}
          />

          {/* Event Description */}
          <textarea
            rows='4'
            cols='30'
            name='eventDesc'
            className=' h-28 pl-4 shadow border-[1px] border-gray rounded w-[85%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            value={eventDesc}
            placeholder='Event Description'
            onChange={event => setEventDesc(event.target.value)}
          ></textarea>
        </div>
        {/* Time Picker */}
        <div className='flex flex-row items-center justify-center mt-5 gap-1'>
          <input
            type='text'
            id='appt'
            name='appt'
            onChange={event => setEventTimeStart(event.target.value)}
            value={eventTimeStart}
            className=' h-10 pl-4 shadow border-[1px] border-gray rounded w-[41.5%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            onFocus={e => (e.currentTarget.type = 'time')}
            onBlur={e => (e.currentTarget.type = 'text')}
            placeholder='Time Duration:'
          />

          <input
            type='text'
            id='appt'
            name='appt'
            onChange={event => setEventTimeEnd(event.target.value)}
            value={eventTimeEnd}
            className=' h-10 pl-4 shadow border-[1px] border-gray rounded w-[41.5%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            onFocus={e => (e.currentTarget.type = 'time')}
            onBlur={e => (e.currentTarget.type = 'text')}
            placeholder='To:'
          />
        </div>
        {/* Date Picker */}
        <div className='flex flex-row items-center justify-center mt-5 gap-1'>
          <input
            type='text'
            id='appt'
            name='appt'
            onChange={event => setEventDateStart(event.target.value)}
            value={eventDateStart}
            className=' h-10 pl-4 shadow border-[1px] border-gray rounded w-[41.5%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            onFocus={e => (e.currentTarget.type = 'date')}
            onBlur={e => (e.currentTarget.type = 'text')}
            placeholder='Date Duration:'
          />
          <input
            type='text'
            id='appt'
            name='appt'
            onChange={event => setEventDateEnd(event.target.value)}
            value={eventDateEnd}
            className=' h-10 pl-4 shadow border-[1px] border-gray rounded w-[41.5%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            onFocus={e => (e.currentTarget.type = 'date')}
            onBlur={e => (e.currentTarget.type = 'text')}
            placeholder='To:'
          />
        </div>
        <div className='flex flex-col items-center mt-5 '>
          <input
            type='submit'
            value={'Submit'}
            className='bg-maroon w-[40%] text-white font-bold py-2 px-4 rounded-3xl shadow-md hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out text-center'
          />
          <p
            className='self-center text-maroon font-bold cursor-pointer hover:text-white mt-8'
            onClick={() => closeShowAppointment(false)}
          >
            Close
          </p>
        </div>

        {/* Results */}
      </form>
    </div>
  )
}

export default Times
