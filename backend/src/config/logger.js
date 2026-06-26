function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`
  if (!meta) return base
  try {
    return `${base} ${JSON.stringify(meta)}`
  } catch (e) {
    return base
  }
}

function info(message, meta) {
  console.log(formatMessage('info', message, meta))
}

function warn(message, meta) {
  console.warn(formatMessage('warn', message, meta))
}

function error(message, meta) {
  console.error(formatMessage('error', message, meta))
}

function debug(message, meta) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(formatMessage('debug', message, meta))
  }
}

module.exports = {
  info,
  warn,
  error,
  debug,
}
