import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import ClientSideNavBar from './ClientSideNavBar'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useReducer } from 'react'
import ClientReducer from './reducers/ClientReducer'

export default function ClientDashboard({ username }) {
  const [hideNavBar, setHideNavBar] = useState()
  const [state, dispatch] = useReducer(ClientReducer, { page: '' })
  const { user } = UserAuth()
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const colRef = collection(db, 'users')
  const userRef = query(colRef, where('email', '==', user.email))

  const minSwipeDistance = 150

  const onTouchStart = e => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = e => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    if (isLeftSwipe) {
      setHideNavBar(true)
    } else {
      setHideNavBar(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userRef)
    }

    getUser()
  }, [userRef])

  return (
    <>
      <ClientSideNavBar username={username} dispatch={dispatch} hideNavBar={hideNavBar} />
      <div>
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className='flex flex-col h-screen justify-center items-center fixed w-screen'
        >
          {state.page}
        </div>
      </div>
    </>
  )
}
