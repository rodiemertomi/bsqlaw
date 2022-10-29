import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import UseUserReducer from '../../UserReducer'

export default function ClientsList() {
  const { username, id, initials } = UseUserReducer()

  const [clients, setClients] = useState()

  const getLawyer = async () => {
    const lawyerRef = doc(db, `users/${id}`)
    await getDoc(lawyerRef).then(snap => {
      setClients(snap.data().clients)
    })
  }

  useEffect(() => {
    getLawyer()
  }, [])
  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Clients</h1>
      <div className='h-full flex flex-col mt-2 gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 pt-5 '>
          <div className='w-[100%] flex gap-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
            {clients?.map(client => (
              <div className='shadow-lg bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
                <img
                  alt='user'
                  className='w-20 md:w-40'
                  src={
                    client.photoURL === '' || !client.photoURL
                      ? require('../../assets/user.png')
                      : `${client.photoURL}`
                  }
                />
                <h1 className='text-white'>
                  {client.firstname} {client.lastname}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
