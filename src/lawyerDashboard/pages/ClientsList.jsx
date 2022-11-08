import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import UseUserReducer from '../../UserReducer'

export default function ClientsList() {
  const { firstName, lastName, initials } = UseUserReducer()

  const [clients, setClients] = useState()

  const getClients = async () => {
    const colRef = collection(db, 'users')
    const clientsQ = query(
      colRef,
      where('role', '==', 'client'),
      where('lawyer', '==', `${initials}`)
    )
    await getDocs(clientsQ).then(snap => {
      setClients(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }

  useEffect(() => {
    getClients()
  }, [])
  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>
        {firstName} {lastName}'s Clients
      </h1>
      <div className='h-full flex flex-col mt-2 gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-maroon rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 pt-5 mr-3'>
          <div className='w-[100%] flex gap-x-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
            {clients?.map(client => (
              <div className='shadow-lg bg-[#ECE4E4] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
                <img
                  alt='user'
                  className='w-[140px] h-[140px] rounded-full'
                  src={
                    client.photoURL === '' || !client.photoURL
                      ? require('../../assets/user.png')
                      : `${client.photoURL}`
                  }
                />
                <h1 className='text-maroon mt-1 font-bold text-lg'>
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
