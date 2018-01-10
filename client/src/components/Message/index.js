//@flow
import React from 'react'

import './style.css'

type Props = {
  msg: string,
  sender: string,
  commandInputed: string
}

export default ({msg, sender, commandInputed}: Props) => {
  // css class names accoringly to sender of the message
  let className = (sender !== 'system' ? `bubble ` : '') + sender + ' '
  if (commandInputed) {
    className += commandInputed.replace('/', '')
  }
  // paragraph handling
  const msgsParagraph = msg.split('\n')
  return (
    <div className='msgholder'>
      <div className={className} >
        {
          msgsParagraph.map((p, i) =>
            <p key={`p-${i}`}>{p}</p>)
        }
      </div>
    </div>
  )
}
