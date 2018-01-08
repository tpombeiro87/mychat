import React from 'react'

import './style.css'

export default ({chattingToUserName, myUserName}) =>
  <header className='header'>
    <h1 className='title'>-- Tiago Chat --</h1>
    <h4 className='sub-title'>-Talking to: {chattingToUserName} @ Your nick: {myUserName} -</h4>
  </header>
