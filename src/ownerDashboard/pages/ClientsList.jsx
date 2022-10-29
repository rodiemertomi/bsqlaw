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
    if (originalLawyer !== '') {
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

      const editedClient = {
        lawyer: selectedLawyer,
      }

      const clientDeleteObject = {
        firstname: client.firstname,
        lastname: client.lastname,
        id: client.id,
      }

      const clientObject = {
        firstname: client.firstname,
        lastname: client.lastname,
        id: client.id,
      }

      const editedLawyer = {
        clients: arrayUnion(clientObject),
      }

      const editedLawyerDelete = {
        clients: arrayRemove(clientDeleteObject),
      }

      await setDoc(clientRef, editedClient, { merge: true }).then(() => {
        alert(`${selectedLawyer} assigned to ${client.firstname} ${client.lastname}`)
      })

      await setDoc(lawyerRef, editedLawyer, { merge: true }).then(() => {
        alert(`${client.firstname} ${client.lastname} assigned to ${selectedLawyer}`)
      })

      await setDoc(origLawyerRef, editedLawyerDelete, { merge: true }).then(() => {
        alert(`${client.firstname} ${client.lastname} removed from ${origLawyerRef.initials}`)
      })
    } else {
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
      }
      const editedLawyer = {
        clients: arrayUnion(clientObject),
      }
      await setDoc(clientRef, editedClient, { merge: true }).then(() => {
        alert(`${selectedLawyer} assigned to ${client.firstname} ${client.lastname}`)
      })

      await setDoc(lawyerRef, editedLawyer, { merge: true }).then(() => {
        alert(`${client.firstname} ${client.lastname} assigned to ${selectedLawyer}`)
      })
    }

    setClientEditId(null)
    setSelectedLawyer(null)
    getClients()
    getLawyers()
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
        <div className='h-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0'>
          <div className='w-[100%] h-[1000%] bg-[#D9D9D9] rounded-md flex flex-col gap-5 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
            <h1 className='self-start text-[30px] mt-5 ml-5 font-bold lg:ml-10'>Clients</h1>
            <div className='w-[100%] flex gap-10 flex-wrap justify-center lg:w-[100%] lg:overflow-auto lg:scrollbar-hide'>
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
    <div
      key={client.id}
      className='bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'
    >
      <img
        alt='user'
        className='w-20 md:w-40 rounded-full'
        src={
          client.photoURL === '' || !client.photoURL
            ? require('../../assets/user.png')
            : `${client.photoURL}`
        }
      />
      <h1 className='text-white'>{`${client.firstname} ${client.lastname}`}</h1>
      <h1 className='text-white'>{`${client.username}`}</h1>
      {client.lawyer ? <h1 className='text-white'>Appointed Lawyer: {client.lawyer}</h1> : ''}
      <button className='text-white' onClick={e => handleAppointClick(e, client)}>
        Appoint Lawyer
      </button>
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
      className='bg-[#632121] w-32 h-32 rounded-2xl flex flex-col items-center justify-center mb-5 md:w-48 md:h-48 lg:w-60 lg:h-60'
    >
      <img
        alt='user'
        className='w-20 md:w-40 rounded-full'
        src={
          client.photoURL === '' || !client.photoURL
            ? require('../../assets/user.png')
            : `${client.photoURL}`
        }
      />
      <h1 className='text-white'>{`${client.firstname} ${client.lastname}`}</h1>
      <select name='appoint-lawyer' onChange={handleEdit}>
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
      <div className='flex gap-4'>
        <button onClick={handleCancelClick}>Cancel</button>
        <button onClick={e => handleEditFormSubmit(e, client)}>Save</button>
      </div>
    </div>
  )
}
