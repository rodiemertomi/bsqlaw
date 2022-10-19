import React from 'react'

export default function CaseFolders() {
  return (
    <div className='h-screen w-screen md:w-screen md:h-screen lg:w-screen lg:ml-48'>
      <div className='h-full flex flex-col gap-5 items-center overflow-auto overflow-x-hidden md:w-full md:h-full lg:w-full lg:h-full lg:flex lg:flex-row'>
        {/* First Div */}
        <div className='w-[95%] gap-5 mt-5 lg:w-[95%] lg:h-[100%] lg:ml-2'>
          {/* Welcome Text */}
          <div className=' rounded-md  flex flex-col  bg-[#D9D9D9] lg:h-[97%]'>
            <div className='m-5 lg:m-5 text-justify'>
              <h1 className='self-start text-[30px] font-bold'>Case Files</h1>
              <div className='flex flex-col gap-10 lg:ml-10'>
                <details className='mt-5'>
                  <summary className='cursor-pointer'>Retainer Agreement</summary>
                  <p></p>
                </details>
                <details>
                  <summary className='cursor-pointer'>Statement of Account</summary>
                  <p></p>
                </details>
                <details>
                  <summary className='cursor-pointer'>Official Receipt</summary>
                  <p></p>
                </details>
                <details>
                  <summary className='cursor-pointer'>Billing</summary>
                  <p></p>
                </details>
                <details>
                  <summary className='cursor-pointer'>Engagement Proposal</summary>
                  <p></p>
                </details>
              </div>
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className='w-[95%] h-[100%] lg:h-[100%] lg:w-[30%] lg:mt-5 lg:mr-20'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start text-white bg-maroon rounded-md lg:h-[50%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className='flex flex-col items-start text-white  bg-maroon rounded-md lg:h-[45%]'>
              <div className='flex flex-col ml-5 mt-5'>
                <h1 className='font-bold'>Calendar</h1>
                <h1 className='mt-[145px] mb-5 lg:cursor-pointer'>Full Calendar</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
