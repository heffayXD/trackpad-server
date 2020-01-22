
/**
 * Starts the server instance
 * @param {object} app
 * @param {Server} server
 * @param {object} event
 * @param {object} params
 */
export const onStartServer = async (app, server, event, params) => {
  try {
    if (params.port) server.setPort(params.port)
    const [success, result] = await server.start()

    if (!success) throw new Error(result)

    event.reply('start-server-reply', [true, server.getConfig()])
  } catch (err) {
    event.reply('start-server-reply', [false, err.message])
  }
}

/**
 * Stops the running server instance
 * @param {object} app
 * @param {Server} server
 * @param {object} event
 * @param {object} params
 */
export const onStopServer = async (app, server, event, params) => {
  try {
    const [success, result] = await server.stop()

    if (!success) throw new Error(result)

    event.reply('stop-server-reply', [true, result])
  } catch (err) {
    event.reply('stop-server-reply', [false, err.message])
  }
}

/**
 * Checks to see if the websocket server is running
 * @param {object} app
 * @param {Server} server
 * @param {object} event
 * @param {object} params
 */
export const onCheckServer = async (app, server, event, params) => {
  try {
    const result = await server.isActive()

    if (result) {
      event.reply('check-server-reply', [true, server.getConfig()])
    } else {
      event.reply('check-server-reply', [true, false])
    }
  } catch (err) {
    event.reply('check-server-reply', [false, err.message])
  }
}
