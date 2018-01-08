import React from 'react'

import './style.css'

export default ({myId, msg, userId, userName}) => {
  const commandInputed = msg.split(' ')[0]
  msg = msg.replace(new RegExp('(;[)])', 'g'), '😉')
  msg = msg.replace(new RegExp('(:[)])', 'g'), '😊')
  const msgsParagraph = msg.split('\n')

  let className = ''
  if (userId === 'system') className = 'system'
  else if (userId === myId) className = 'my-bubble my '
  else className = 'my-bubble others '

  if (commandInputed === '/think') {
    className += 'think'
    msg = msg.replace('/think ', '')
  } else if (commandInputed === '/highlight') {
    className += 'highlight'
    msg = msg.replace('/highlight ', '')
  } if (commandInputed === '/countdown') {
    msg = msg.replace('/countdown ', '')
  }

  return (
    <div className='msgHolder'>
      <div className={className} >
        {
          msgsParagraph.map((p, i) =>
            <p key={`p-${i}`}>{p}</p>)
        }
      </div>
    </div>
  )
}
