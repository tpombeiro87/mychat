import React from 'react'

import './style.css'

export default ({value, onChange, onBtnSendClick}) =>
  <div className='customInput'>
    <textarea
      value={value}
      onChange={onChange} />
    <button onClick={onBtnSendClick}>SEND</button>
  </div>
