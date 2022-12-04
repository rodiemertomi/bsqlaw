import React from 'react'
import { useContext, createContext, useEffect, useState } from 'react'
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setuser] = useState({})
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logOut = () => {
    signOut(auth)
  }

  const changePassword = async password => {
    await updatePassword(user, password)
  }

  const triggerResetEmail = async email => {
    await sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setuser(currentUser)
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ logOut, user, signup, login, changePassword, triggerResetEmail }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
