import React from 'react'

const MaroonButton = props => {
  return (
    <div>
      <button className='font-Lora font-bold py-4 px-8 rounded-3xl border-gray border-2 bg-maroon hover:text-black hover:bg-white text-white md:text-sm md:py-3 md:px-4'>
        {props.children}
      </button>
    </div>
  )
}

export default MaroonButton
