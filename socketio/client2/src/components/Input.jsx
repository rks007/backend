import React from 'react'

const Input = ({placeholder, handleInput, name}) => {
  return (
    <div>
        <input name={name} className='input-field' type="text" placeholder={placeholder} onChange={handleInput}/>
    </div>
  )
}

export default Input