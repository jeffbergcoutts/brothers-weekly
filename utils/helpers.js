const logToConsole = process.env.LOGTOCONSOLE

function print(message) {
  if (logToConsole != "false") console.log(message)
}

module.exports = { print }