import React, { useEffect } from 'react'
import { collection, addDoc, doc, setDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../../firebase'
import UseAppointmentStore from '../../reducers/AppointmentReducer'
import UseUserReducer from '../../../UserReducer'
import { nanoid } from 'nanoid'

function Times({ closeShowAppointment, clients }) {
  const {
    setClientFirstName,
    setClientLastName,
    setEventTimeStart,
    setEventTimeEnd,
    setEventName,
    setEventDesc,
    setEventDateStart,
    setClientId,
    setLocation,
  } = UseAppointmentStore()
  const {
    clientFirstName,
    clientLastName,
    eventTimeStart,
    eventTimeEnd,
    eventName,
    eventDateStart,
    eventDesc,
    clientId,
    location,
  } = UseAppointmentStore()

  const appointmentsRef = collection(db, 'appointments')
  const { initials, id } = UseUserReducer()
  const lawyerRef = doc(db, `users/${id}`)

  const handleSelectClient = (e, clients) => {
    e.preventDefault()
    setClientId(e.target.value)
    clients.forEach(client => {
      if (client.id === clientId) {
        setClientFirstName(client.firstname)
      }
    })
    clients.forEach(client => {
      if (client.id === clientId) {
        setClientLastName(client.lastname)
      }
    })
  }

  const saveEvent = async e => {
    e.preventDefault()
    if (clientId === '') {
      alert('Please select a client')
      setEventName('')
      setEventDesc('')
      setClientFirstName()
      setClientLastName()
      setClientId('')
      setEventTimeStart('')
      setEventTimeEnd('')
      setEventDateStart('')
      setLocation('')
      return
    }
    const clientRef = doc(db, `users/${clientId}`)

    const today = new Date()

    const dateStart = new Date(eventDateStart)
    const timeStartArr = eventTimeStart.split(':')
    dateStart.setHours(timeStartArr[0])
    dateStart.setMinutes(timeStartArr[1])

    const dateEnd = new Date(eventDateStart)
    const timeEndArr = eventTimeEnd.split(':')
    dateEnd.setHours(timeEndArr[0])
    dateEnd.setMinutes(timeEndArr[1])

    if (today.getTime() > dateStart.getTime()) {
      alert('Date set has already passed')
      setEventName('')
      setEventDesc('')
      setClientFirstName()
      setClientLastName()
      setClientId('')
      setEventTimeStart('')
      setEventTimeEnd('')
      setEventDateStart('')
      setLocation('')
      return
    }
    if (eventTimeStart > eventTimeEnd) {
      alert('Time end is less than Time Start')
      setEventName('')
      setEventDesc('')
      setClientFirstName()
      setClientLastName()
      setClientId('')
      setEventTimeStart('')
      setEventTimeEnd('')
      setEventDateStart('')
      setLocation('')
      return
    }

    const data = {
      uid: nanoid(10),
      setter: initials,
      clientId: clientId,
      clientFirstName: clientFirstName,
      clientLastName: clientLastName,
      eventName: eventName,
      eventDesc: eventDesc,
      timeStart: eventTimeStart,
      timeEnd: eventTimeEnd,
      dateTimeStart: dateStart,
      dateTimeEnd: dateEnd,
      location: location,
      remarks: '',
    }
    await addDoc(appointmentsRef, data).then(alert('Appointment is set!'))
    const appointments = {
      appointments: arrayUnion(data),
    }
    await setDoc(lawyerRef, appointments, { merge: true })
    await setDoc(clientRef, appointments, { merge: true }).then(() => {
      setEventName('')
      setEventDesc('')
      setClientFirstName()
      setClientLastName()
      setClientId('')
      setEventTimeStart('')
      setEventTimeEnd('')
      setEventDateStart('')
    })
  }

  useEffect(() => {
    clients.forEach(client => {
      if (client.id === clientId) {
        setClientFirstName(client.firstname)
      }
    })
    clients.forEach(client => {
      if (client.id === clientId) {
        setClientLastName(client.lastname)
      }
    })
  }, [clientId])

  return (
    <div className='flex rounded-md justify-center items-center flex-col  border-1 border-black shadow-lg bg-[#e1dfdf] rounded-r h-[80%] w-[90%] lg:w-[40%] lg:h-[95%] drop-shadow-lg'>
      <h1 className='font-bold text-2xl'>Set Appointment</h1>
      <form onSubmit={e => saveEvent(e, clients)} className='mt-5'>
        <div className='mt-2 flex flex-col justify-center items-center gap-5'>
          <select
            name='clientName'
            id='clientName'
            value={clientId}
            onChange={e => handleSelectClient(e, clients)}
            className='h-10 pl-4 shadow border-[1px] border-gray rounded w-[85%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
          >
            <option value=''>Client Name</option>
            {clients?.map(client => (
              <option key={client.id} value={client.id}>
                {client.firstname} {client.lastname}
              </option>
            ))}
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
          <textarea
            rows='4'
            cols='30'
            name='eventDesc'
            className=' h-14 pl-4 shadow border-[1px] border-gray rounded w-[85%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
            value={location}
            placeholder='Appointment Location'
            onChange={event => setLocation(event.target.value)}
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
        </div>
        <div className='flex flex-col items-center mt-5 '>
          <input
            type='submit'
            value={'Submit'}
            className='bg-maroon w-[40%] text-white font-bold py-2 px-4 rounded-3xl shadow-md hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out text-center'
          />
          <p
            className='text-maroon text-sm cursor-pointer hover:text-black hover:font-bold mt-3'
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
