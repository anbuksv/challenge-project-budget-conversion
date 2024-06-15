module.exports = {
  handler
}

function handler (func) {
  return async function (req, res, next) {
    try {
      await func(req, res, next)
    } catch (err) {
      res.status(500).json({ message: err.message || err })
    }
  }
}
