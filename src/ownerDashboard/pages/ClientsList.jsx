import React, { Fragment, useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../firebase'

export default function ClientsList() {
  const colRef = collection(db, 'users')
  const q1 = query(colRef, where('role', '==', 'client'))
  const q2 = query(colRef, where('role', '==', 'lawyer'))
  const [clientsList, setClientsList] = useState()
  const [lawyersList, setLawyersList] = useState()
  const [clientEditId, setClientEditId] = useState()
  const [selectedLawyer, setSelectedLawyer] = useState()
  const [originalLawyer, setOriginalLawyer] = useState('')

  const handleEditClick = (e, client) => {
    e.preventDefault()
    setClientEditId(client.id)
    setOriginalLawyer(client.lawyer)
  }

  const handleEdit = e => {
    const selectedOption = e.target.value
    setSelectedLawyer(selectedOption)
  }

  const handleEditFormSubmit = async (e, client) => {
    e.preventDefault()
    const colRef = collection(db, 'users')
    const lq1 = query(colRef, where('initials', '==', `${selectedLawyer}`))
    if (originalLawyer === '') {
      const data = await getDocs(lq1)
      const lawyer = data.docs.map(doc => {
        return doc.id
      })
      const lawyerRef = doc(db, `users/${lawyer}`)
      const clientRef = doc(db, `users/${clientEditId}`)
      const editedClient = {
        lawyer: selectedLawyer,
      }
      const clientObject = {
        firstname: client.firstname,
        lastname: client.lastname,
        id: client.id,
        username: client.username,
      }
      const editedLawyer = {
        clients: arrayUnion(clientObject),
      }
      await setDoc(clientRef, editedClient, { merge: true }).then(() => {
        alert(`${selectedLawyer} assigned to ${client.username}`)
        getClients()
        getLawyers()
      })

      await setDoc(lawyerRef, editedLawyer, { merge: true }).then(() => {
        alert(`${client.username} assigned to ${selectedLawyer}`)
        getClients()
        getLawyers()
      })
    } else {
      const lq2 = query(colRef, where('initials', '==', `${originalLawyer}`))
      const data = await getDocs(lq1)
      const data2 = await getDocs(lq2)
      const lawyer = data.docs.map(doc => {
        return doc.id
      })
      const origLawyer = data2.docs.map(doc => {
        return doc.id
      })
      const lawyerRef = doc(db, `users/${lawyer}`)
      const clientRef = doc(db, `users/${clientEditId}`)
      const origLawyerRef = doc(db, `users/${origLawyer}`)
      const origLawyerData = await getDoc(origLawyerRef)
      const origLawyerInitials = origLawyerData.data().initials

      const editedClient = {
        lawyer: selectedLawyer,
      }

      const clientDeleteObject = {
        firstname: client.firstname,
        lastname: client.lastname,
        id: client.id,
        username: client.username,
      }

      const clientObject = {
        firstname: client.firstname,
        lastname: client.lastname,
        id: client.id,
        username: client.username,
      }

      const editedLawyer = {
        clients: arrayUnion(clientObject),
      }

      const editedLawyerDelete = {
        clients: arrayRemove(clientDeleteObject),
      }

      await setDoc(clientRef, editedClient, { merge: true }).then(() => {
        alert(`${selectedLawyer} assigned to ${client.firstname} ${client.lastname}`)
        getClients()
        getLawyers()
      })

      await setDoc(lawyerRef, editedLawyer, { merge: true }).then(() => {
        alert(`${client.username} assigned to ${selectedLawyer}`)
        getClients()
        getLawyers()
      })

      await setDoc(origLawyerRef, editedLawyerDelete, { merge: true }).then(() => {
        alert(`${client.username} removed from ${origLawyerInitials}`)
        getClients()
        getLawyers()
        setOriginalLawyer('')
      })
    }
    setClientEditId(null)
    setSelectedLawyer(null)
  }

  const handleCancelClick = () => {
    setClientEditId(null)
  }

  const getClients = async () => {
    const data = await getDocs(q1)
    setClientsList(data?.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }
  const getLawyers = async () => {
    const data = await getDocs(q2)
    setLawyersList(data?.docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(() => {
    getClients()
    getLawyers()
  }, [])
  return (
    <div>
      <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
        <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Client</h1>
        <div className='h-full flex flex-col mt-2 gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-3 lg:pt-0'>
          <div className='w-[100%] h-[1000%] bg-[#D9D9D9] rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 p-5 '>
            <div className='w-[100%] flex gap-x-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
              {clientsList?.map((client, i) => (
                <Fragment key={client.id}>
                  {clientEditId === client.id ? (
                    <EditClient
                      client={client}
                      lawyersList={lawyersList}
                      handleEdit={handleEdit}
                      handleCancelClick={handleCancelClick}
                      handleEditFormSubmit={handleEditFormSubmit}
                    />
                  ) : (
                    <ReadClients i={i} handleAppointClick={handleEditClick} client={client} />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReadClients({ handleAppointClick, client, i }) {
  return (
    <div className='bg-[#632121] w-[240px] h-[270px] lg:w-[260px] lg:h-[270px] shadow-lg rounded-2xl flex flex-col md:w-[220px] md:h-[270px] items-center justify-center text-white gap-1'>
      <div className=' text-xs lg:text-sm w-full flex flex-col justify-center items-center gap-1'>
        <img
          alt='user'
          className=' w-[120px] h-[120px] lg:w-[125px] lg:h-[125px] md:w-[125px] md:h-[125px] rounded-full'
          src={
            client.photoURL === '' || !client.photoURL
              ? require('../../assets/user.png')
              : `${client.photoURL}`
          }
        />
        <h1 className='text-yellow mt-1 font-bold text-lg '>{`${client.username}`}</h1>
        <div className='w-full bg-black p-2 shadow-lg flex flex-col items-center justify-start text-xs gap-1'>
          {client.lawyer ? (
            <h1 className='text-white font-semibold text-center flex flex-col items-center justify-center'>
              <span className='text-yellow'>Appointed Lawyer</span>
              <span className='text-white '>{client.lawyer}</span>
            </h1>
          ) : (
            ''
          )}
          <button
            className='w-[61%] px-6 py-1 h-6 inline-block text-maroon font-medium text-xs leading-tight uppercase rounded shadow-md bg-white hover:bg-maroon hover:text-white active:shadow-lg transition duration-150 ease-in-out'
            onClick={e => handleAppointClick(e, client)}
          >
            Appoint Lawyer
          </button>
        </div>
      </div>
    </div>
  )
}

function EditClient({
  handleCancelClick,
  lawyersList,
  handleEdit,
  handleEditFormSubmit,
  client,
  i,
}) {
  return (
    <div
      key={client.id}
      className='bg-[#632121] w-[240px] h-[275px] lg:w-[260px] lg:h-[275px] shadow-lg rounded-2xl flex flex-col mb-5 md:w-[220px] md:h-[270px] text-white gap-1'
    >
      <div className=' text-xs lg:text-sm w-full flex flex-col justify-center items-center gap-3'>
        <img
          alt='user'
          className='mt-4 w-[120px] h-[120px] lg:w-[125px] lg:h-[125px] md:w-[125px] md:h-[125px] rounded-full'
          src={
            client.photoURL === '' || !client.photoURL
              ? require('../../assets/user.png')
              : `${client.photoURL}`
          }
        />
        <h1 className='text-yellow'>{`${client.firstname} ${client.lastname}`}</h1>
        <select
          className='w-[55%] h-6 inline-block text-maroon font-medium text-xs leading-tight uppercase rounded shadow-md bg-white active:shadow-lg transition'
          name='appoint-lawyer'
          onChange={handleEdit}
        >
          <option value=''>Select Lawyer</option>
          {lawyersList?.map(lawyer => (
            <>
              <option
                key={lawyer.id}
                value={lawyer?.initials}
              >{`${lawyer?.firstname} ${lawyer?.lastname}`}</option>
            </>
          ))}
        </select>
        <div className='flex gap-1'>
          <button
            className='w-[55px] h-6 inline-block text-maroon font-medium text-xs leading-tight uppercase rounded shadow-md bg-white hover:bg-maroon hover:text-white active:shadow-lg transition duration-150 ease-in-out'
            onClick={e => handleEditFormSubmit(e, client)}
          >
            Save
          </button>
          <button
            className='w-[55px] h-6 inline-block text-maroon font-medium text-xs leading-tight uppercase rounded shadow-md bg-white hover:bg-maroon hover:text-white active:shadow-lg transition duration-150 ease-in-out'
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
