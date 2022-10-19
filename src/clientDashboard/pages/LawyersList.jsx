import React from 'react'

export default function LawyersList() {
  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Lawyers</h1>
      <div className='h-full flex flex-col mt-2 gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 pt-5 '>
          {/* Card View */}
          <div className='w-[100%] flex gap-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
            <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
              <img alt='user' className='w-20 md:w-40' src={require('../../assets/user.png')} />
              <h1 className='text-white'>Lawyers Name</h1>
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className='w-[100%] h-[100%] lg:h-[100%] lg:w-[30%]'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start shadow-lg  text-white bg-maroon rounded-md lg:h-[50%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className='flex flex-col items-start shadow-lg  text-white bg-maroon rounded-md lg:h-[47%]'>
              <div className='flex flex-col ml-5 mt-5'>
                <h1 className='font-bold'>Calendar</h1>
                <h1 className='lg:mt-[180px] mb-5 lg:cursor-pointer'>Full Calendar</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
