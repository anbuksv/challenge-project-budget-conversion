module.exports = {
  withResolvers
}

// With Promise.withResolvers() we can rewrite it but required NodeJS version should be > 22.
function withResolvers () {
  let resolve, reject
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return [promise, resolve, reject]
}
