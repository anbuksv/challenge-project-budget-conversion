module.exports = {
  capitalizeFirstLetter
}

function capitalizeFirstLetter (string) {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1)
}
