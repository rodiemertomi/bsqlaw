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
    <div>
      <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
        <h1 className='self-start text-[30px] mt-5 ml-5 font-bold lg:ml-28'>Lawyer</h1>
        <div className='h-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0'>
          <div className='w-[100%] h-[1000%] bg-[#D9D9D9] rounded-md flex flex-col mr-3 gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
            <div className='w-[100%] flex gap-x-10 pt-5 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
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
  return (
    <div className='bg-[#632121] w-[230px] h-[260px] lg:w-[260px] lg:h-[275px] shadow-lg rounded-2xl flex flex-col mb-5 md:w-[230px] md:h-[260px] text-white gap-[1px]'>
      <div className=' text-xs w-full flex flex-col justify-center items-center'>
        <img
          alt='user'
          className='w-[130px] lg:w-[140px] md:w-[140px] rounded-full'
          src={
            lawyer.photoURL === '' || !lawyer.photoURL
              ? require('../../assets/user.png')
              : `${lawyer.photoURL}`
          }
        />
        <h1 className='text-yellow font-bold text-lg '>{`${lawyer.firstname} ${lawyer.lastname}`}</h1>
        <h1>{`${lawyer.username}`}</h1>
        <h1>{`${lawyer.initials}`}</h1>
      </div>
      <div className='flex flex-col items-center justify-start p-2 text-xs '>
        <h1>Clients:</h1>
        {lawyer.clients?.map((client, i) => (
          <h1 key={i}>
            {client.firstname} {client.lastname}
          </h1>
        ))}
      </div>
    </div>
  )
}
