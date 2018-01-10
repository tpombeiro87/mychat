//@flow
import React from 'react'

import './style.css'

type Props = {
  myNick?: string,
  remoteUserNick?: string
}

export default ({remoteUserNick, myNick}: Props) =>
  <header className='header'>
    <h1 className='title'>-- Tiago Chat --</h1>
    <h4 className='sub-title'>-Talking to: {remoteUserNick} @ Your nick: {myNick} -</h4>
  </header>
