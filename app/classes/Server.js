import WebSocket from 'ws'
import ip from 'ip'
import robot from 'robotjs'

class Server {
  constructor () {
    this.instance = null
    this.port = 9001
    this.prevCoords = null
  }

  setPort (port) {
    this.port = port
  }

  /**
   * Starts the Websocket Server
   * @return {Promise}
   */
  async start () {
    try {
      if (this.instance !== null) throw new Error('Server already listening!')

      const webSocketServer = new WebSocket.Server({ port: this.port })

      webSocketServer.on('connection', webSocket => {
        webSocket.on('message', this.onMessage.bind(this))

        webSocket.send('Connection successful')
      })

      this.instance = webSocketServer

      return [true, `Server started on port ${this.port}`]
    } catch (err) {
      return [false, err.message]
    }
  }

  /**
   * Stops the server
   * @return {Promise}
   */
  async stop () {
    return new Promise((resolve, reject) => {
      try {
        if (this.instance === null) throw new Error('Server instance not found')

        this.instance.close(() => {
          console.log('Server stopped')
          this.instance = null
          resolve([true, 'Server stopped'])
        })
      } catch (err) {
        reject([false, err.message]) // eslint-disable-line
      }
    })
  }

  /**
   * Returns whether or not the instance is active
   * @return {boolean}
   */
  async isActive () {
    if (this.instance === null) return false

    return true
  }

  /**
   * Retrieves the config object of the active server
   * @return {object}
   */
  getConfig () {
    return { domain: ip.address(), port: this.port }
  }

  /**
   * Handles message event
   * @param {string} message
   */
  onMessage (message) {
    const event = message.charAt(0)
    const parsed = message.substring(1)

    switch (event) {
      case 'm':
        this.moveMouse(parsed.split('?'))
        break
      case 'l':
        this.mouseClick('left', !!parseInt(parsed))
        break
      case 'r':
        this.mouseClick('right', !!parseInt(parsed))
        break
      case 't':
        this.type(parsed)
        break
      case 's':
        this.setMousePos(parsed.split('?'))
        break
      case 'e':
        this.prevCoords = null
        break
      default:
        console.log('Something else happened')
    }
  }

  /**
   * Presses a mouse button
   * @param {string} button
   * @param {boolean} pressed
   */
  mouseClick (button, pressed) {
    const action = pressed ? 'down' : 'up'
    robot.mouseToggle(action, button)
  }

  /**
   * Types
   * @param {string} key
   */
  type (key) {
    const preparedKey = key.toLowerCase()
    if (key === key.toUpperCase()) {
      robot.keyToggle('shift', 'down')
      robot.keyTap(preparedKey)
      robot.keyToggle('shift', 'up')
    } else {
      robot.keyTap(preparedKey)
    }
  }

  /**
   * Moves the mouse based on the start position
   * @param {array} coords
   */
  moveMouse (coords) {
    const mouse = robot.getMousePos()

    // Convert to floats
    const parsed = { x: parseFloat(coords[0]), y: parseFloat(coords[1]) }

    // Discover the change from last position
    const change = {
      x: parsed.x - this.prevCoords.x,
      y: parsed.y - this.prevCoords.y
    }

    // Add this change to the current mouse position
    const x = mouse.x + change.x
    const y = mouse.y + change.y

    // Reset the previous coordinates with the updates coordinates
    this.prevCoords = { x: parsed.x, y: parsed.y }

    robot.setMouseDelay(2)
    robot.moveMouse(x, y)
  }

  /**
   * Sets the current mouse position
   * @param {array} coords
   */
  setMousePos (coords) {
    this.prevCoords = { x: parseFloat(coords[0]), y: parseFloat(coords[1]) }
  }
}

export default Server
