const axios = require('axios').default

module.exports = {
  toCurrency: currency()
}

function currency () {
  let conversionRates
  async function refetchConversationRates () {
    const { data } = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/latest/USD`)
    conversionRates = data.conversion_rates
  }

  return async function (usdCurrency, targetCurrency) {
    if (!conversionRates) await refetchConversationRates()
    return usdCurrency * conversionRates[targetCurrency]
  }
}
