import React, { useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import LawyerDashboard from '../lawyerDashboard/LawyerDashboard'
import AdminDashBoard from '../adminDashBoard/AdminDashBoard'
import ClientDashBoard from '../clientDashboard/ClientDashBoard'
import OwnerDashBoard from '../ownerDashboard/OwnerDashBoard'
import { useIdleTimer } from 'react-idle-timer'
import UseUserReducer from '../UserReducer'

const DashBoard = () => {
  const timeout = 5 * 1000 * 60
  const { user, logOut } = UserAuth()
  const colRef = collection(db, 'users')
  const userRef = query(colRef, where('email', '==', user.email))

  const {
    setUsername,
    setRole,
    setEmail,
    setPhotoURL,
    setExpertise,
    setAppointments,
    setId,
    setInitials,
  } = UseUserReducer()

  const { role } = UseUserReducer()

  const handeOnIdle = () => {
    logOut()
    console.log('User has been logged out')
  }

  const handleOnActive = () => {
    reset()
  }

  const { reset } = useIdleTimer({
    timeout,
    onIdle: handeOnIdle,
    onActive: handleOnActive,
  })

  useEffect(() => {
    const getUserRole = async () => {
      const querySnapshot = await getDocs(userRef)
      try {
        querySnapshot.forEach(doc => {
          const data = doc.data()
          setRole(data.role)
          setUsername(data.username)
          setEmail(data.email)
          setAppointments(data.appointments)
          setPhotoURL(data.photoURL)
          setExpertise(data.expertise)
          setId(doc.id)
          setInitials(data.initials)
        })
      } catch (err) {
        console.log(err.message)
      }
    }
    getUserRole()
  }, [])

  const renderDashboard = () => {
    switch (role) {
      case 'lawyer':
        return <LawyerDashboard />
      case 'admin':
        return <AdminDashBoard />
      case 'owner':
        return <OwnerDashBoard />
      default:
        return <ClientDashBoard />
    }
  }

  return (
    <>
      <div>{renderDashboard()}</div>
    </>
  )
}

export default DashBoard
