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
    setClients,
    setFirstName,
    setLastName,
    setContactNo,
    setGender,
    setUsername,
    setRole,
    setEmail,
    setPhotoURL,
    setExpertise,
    setAppointments,
    setId,
    setInitials,
    setBirthday,
  } = UseUserReducer()

  const { role } = UseUserReducer()

  const handeOnIdle = () => {
    alert('User has been logged out')
    logOut()
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
    const getUserInfo = async () => {
      const querySnapshot = await getDocs(userRef)
      try {
        querySnapshot.forEach(doc => {
          const data = doc.data()
          setFirstName(data.firstname)
          setLastName(data.lastname)
          setContactNo(data.contactNo)
          setGender(data.gender)
          setUsername(data.username)
          setRole(data.role)
          setEmail(data.email)
          setPhotoURL(data.photoURL)
          setExpertise(data.expertise)
          setAppointments(data.appointments)
          setId(doc.id)
          setInitials(data.initials)
          setBirthday(data.birthday)
          setClients(data.clients)
        })
      } catch (err) {
        alert(err.message)
      }
    }
    getUserInfo()
  }, [])

  const renderDashboard = () => {
    switch (role) {
      case 'lawyer':
        return <LawyerDashboard />
      case 'admin':
        return <AdminDashBoard />
      case 'partner':
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
