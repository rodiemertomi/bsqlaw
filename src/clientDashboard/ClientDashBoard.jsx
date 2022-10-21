import React, { useState } from 'react'
import ClientSideNavBar from './ClientSideNavBar'
import { useReducer } from 'react'
import ClientReducer from './reducers/ClientReducer'

export default function ClientDashboard({ username }) {
  const [hideNavBar, setHideNavBar] = useState()
  const [state, dispatch] = useReducer(ClientReducer, { page: '' })
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const [touchEndY, setTouchEndY] = useState(null)

  const minSwipeDistance = 150

  const onTouchStart = e => {
    setTouchEndX(null)
    setTouchEndY(null)
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const onTouchMove = e => {
    setTouchEndX(e.targetTouches[0].clientX)
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distanceX = touchStartX - touchEndX
    const distanceY = touchStartY - touchEndY
    const isLeftSwipe = distanceX > minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance
    if (isLeftSwipe || isUpSwipe || isDownSwipe) {
      setHideNavBar(true)
    } else {
      setHideNavBar(false)
    }
    console.log(distanceY)
  }

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
