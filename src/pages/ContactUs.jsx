import React, { useState } from 'react'
import MaroonButton from '../components/MaroonButton'
import emailjs from '@emailjs/browser'

const Result = () => {
  return (
    <div>
      <p>Your message has been successfully sent.</p>
    </div>
  )
}

function ContactUs() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleChange = event => {
    if (!isValidEmail(event.target.value)) {
      setError('Email is invalid!')
    } else {
      setError(null)
    }
    setMessage(event.target.value)
  }

  const [result, showResult] = useState(false)
  const sendEmail = form => {
    form.preventDefault()

    emailjs.sendForm('service_5gjxz6n', 'template_rzy2xi9', form.target, 'm_ccmgiqUCgKDcULH').then(
      result => {
        console.log(result.text)
      },
      error => {
        console.log(error.text)
      }
    )
    form.target.reset()
    showResult(true)
  }
  return (
    <div>
      <div className='min-h-screen flex flex-col content-center bg-white gap-10 p-6 md:flex md:flex-col md:items-center lg:flex lg:flex-row lg:justify-center lg:gap-10 lg:m-0 text-shadow-xl font-Lora pb-4'>
        <div className='flex flex-col items-start content-center gap-5 animate-[moveRight_0.8s_ease-in-out]'>
          <div className='self-start text-5xl text-maroon font-bold pt-[20%] md:pt-5 md:flex md:flex-col md:self-center lg:flex lg:self-start lg:text-3xl 2xl:text-6xl'>
            <h2>Contact Us</h2>
          </div>
          <form
            action=''
            onSubmit={sendEmail}
            className='flex flex-col items-start content-center gap-5'
          >
            <input
              type='text'
              id='name'
              placeholder='Name'
              required
              name='name'
              className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            ></input>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Your Email'
              value={message}
              onChange={handleChange}
              required
              className=' h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            ></input>
            <input
              type='text'
              id='subject'
              name='subject'
              placeholder='Subject'
              required
              className=' h-10 pl-4  shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            ></input>
            <textarea
              rows='4'
              cols='42'
              name='message'
              placeholder='Message'
              required
              className='pl-4 h-28 shadow appearance-none border-[1px] border-gray rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            ></textarea>
            <div className='pl-1'>
              {error && (
                <h2
                  style={{
                    color: 'red',
                    background: '#ffcc00',
                    padding: '8px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  {error}
                </h2>
              )}
            </div>
            {result ? <Result /> : null}
            <MaroonButton>Submit</MaroonButton>
          </form>

          <div className='lg:self-start md:self-center'>
            <span className='font-bold'>Getting in touch is easy!</span> <br />
            partnersbsq@gmail.com
          </div>
        </div>
        <div className='flex flex-col gap-3 md:flex md:flex-col md:items-center lg:pl-20 lg:mt-10 animate-[moveLeft_0.8s_ease-in-out]'>
          <h4 className='font-bold'>Find us here!</h4>
          <div className='flex flex-col items-center content-center'>
            <iframe
              className='w-full h-72 border border-solid shadow-md border-gray md:w-96 lg:w-[500px] lg:h-96 '
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.9217151329985!2d121.04287471420662!3d14.603535280921344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7d7869a44d5%3A0x1c8e36b34df81b83!2sBTTC%20Center!5e0!3m2!1sen!2sph!4v1651834797800!5m2!1sen!2sph'
              loading='lazy'
              title='bttcCenter'
            ></iframe>
          </div>
          <div className='md:flex md:flex-col md:self-center md:items-center md:w-72 lg:text-xs lg:w-80 lg:self-start font-bold'>
            Unit 908 BTTC Center Ortigas Corner Roosevelt Street, Greenhills, 1502, San Juan City,
            Philippines
          </div>
          <div className='md:flex md:flex-col md:self-center md:items-center md:w-72 lg:text-xs lg:w-80 lg:self-start font-bold pb-4'>
            Telephone Nos: (632) 753-1473, 753-1475, 753-1819 •Telefax: (632) 845-2371 Mobile:
            +639162283692
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
