//@flow
import React from 'react'

import './style.css'

type Props = {
  msg: string,
  sender: string,
  commandInputed: string
}

export default ({msg, sender, commandInputed}: Props) =>
  <div className='msgholder'>
    <div className={`${(sender === 'system') ? 'info' : 'bubble'} ${sender} ${commandInputed}`} >
      {
        msg.split('\n').map((p, i) =>
          <p key={`p-${i}`}>{p}</p>)
      }
    </div>
  </div>
