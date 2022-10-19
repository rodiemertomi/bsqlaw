import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import AdminSideNavBar from './AdminSideNavBar'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useReducer } from 'react'
import AdminReducer from './reducers/AdminReducer'

export default function AdminDashBoard({ username }) {
  const [hideNavBar, setHideNavBar] = useState()
  const [state, dispatch] = useReducer(AdminReducer, { page: '' })
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
      <AdminSideNavBar
        username={username}
        dispatch={dispatch}
        hideNavBar={hideNavBar}
        minSwipeDistance={minSwipeDistance}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        setHideNavBar={setHideNavBar}
      />
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
