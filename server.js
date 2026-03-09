const express = require("express");

const app = express();
app.use(express.json());

let orders = [];

// Criar pedido
app.post("/order", (req, res) => {

  const pedido = {
    numeroPedido: req.body.numeroPedido,
    valorTotal: req.body.valorTotal
  };

  orders.push(pedido);

  res.status(201).json(pedido);
});

// Listar pedidos
app.get("/order/list", (req, res) => {
  res.json(orders);
});

// Buscar pedido por id
app.get("/order/:id", (req, res) => {

  const id = req.params.id;

  const pedido = orders.find(p => p.numeroPedido === id);

  if (!pedido) {
    return res.status(404).json({ erro: "Pedido não encontrado" });
  }

  res.json(pedido);
});

// Deletar pedido
app.delete("/order/:id", (req, res) => {

  const id = req.params.id;

  orders = orders.filter(p => p.numeroPedido !== id);

  res.json({ mensagem: "Pedido deletado" });

});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});