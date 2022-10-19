import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import LawyerSideNavBar from './LawyerSideNavBar'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useReducer } from 'react'
import LawyerReducer from './reducers/LawyerReducer'

export default function LawyerDashboard({ username }) {
  const [hideNavBar, setHideNavBar] = useState()
  const [state, dispatch] = useReducer(LawyerReducer, { page: '' })
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
      <LawyerSideNavBar username={username} dispatch={dispatch} hideNavBar={hideNavBar} />
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
