import React from 'react'

const month = [
  { name: 'January', id: 1 },
  { name: 'February', id: 1 },
  { name: 'March', id: 1 },
  { name: 'April', id: 1 },
  { name: 'May', id: 1 },
  { name: 'June', id: 1 },
  { name: 'July', id: 1 },
  { name: 'August', id: 1 },
  { name: 'September', id: 1 },
  { name: 'October', id: 1 },
  { name: 'November', id: 1 },
  { name: 'December', id: 1 },
]

const selectMonth = month.map(months => <option key={months.id}>{months.name}</option>)

export default function Timesheets() {
  return (
    <div className='h-screen w-screen md:w-screen md:h-screen lg:w-screen lg:ml-48'>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-5'>Timesheets</h1>
      <div className='h-full flex flex-col gap-5 items-center overflow-auto lg:overflow-hidden md:w-full md:h-full lg:w-full lg:h-full lg:flex lg:flex-row'>
        {/* First Div */}
        <div className='w-[95%] h-[100%] gap-5 mt-5 lg:w-[95%] lg:h-[100%] lg:ml-2'>
          {/* Welcome Text */}
          <div className='h-[100%] rounded-md  flex flex-col overflow-scroll scrollbar-hide shadow-lg  bg-[#D9D9D9] lg:h-[86%]'>
            <div className='ml-5 mt-5 flex flex-col gap-10 lg:ml-10'>
              <details>
                <summary className='cursor-pointer'>2020</summary>
                <select className='mt-5 ml-5'>{selectMonth}</select>
              </details>
              <details>
                <summary className='cursor-pointer'>2021</summary>
                <select className='mt-5 ml-5'>{selectMonth}</select>
              </details>
              <details>
                <summary className='cursor-pointer'>2022</summary>
                <select className='mt-5 ml-5'>{selectMonth}</select>
              </details>

              <details>
                <summary className='cursor-pointer'>2023</summary>
                <select className='mt-5 ml-5'>{selectMonth}</select>
              </details>
              <details>
                <summary className='cursor-pointer mb-5'>2024</summary>
                <select className='mt-5 ml-5 mb-5'>{selectMonth}</select>
              </details>
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className='w-[95%] h-[100%] lg:h-[100%] lg:w-[30%] lg:mt-5 lg:mr-24'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start shadow-lg  text-white  bg-maroon rounded-md lg:h-[48%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className='flex flex-col items-start shadow-lg  text-white  bg-maroon rounded-md lg:h-[35%]'>
              <div className='flex flex-col ml-5 mt-5'>
                <h1 className='font-bold'>Calendar</h1>
                <h1 className='lg:mt-[145px] mb-5 cursor-pointer'>Full Calendar</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
