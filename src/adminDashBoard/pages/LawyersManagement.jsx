import { createUserWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { useState } from 'react'
import { useEffect } from 'react'

export default function LawyersManagement() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [lawyers, setLawyers] = useState([])
  const colRef = collection(db, 'users')
  const lawyerRef = query(colRef, where('role', '==', 'lawyer'))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (!email) return
    try {
      await createUserWithEmailAndPassword(auth, email, 'newlawyer')
      const data = {
        name: 'newlawyer',
        email: email,
        photoURL: '',
        role: 'lawyer',
      }
      await addDoc(colRef, data)
    } catch (err) {
      console.log(err.message)
    }
    setLoading(false)
    setEmail('')
  }

  useEffect(() => {
    const getLawyers = async () => {
      const data = await getDocs(lawyerRef)
      setLawyers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getLawyers()
  }, [lawyerRef])

  return (
    <>
      <div className='h-screen w-screen font-Lora'>
        <div className='m-1 lg:ml-24'>
          <h1 className='text-3xl font-bold'>Create Lawyers</h1>
          <div className='mt-5'>
            <form onSubmit={handleSubmit} action=''>
              <label className='text-semibold text-lg' htmlFor='email'>
                {' '}
                Email:{' '}
              </label>
              <input
                className='w-38 pl-2 ml-2 rounded-md border-2 border-gray'
                type='email'
                name='email'
                disabled={loading}
                placeholder='Email'
                onChange={e => setEmail(e.target.value)}
              />
              <button
                className='w-28 h-7 rounded-md border-0 bg-maroon text-white ml-2'
                type='submit'
              >
                Create New
              </button>
            </form>
          </div>
          <div className='mt-5 flex flex-col justify-center items-center'>
            <div className='flex self-start'>
              <h1 className='font-semibold text-xl'>Lawyer Details</h1>
            </div>
            <div className='mt-2'>
              <table className='w-screen text-center'>
                <tr>
                  <th className='p-2'>Username</th>
                  <th className='p-2'>Email Address</th>
                  <th className='p-2'>Role</th>
                </tr>
                {/* Data Number 1 sample */}
                <tr>
                  <td className='p-2'>
                    {lawyers.map(lawyer => {
                      return (
                        <div key={lawyer.id} className='flex justify-around items-center'>
                          <li className='list-none' key={lawyer.id}>
                            {lawyer.name}
                          </li>
                        </div>
                      )
                    })}
                  </td>
                  <td className='p-2'>Email</td>
                  <td className='p-2'>Lawyer</td>
                </tr>
                <tr>
                  <td></td>
                  <td className='text-right'>
                    <button className='w-16 h-7 rounded-md border-0 bg-maroon text-white'>
                      Edit
                    </button>
                  </td>
                  <td className='text-left pl-2'>
                    <button className='w-20 h-7 rounded-md border-0 bg-maroon text-white'>
                      Delete
                    </button>
                  </td>
                </tr>
                {/* Data Number 2 sample */}
                <tr>
                  <td className='p-2'>
                    {lawyers.map(lawyer => {
                      return (
                        <div key={lawyer.id} className='flex justify-around items-center'>
                          <li className='list-none' key={lawyer.id}>
                            {lawyer.name}
                          </li>
                        </div>
                      )
                    })}
                  </td>
                  <td className='p-2'>Email</td>
                  <td className='p-2'>Lawyer</td>
                </tr>
                <tr>
                  <td></td>
                  <td className='text-right'>
                    <button className='w-16 h-7 rounded-md border-0 bg-maroon text-white'>
                      Edit
                    </button>
                  </td>
                  <td className='text-left pl-2'>
                    <button className='w-20 h-7 rounded-md border-0 bg-maroon text-white'>
                      Delete
                    </button>
                  </td>
                </tr>
                {/* Data Number 3 sample */}
                <tr>
                  <td className='p-2'>
                    {lawyers.map(lawyer => {
                      return (
                        <div key={lawyer.id} className='flex justify-around items-center'>
                          <li className='list-none' key={lawyer.id}>
                            {lawyer.name}
                          </li>
                        </div>
                      )
                    })}
                  </td>
                  <td className='p-2'>Email</td>
                  <td className='p-2'>Lawyer</td>
                </tr>
                <tr>
                  <td></td>
                  <td className='text-right'>
                    <button className='w-16 h-7 rounded-md border-0 bg-maroon text-white'>
                      Edit
                    </button>
                  </td>
                  <td className='text-left pl-2'>
                    <button className='w-20 h-7 rounded-md border-0 bg-maroon text-white'>
                      Delete
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
