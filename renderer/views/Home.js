import React, { useEffect, useState } from 'react'
import Toolbar from '../components/Toolbar'
import { useIpcRenderer } from '../hooks/electron'

const Home = props => {
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [config, setConfig] = useState({ domain: '', port: 9001 })
  const [port, setPort] = useState(9001)
  const startServer = useIpcRenderer('start-server')
  const stopServer = useIpcRenderer('stop-server')
  const checkServer = useIpcRenderer('check-server')

  useEffect(() => {
    const checkIfRunning = async () => {
      const [success, result] = await checkServer()

      if (!success || !result) return

      setRunning(true)
      setConfig(result)
    }

    checkIfRunning()
  }, [])

  const handleStart = async () => {
    setLoading(true)
    const [success, result] = await startServer({ port })
    setLoading(false)

    if (!success) return

    setConfig(result)
    setRunning(true)
  }

  const handlePort = e => {
    setPort(parseInt(e.target.value))
  }

  const handleStop = async () => {
    setLoading(true)
    const result = await stopServer()
    setLoading(false)

    if (!result) return

    setRunning(false)
  }

  return (
    <div className='view-wrapper'>
      <Toolbar />
      <main id='home'>
        {running ? (
          <div className='home-wrapper'>
            <h2>Server is <span className='online'>Online</span></h2>
            <button onClick={handleStop}>{loading ? 'Stopping...' : 'Stop'}</button>
            <div id='config'>
              <p>Domain: {config.domain}</p>
              <p>Port: {config.port}</p>
            </div>
          </div>
        ) : (
          <div className='home-wrapper'>
            <h2>Server is <span className='offline'>Offline</span></h2>
            <button onClick={handleStart}>{loading ? 'Starting...' : 'Start'}</button>
            <div id='config'>
              <p>Port</p>
              <input placeholder='Enter Port' name='port' value={port.toString()} onChange={handlePort} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
