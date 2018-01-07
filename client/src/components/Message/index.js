import React from 'react'

import './style.css'

export default ({myId, msg, userId, userName}) =>
  <div className={`msgHolder ${myId === userId ? 'my' : 'others'}`}>
    <div className={`my-bubble triangle ${myId === userId ? 'my' : 'others'}`} >
      <p>{msg}</p>
    </div>
  </div>
