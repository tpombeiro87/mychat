//@flow
import React from 'react'

import './style.css'

type Props = {
  myId?: string,
  msg: string,
  userId: string,
  userName: string,
}

export default ({myId, msg, userId, userName}: Props) => {
  const commandInputed = msg.split(' ')[0]
  msg = msg.replace(new RegExp('(;[)])', 'g'), '😉')
  msg = msg.replace(new RegExp('(:[)])', 'g'), '😊')
  const msgsParagraph = msg.split('\n')

  let className = ''
  if (userId === 'system') className = 'systemmsg'
  else if (userId === myId) className = 'bubble self '
  else className = 'bubble others '

  if (commandInputed === '/think') {
    className += 'think'
    msg = msg.replace('/think ', '')
  } else if (commandInputed === '/highlight') {
    className += 'highlight'
    msg = msg.replace('/highlight ', '')
  } else if (commandInputed === '/countdown') {
    msg = msg.replace('/countdown ', '')
  } else if (commandInputed === '/fadelast') {
    className += 'fadelast'
  }

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
