import { tr } from 'date-fns/locale'
import React from 'react'
import { useState } from 'react'
import UseAppointmentStore from '../../reducers/AppointmentReducer'

function Times(props) {
  const {
    setEventTimeStart,
    setEventTimeEnd,
    setEventName,
    setEventDesc,
    setEventDateEnd,
    setEventDateStart,
    setInfo,
    setEvent,
  } = UseAppointmentStore()
  const { eventTimeStart, eventTimeEnd, eventName, eventDateStart, eventDateEnd, eventDesc, info } =
    UseAppointmentStore()
  // const [eventDesc, setEventDesc] = useState('')
  // const [eventStart, setEventStart] = useState('')
  // const [eventEnd, setEventEnd] = useState('')
  // const [info, setInfo] = useState('')

  function displayInfo(e) {
    e.preventDefault()
    setInfo(true)
    setEvent(eventTimeStart, eventTimeEnd, eventName, eventDateStart, eventDateEnd, eventDesc, info)
  }

  return (
    <div className='flex items-center border-1 border-black shadow-lg bg-white rounded-r lg:w-[400px] lg:h-[250px]'>
      <form onSubmit={displayInfo} className='ml-2'>
        <div className='mt-2'>
          {/* Event Name */}
          <label for='eventName'>Event name:</label>
          <input
            type='text'
            id='eventName'
            name='eventName'
            className='border-[1px] rounded-md'
            onChange={event => setEventName(event.target.value)}
            value={eventName}
          />
        </div>
        {/* Event Description */}
        <label for='eventDesc'>Event Description:</label> <br />
        <textarea
          rows='4'
          cols='30'
          name='eventDesc'
          className='border-[1px] rounded-md mt-2'
          value={eventDesc}
          placeholder='Event description...'
          onChange={event => setEventDesc(event.target.value)}
        ></textarea>
        {/* Time Picker */}
        <div className='flex w-80 gap-3'>
          <div className='flex w-36 gap-2'>
            <label for='appt'>Duration:</label>
            <input
              type='time'
              id='appt'
              name='appt'
              onChange={event => setEventTimeStart(event.target.value)}
              value={eventTimeStart}
            />
          </div>
          <div className='flex w-28 gap-2'>
            <label for='appt'>To:</label>
            <input
              type='time'
              id='appt'
              name='appt'
              onChange={event => setEventTimeEnd(event.target.value)}
              value={eventTimeEnd}
            />
          </div>
        </div>
        {/* Date Picker */}
        <div className='flex w-80 gap-3'>
          <div className='flex w-28 gap-2 '>
            <label for='appt'> Day:</label>
            <input
              type='date'
              id='appt'
              name='appt'
              onChange={event => setEventDateStart(event.target.value)}
              value={eventDateStart}
            />
          </div>
          <div className='flex w-28 gap-2 '>
            <label for='appt'>To:</label>
            <input
              type='date'
              id='appt'
              name='appt'
              onChange={event => setEventDateEnd(event.target.value)}
              value={eventDateEnd}
            />
          </div>
        </div>
        <input type='submit' value={'Submit'} className={`rounded-md w-20 bg-maroon text-white`} />
        {/* Results */}
      </form>
      <div>
        {info
          ? ` Event name: ${eventName}
          Event Description: ${eventDesc} 
          Duration: ${eventTimeStart} to ${eventTimeEnd} 
          Date: ${eventDateStart} to ${eventDateEnd}`
          : null}
      </div>
    </div>
  )
}

export default Times
