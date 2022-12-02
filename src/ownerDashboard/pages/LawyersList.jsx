import React, { Fragment, useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default function LawyersList() {
  const colRef = collection(db, 'users')
  const q1 = query(colRef, where('role', '==', 'lawyer'))
  const [lawyers, setLawyers] = useState()

  const getLawyers = async () => {
    const data = await getDocs(q1)
    setLawyers(data?.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getLawyers()
  }, [])

  return (
    <div className='font-poppins'>
      <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
        <div className='w-full flex item-center mb-2'>
          <h1 className='self-start text-[30px] w-full mt-3 ml-5 font-bold lg:ml-28'>BSQ Lawyer</h1>
          <img
            alt='bsq logo'
            className='w-[80px] mr-4 pt-3'
            src={require('../../assets/officialBSQlogoBlack.png')}
          />
        </div>
        <div className='h-full flex flex-col gap-5 overflow-auto pb-2 pl-5 pr-5 overflow-x-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0'>
          <div className='w-[100%] h-[1000%] bg-maroon rounded-md flex flex-col mr-3 gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
            <div className='w-[100%] flex gap-x-8 pt-5 flex-wrap justify-center lg:w-[100%] lg:overflow-auto'>
              {lawyers?.map(lawyer => (
                <Fragment key={lawyer.id}>
                  <ReadLawyers lawyer={lawyer} />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadLawyers({ lawyer }) {
  const [showLawyerList, setShowLawyerList] = useState(false)
  return (
    <div className='bg-[#ECE4E4] w-[230px] h-[260px] lg:w-[260px] lg:h-[285px] shadow-lg rounded-2xl flex flex-col items-center justify-center mb-5 md:w-[230px] md:h-[260px] font-semibold text-black gap-[5px]'>
      <div className=' text-xs lg:text-sm w-full flex flex-col justify-center items-center'>
        <img
          alt='user'
          className=' w-[130px] h-[130px]  lg:w-[130px] lg:h-[130px] md:w-[140px] md:h-[140px] rounded-full'
          src={
            lawyer.photoURL === '' || !lawyer.photoURL
              ? require('../../assets/user.png')
              : `${lawyer.photoURL}`
          }
        />
        <h1 className='text-maroon font-bold text-lg'>{`${lawyer.firstname} ${lawyer.lastname}`}</h1>
        <h1>{`${lawyer.username}`}</h1>
        <h1>{`${lawyer.initials}`}</h1>
      </div>
      <div className='w-full bg-black shadow-lg h-[20%] flex flex-col items-center justify-center p-2 text-xs '>
        {/* <h1 className='font-bold text-yellow'>List of Clients</h1>
        <div className=' overflow-auto text-white scrollbar-hide flex flex-col items-center h-full w-full'>
          {lawyer.clients?.map((client, i) => (
            <h1 key={i}>
              {client.firstname} {client.lastname}
            </h1>
          ))}
        </div> */}
        <div>
          <h1
            className='text-yellow font-thin hover:text-white hover:underline hover:cursor-pointer '
            onClick={() => {
              setShowLawyerList(true)
            }}
          >
            Click to see List of Clients
          </h1>
          {showLawyerList && (
            <div className='w-screen h-screen bg-modalbg absolute top-0 left-0 flex justify-center items-center z-20'>
              <div className='bg-white animate-[moveTop_0.3s_ease-in-out] w-[360px] h-[480px] gap-2 rounded-xl flex flex-col items-center shadow-lg'>
                <div className='w-full h-[60px] bg-maroon rounded-t-xl flex items-center justify-center'>
                  <h1 className='text-2xl font-bold text-white'>List of Clients</h1>
                </div>
                <div className='flex flex-col w-full h-full items-center justify-between pr-6 pl-6 pt-3 pb-3'>
                  <div className='overflow-auto w-full text-base font-light flex flex-col gap-1'>
                    {lawyer.clients?.map((client, i) => (
                      <div className='w-full bg-maroon rounded-md text-white p-3 pl-5 '>
                        <h1 key={i}>
                          {client.firstname} {client.lastname}
                        </h1>
                      </div>
                    ))}
                  </div>
                  <div className='text-sm font-thin'>
                    <h1
                      className='text-maroon hover:font-bold hover:cursor-pointer mb-2'
                      onClick={() => setShowLawyerList(false)}
                    >
                      close
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
