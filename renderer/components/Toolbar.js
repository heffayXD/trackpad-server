import React from 'react'
import { useBrowserWindow } from '../hooks/electron'

const Toolbar = props => {
  const handleWindow = useBrowserWindow()

  return (
    <div id='toolbar'>
      <h1>Trackpad Server</h1>
      <div className='draggable' />
      <div id='toolbar-buttons'>
        <div className='button-container' onClick={() => { handleWindow('minimize') }}>
          <p>&#8212;</p>
        </div>
        <div className='button-container larger' onClick={() => { handleWindow('maximize') }}>
          <p>&#9633;</p>
        </div>
        <div className='button-container alert' onClick={() => { handleWindow('close') }}>
          <p>&#10005;</p>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
