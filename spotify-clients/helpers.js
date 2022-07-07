function callback(url, resolve) {
  return (res) => {
    console.log(`called: [${url}]: response: [${res.statusCode}]`)
    let data = ''
    res.on('data', chunk => {
      data = data + chunk
    })
    res.on('end', () => {
      resolve(data)
    })    
  }
}

function handleError(reject) {
  return (err) => {
    console.error(err)
    reject(err)
  }
}

module.exports = { callback, handleError }