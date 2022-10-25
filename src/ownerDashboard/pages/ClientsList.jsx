import React, { Fragment, useEffect, useState } from 'react'
import { collection, getDocs, query, where, doc, setDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../firebase'

export default function ClientsList() {
  const colRef = collection(db, 'users')
  const q1 = query(colRef, where('role', '==', 'client'))
  const q2 = query(colRef, where('role', '==', 'lawyer'))
  const [clientsList, setClientsList] = useState()
  const [lawyersList, setLawyersList] = useState()
  const [clientEditId, setClientEditId] = useState()
  const [selectedLawyer, setSelectedLawyer] = useState()
  const [editFormData, setEditFormData] = useState()

  const handleEditClick = (e, client) => {
    e.preventDefault()
    setClientEditId(client.id)
    const formValues = {
      lawyer: client.lawyer,
    }
    setEditFormData(formValues)
  }

  const handleEdit = e => {
    const selectedOption = e.target.value
    setSelectedLawyer(selectedOption)
  }

  const handleEditFormSubmit = async (e, client) => {
    e.preventDefault()
    const colRef = collection(db, 'users')
    const lq1 = query(colRef, where('initials', '==', `${selectedLawyer}`))
    const data = await getDocs(lq1)
    const lawyer = data.docs.map(doc => {
      return doc.id
    })
    const lawyerRef = doc(db, `users/${lawyer}`)
    const clientRef = doc(db, `users/${clientEditId}`)

    const editedClient = {
      lawyer: selectedLawyer,
    }

    const editedLawyer = {
      clients: arrayUnion(`${client.firstname} ${client.lastname}`),
    }

    await setDoc(clientRef, editedClient, { merge: true }).then(() => {
      alert(`${selectedLawyer} assigned to ${client.firstname} ${client.lastname}`)
    })

    await setDoc(lawyerRef, editedLawyer, { merge: true }).then(() => {
      alert(`${client.firstname} ${client.lastname} assigned to ${selectedLawyer}`)
    })

    setClientEditId(null)
    setSelectedLawyer(null)
  }

  const handleCancelClick = () => {
    setClientEditId(null)
  }

  useEffect(() => {
    const getClients = async () => {
      const data = await getDocs(q1)
      setClientsList(data?.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    const getLawyers = async () => {
      const data = await getDocs(q2)
      setLawyersList(data?.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }
    getClients()
    getLawyers()
  }, [])
  return (
    <div>
      <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
        <div className='h-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0'>
          <div className='w-[100%] h-[1000%] bg-[#D9D9D9] rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
            <h1 className='self-start text-[30px] mt-5 ml-5 font-bold lg:ml-10'>Lawyer</h1>
            {/* Card View */}
            <div className='w-[100%] flex gap-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
              {clientsList?.map(client => (
                <Fragment key={client.id}>
                  {clientEditId === client.id ? (
                    <EditClient
                      photoURL={client.photoURL}
                      id={client.id}
                      firstname={client.firstname}
                      lastname={client.lastname}
                      client={client}
                      lawyersList={lawyersList}
                      handleEdit={handleEdit}
                      handleCancelClick={handleCancelClick}
                      handleEditFormSubmit={handleEditFormSubmit}
                    />
                  ) : (
                    <ReadClients
                      photoURL={client.photoURL}
                      id={client.id}
                      firstname={client.firstname}
                      lastname={client.lastname}
                      handleAppointClick={handleEditClick}
                      client={client}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          {/* Second Div */}
          <div className='w-[100%] h-[100%] lg:h-[100%] lg:w-[30%]'>
            <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
              <div className=' flex flex-col items-start  text-white  bg-maroon rounded-md lg:h-[50%] '>
                {/* Todo */}
                <div className='flex flex-col m-5 text-justify '>
                  <div className='flex'>
                    <h1 className='font-bold'>To-Do</h1>
                    <h1 className='font-bold'>+</h1>
                  </div>
                </div>
              </div>
              {/* Calendar */}
              <div className='flex flex-col items-start  text-white  bg-maroon rounded-md lg:h-[45%]'>
                <div className='flex flex-col ml-5 mt-5'>
                  <h1 className='font-bold'>Calendar</h1>
                  <h1 className='mt-[145px] mb-5 lg:cursor-pointer'>Full Calendar</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadClients({ photoURL, id, firstname, lastname, handleAppointClick, client }) {
  return (
    <div className='bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
      <img
        alt='user'
        className='w-20 md:w-40 rounded-full'
        src={photoURL === '' || !photoURL ? require('../../assets/user.png') : `${photoURL}`}
      />
      <h1 className='text-white'>{`${firstname} ${lastname}`}</h1>
      {client.lawyer ? <h1 className='text-white'>Appointed Lawyer: {client.lawyer}</h1> : ''}
      <button className='text-white' onClick={e => handleAppointClick(e, client)}>
        Appoint Lawyer
      </button>
    </div>
  )
}

function EditClient({
  photoURL,
  id,
  firstname,
  lastname,
  handleCancelClick,
  lawyersList,
  handleEdit,
  handleEditFormSubmit,
  client,
}) {
  return (
    <div className='bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'>
      <img
        alt='user'
        className='w-20 md:w-40 rounded-full'
        src={photoURL === '' || !photoURL ? require('../../assets/user.png') : `${photoURL}`}
      />
      <h1 className='text-white'>{`${firstname} ${lastname}`}</h1>
      <select name='appoint-lawyer' onChange={handleEdit}>
        <option value=''>Select Lawyer</option>
        {lawyersList?.map(lawyer => (
          <>
            <option value={lawyer?.initials}>{`${lawyer?.firstname} ${lawyer?.lastname}`}</option>
          </>
        ))}
      </select>
      <button onClick={e => handleEditFormSubmit(e, client)}>Save</button>
      <button onClick={handleCancelClick}>Cancel</button>
    </div>
  )
}
