import React from 'react'

export default function MainDashBoard() {
  return (
    <div className='h-screen w-screen md:w-screen md:h-screen lg:w-screen lg:ml-48'>
      <div className='h-full flex flex-col gap-5 items-center overflow-auto md:w-full lg:overflow-hidden scrollbar-hide md:h-full lg:w-full lg:h-full lg:flex lg:flex-row'>
        {/* First Div */}
        <div className='w-[95%] h-[1000%] gap-5 mt-5 lg:w-[110%] lg:h-[100%] lg:ml-2'>
          {/* Welcome Text */}
          <div className=' rounded-md  flex flex-col shadow-lg  bg-[#D9D9D9] lg:h-[60%]'>
            <div className='m-5 lg:m-5 text-justify'>
              <h1 className='text-[50px] text-left font-semibold'>Welcome, Client!</h1>
              <p></p>
            </div>
          </div>

          <div className='lg:w-[100%] lg:h-[37%] lg:flex lg:flex-row lg:gap-5'>
            <div className=' mt-5 flex flex-col justify-center items-center shadow-lg bg-[#D9D9D9] rounded-md '>
              {/* Profile */}
              <img
                alt='user'
                className='w-[60%] mt-5 md:w-[35%] lg:w-[39%]'
                src={require('../../assets/user.png')}
              />
              <p className='text-1xl mb-5 lg:cursor-pointer'>Edit Profile</p>
            </div>
            {/* Recent Documents */}
            <div className=' flex flex-col items-start mt-5 shadow-lg  bg-[#D9D9D9] rounded-md lg:w-[60%] '>
              <div className=' flex flex-col m-5 text-justify'>
                <h1 className='font-bold'>Recent Documents</h1>
                <p></p>
              </div>
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className='w-[95%] h-[100%] lg:h-[100%] lg:w-[27%] lg:mt-5 lg:mr-24'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start shadow-lg text-white  bg-maroon rounded-md lg:h-[60%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className='flex flex-col items-start shadow-lg text-white  bg-maroon rounded-md lg:h-[34%]'>
              <div className='flex flex-col ml-5 mt-5'>
                <h1 className='font-bold'>Calendar</h1>
                <h1 className='lg:mt-[160px] mb-5 lg:cursor-pointer'>Full Calendar</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
