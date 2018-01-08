import React from 'react'

import './style.css'

export default ({chattingToUserName}) =>
  <header className='header'>
    <h1 className='title'>-- Tiago Chat --</h1>
    <h4 className='sub-title'>-- @{chattingToUserName} --</h4>
  </header>
