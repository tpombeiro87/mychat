import React from 'react'

import './style.css'

export default ({value, onChange, onKeyDown}) =>
  <div className='customInput'>
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown} />
  </div>
