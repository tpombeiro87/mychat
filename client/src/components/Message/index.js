import React from 'react'

import './style.css'

export default ({myId, msg, userId, userName}) => {
  let className = ''
  if (userId === 'system') className = 'system'
  else if (userId === myId) className = 'my-bubble  my'
  else className = 'my-bubble others'

  return (
    <div className='msgHolder'>
      <div className={className} >
        <p>{msg}</p>
      </div>
    </div>
  )
}
