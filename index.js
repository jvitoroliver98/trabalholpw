const express = require('express')
const bodyParser = require('body-parser')

const logs = require('./middleware/logs')
const produtos = require('./produtos')

const app = express()

app.use(logs)

const situacao = n => n < 50 ? 'estável' : n < 100 ? 'boa': 'excelente';

app.get('/produtos', function (req, res) {
  res.json(produtos)
})

app.get('/produtos/:id', function (req, res) {
  const { id } = req.params

  const produto = produtos.find(function(el) {
    return el.id == id
  })

  if (produto) {
    res.json(produto)
  } else {
    res.status = 404
    res.send("Não existe Produto om este id.")
  }
})

app.post('/produtos', bodyParser.json(), function (req, res) {
  const { id, nome, quantidade, valorunitario } = req.body

  if ([id, nome, quantidade, valorunitario].some(el => typeof(el) === 'undefined')) {
    res.status = 400
    res.send("O campo id do produto ou nome do produto ou quantidade ou valor unitario não existe no corpo da requisição.")
  } else if (produtos.find(el => el.id === id)) {
    res.status = 400
    res.send("O id já existe")
  } else {
    const produto = {
      id,
      nome,
      quantidade,
      valorunitario,
      complemento: [],
      precototal: quantidade * valorunitario,
      precovenda: valorunitario * 1.2,
      lucro: valorunitario * 0.2,
      situacao: situacao(quantidade)
    }

    produtos.push(produto)
    res.json(produto)
  }
})

app.patch('/produtos/:id/complemento', bodyParser.text(), function (req, res) {
  const { id } = req.params
  const complemento = req.body

  const produto = produtos.find(el => el.id == id)
  if (produto) {
    if (complemento.length > 0) {
      produto.complemento.push(complemento)
    }
    res.json(produto)
  } else {
    res.status = 404
    res.send("Não existe produto com este id")
  }
})


app.patch('/produtos/:id', bodyParser.json(), function (req, res) {
  const { id } = req.params
  const { nome, quantidade, valorunitario } = req.body

  if ([id, nome, quantidade, valorunitario].some(el => typeof(el) === 'undefined')) {
    res.status = 400
    res.send("O campo id do produto ou nome do produto ou quantidade ou valor unitario não existe no corpo da requisição.")
  } else {
    const produto = produtos.find(el => el.id == id)
    if (produto) {
      produto.nome = nome
      produto.quantidade = quantidade
      produto.valorunitario = valorunitario
      produto.precototal = quantidade * valorunitario
      produto.precovenda = valorunitario * 1.2
      produto.lucro = valorunitario * 0.2
      produto.situacao = situacao(quantidade)
      res.json(produto)
    } else {
      res.status = 404
      res.send("Não existe produto com este id")
    }
  }
})

app.delete('/produtos/:id', function (req, res) {
  const { id } = req.params

  const idx = produtos.findIndex(function(el) {
    return el.id == id
  })

  if (idx < 0) {
    res.status = 404
    res.send("Não existe produto com este id.")
  } else {
    console.dir(produtos[idx])
    produtos.splice(idx, 1)
    res.status = 200
    res.end()

  }
})

app.listen(3000, function () {
  console.log("O servidor está no ar")
})