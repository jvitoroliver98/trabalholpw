const logs = function (req, res, next) {
  console.log('Controle de Estoque da Empresa ABC')
  next()
}

module.exports = logs