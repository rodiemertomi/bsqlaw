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
        <div className='h-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0'>
          <div className='w-[100%] h-[1000%] bg-[#D9D9D9] rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
            <h1 className='self-start text-[30px] mt-5 ml-5 font-bold lg:ml-10'>Lawyer</h1>
            <div className='w-[100%] flex gap-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
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
    <div className='bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60 text-white'>
      <img
        alt='user'
        className='w-20 md:w-40 rounded-full'
        src={
          lawyer.photoURL === '' || !lawyer.photoURL
            ? require('../../assets/user.png')
            : `${lawyer.photoURL}`
        }
      />
      <h1>{`${lawyer.firstname} ${lawyer.lastname}`}</h1>
      <h1>{`${lawyer.username}`}</h1>
      <h1>{`${lawyer.initials}`}</h1>
      <h1>Clients:</h1>
      {lawyer.clients?.map((client, i) => (
        <h1 key={i}>
          {client.firstname} {client.lastname}
        </h1>
      ))}
    </div>
  )
}
