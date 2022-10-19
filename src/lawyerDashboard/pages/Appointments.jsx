import { useState } from 'react'
import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Time from './components/Time'
import UseUserReducer from '../../UserReducer'

export default function Appointments() {
  const [date, setDate] = useState(new Date())
  const [showTime, setShowTime] = useState(false)
  const { appointments } = UseUserReducer()

  return (
    <div className='h-screen w-screen md:w-screen md:h-screen lg:w-screen lg:ml-48'>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold'>Appointments</h1>
      <div className='h-full flex flex-col gap-5 items-center overflow-auto lg:overflow-hidden scrollbar-hide md:w-full md:h-full lg:w-full lg:h-full lg:flex lg:flex-row'>
        {/* First Div */}
        <div className='w-[95%] gap-5 mt-5 lg:w-[95%] lg:h-[100%] lg:ml-2'>
          {/* Welcome Text */}
          <div className=' rounded-md  flex flex-col  bg-[#D9D9D9] lg:h-[88%]'>
            <div className='m-5 lg:m-5 text-justify'>
              <div className='flex flex-col items-center justify-center'>
                <div>
                  <Calendar onChange={setDate} value={date} onClickDay={() => setShowTime(true)} />
                </div>
                <div>
                  {date.length > 0 ? (
                    <p>
                      <span>Start:</span>
                      {date[0].toDateString()}
                      &nbsp; &nbsp;
                      <span>End:</span>
                      {date[1].toDateString()}
                    </p>
                  ) : (
                    <p>
                      <span>Default selected date: </span>
                      {date.toDateString()}
                    </p>
                  )}
                  {appointments.toString()}
                  <Time showTime={showTime} date={date} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className='w-[95%] h-[100%] lg:h-[100%] lg:w-[30%] lg:mt-5 lg:mr-24'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start text-white bg-maroon rounded-md lg:h-[45%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className='flex flex-col items-start text-white  bg-maroon rounded-md lg:h-[40%]'>
              <div className='flex flex-col ml-5 mt-5'>
                <h1 className='font-bold'>Calendar</h1>
                <h1 className='mt-[175px] mb-5 lg:cursor-pointer'>Full Calendar</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
