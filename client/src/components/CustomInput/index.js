//@flow
import React from 'react'

import './style.css'

type Props = {
  value: string,
  onChange: Function,
  onBtnSendClick: Function
}

export default ({value, onChange, onBtnSendClick}: Props) =>
  <div className='custominput'>
    <textarea
      value={value}
      onChange={onChange} />
    <button onClick={onBtnSendClick}>SEND</button>
  </div>
