const { toCurrency } = require('../util/currency')
const { capitalizeFirstLetter } = require('../util/capitalize')
const { getProjectByYearAndName } = require('../repository/project')

module.exports = {
  currencyHandler
}

async function currencyHandler (req, res) {
  const { year, currency: targetCurrency, projectName } = req.body
  const targetFieldName = `finalBudget${capitalizeFirstLetter(targetCurrency)}`
  const projects = await getProjectByYearAndName(year, projectName)
  const promises = projects.map(async (product) => {
    product[targetFieldName] = await toCurrency(product.finalBudgetUsd, targetCurrency)
    return product
  })
  const data = await Promise.all(promises)
  res.json({ success: true, data })
}
