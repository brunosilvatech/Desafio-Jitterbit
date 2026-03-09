const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/Order");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://Banzai:banzai123@ac-bart8hh-shard-00-00.jhxdwcm.mongodb.net:27017,ac-bart8hh-shard-00-01.jhxdwcm.mongodb.net:27017,ac-bart8hh-shard-00-02.jhxdwcm.mongodb.net:27017/ordersdb?ssl=true&replicaSet=atlas-bpax8l-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch(err => console.log("Erro ao conectar no MongoDB:", err));
app.post("/order", async (req, res) => {
  try {
    const body = req.body;

    const order = new Order({
      orderId: body.numeroPedido,
      value: body.valorTotal,
      creationDate: body.dataCriacao,
      items: body.items.map((item) => ({
        productId: item.idItem,
        quantity: item.quantidadeItem,
        price: item.valorItem
      }))
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
});

app.get("/order/list", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
});

app.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar pedido" });
  }
});

app.put("/order/:id", async (req, res) => {
  try {
    const body = req.body;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      {
        value: body.valorTotal,
        creationDate: body.dataCriacao,
        items: body.items.map((item) => ({
          productId: item.idItem,
          quantity: item.quantidadeItem,
          price: item.valorItem
        }))
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar pedido" });
  }
});

app.delete("/order/:id", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json({ mensagem: "Pedido deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar pedido" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});