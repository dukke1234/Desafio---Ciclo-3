const express = require('express');
const cors = require('cors');

const { Sequelize } = require('./models');

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

let compra = models.Compra;
let itemcompra = models.ItemCompra;
let produto = models.Produto;

app.get('/', function (rec, res) {
    res.send('Olá Mundo!')
})

//--------------------------------------------------------------------------------------------------------------------
//criar clientes
app.post('/clientes', async (req, res) => {
    await cliente.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Cliente cadastrado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//criar servicos
app.post('/servicos', async (req, res) => {
    await servico.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//criar pedidos
app.post('/pedidos', async (req, res) => {
    await pedido.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Pedido cadastrado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Não há cliente com esse Id!"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//criar itens
app.post('/itempedidos', async (req, res) => {
    await itempedido.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Item cadastrado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Não há cliente com esse Id!"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//lista de clientes
app.get('/listaclientes', async (req, res) => {
    await cliente.findAll({
        order: [['clienteDesde', 'ASC']]
    }).then(function (clientes) {
        res.json({ clientes })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//numero total de clientes
app.get('/numeroclientes', async (req, res) => {
    await cliente.count('id').then(function (clientes) {
        res.json({ clientes });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//lista de pedidos
app.get('/listapedidos', async (req, res) => {
    await pedido.findAll({
    }).then(function (ped) {
        res.json({ ped })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//lista pedido por id
app.get('/pedidos/:id', async (req, res) => {
    await pedido.findByPk(req.params.id, { include: [{ all: true }] })
        .then(ped => {
            return res.json({ ped });
        })
})
//--------------------------------------------------------------------------------------------------------------------
//lista de servicos
app.get('/listaservicos', async (req, res) => {
    await servico.findAll({
        //raw: true
        order: [['id', 'ASC']]
    }).then(function (servicos) {
        res.json({ servicos })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//numero total de clientes
app.get('/ofertaservicos', async (req, res) => {
    await servico.count('id').then(function (servicos) {
        res.json({ servicos });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//lista servicos por id
app.get('/servico/:id', async (req, res) => {
    await servico.findByPk(req.params.id)
        .then(serv => {
            return res.json({
                error: false,
                serv
            });
        }).catch(function (error) {
            return res.status(400).json({
                error: true,
                message: "Erro: não foi possivel conectar"
            });
        });
});
//--------------------------------------------------------------------------------------------------------------------
//lista de item
app.get('/listaitem', async (req, res) => {
    await itempedido.findAll({
        order: [['PedidoId', 'ASC']]
    }).then(function (item) {
        res.json({ item })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de servicos
app.put('/atualizaservico', async (req, res) => {
    await servico.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: 'Serviço alterado com sucesso!'
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de clientes
app.put('/atualizaclientes', async (req, res) => {
    await cliente.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: 'Cliente alterado com sucesso!'
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de pedido
app.put('/atualizapedidos', async (req, res) => {
    await pedido.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: 'Pedido alterado com sucesso!'
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de pedido por Id
app.put('/pedidos/:id/editaritem', async (req, res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: 'pedido não encontrado.'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: 'Serviço não encontrado.'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ ServicoId: req.body.ServicoId },
            { PedidoId: req.params.id })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: 'Pedido alterado com sucesso!',
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi preciso alterar"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de itens
app.put('/atualizaitem', async (req, res) => {
    await itempedido.update(req.body, {
        where: { PedidoId: req.body.PedidoId }
    }).then(function () {
        return res.json({
            error: false,
            message: 'Item alterado com sucesso!'
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//Exclui cliente
app.get('/excluircliente/:id', async (req, res) => {
    await cliente.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Cliente excluido com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir cliente!'
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//Exclui pedido
app.get('/excluirpedido/:id', async (req, res) => {
    await pedido.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Pedido excluido com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir cliente!'
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//Exclui servico
app.get('/excluirservico/:id', async (req, res) => {
    await servico.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço excluido com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir cliente!'
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//Exclui item
app.get('/excluiritem/:Pedidoid', async (req, res) => {
    await itempedido.destroy({
        where: { Pedidoid: req.params.Pedidoid }
    }).then(function () {
        return res.json({
            error: false,
            message: "Item excluido com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir cliente!'
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//criar compra
app.post('/compras', async (req, res) => {
    await compra.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Compra cadastrada com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Não há cliente com esse Id!"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//criar itens 
app.post('/produtos', async (req, res) => {
    await produto.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Produto criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossivel se conectar."
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//criar itens 
app.post('/itemcompra', async (req, res) => {
    await itemcompra.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Item cadastrado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Não há cliente com esse Id!"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//listas compras 
app.get('/listacompras', async (req, res) => {
    await compra.findAll({
    }).then(function (compra) {
        res.json({ compra })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//lista pedido por id
app.get('/compras/:id', async (req, res) => {
    await compra.findByPk(req.params.id, { include: [{ all: true }] })
        .then(compra => {
            return res.json({ compra });
        })
})
//--------------------------------------------------------------------------------------------------------------------
// listas produtos 
app.get('/listaprodutos', async (req, res) => {
    await produto.findAll({
        order: [['id', 'ASC']]
    }).then(function (produtos) {
        res.json({ produtos })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//lista de clientes
app.get('/listaitemcompra', async (req, res) => {
    await itemcompra.findAll({
        order: [['CompraId', 'ASC']]

    }).then(function (item) {
        res.json({ item })
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de compra
app.put('/atualizacompra', async (req, res) => {
    await compra.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: 'Compra alterada com sucesso!'
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de compra por Id
app.put('/compra/:id/editaritem', async (req, res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: 'compra não encontrado.'
        });
    };

    if (!await produto.findByPk(req.body.ProdutoId)) {
        return res.status(400).json({
            error: true,
            message: 'Produto não encontrado.'
        });
    };

    await itemcompra.update(item, {
        where: Sequelize.and({ ProdutoId: req.body.ProdutoId },
            { CompraId: req.params.id })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: 'Compra alterada com sucesso!',
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi preciso alterar"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//atualização de produto
app.put('/atualizaproduto', async (req, res) => {
    await produto.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: 'Produto alterado com sucesso!'
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração"
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------
//Exclui compras
app.get('/excluircompras/:id', async (req, res) => {
    await compra.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra excluida com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir compra!'
        });
    });
});

app.get('/excluirproduto/:id', async (req, res) => { //Exclui produto
    await produto.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Produto excluido com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir produto!'
        });
    });
});

app.get('/excluiritemcompra/:Compraid', async (req, res) => { //Exclui item
    await itemcompra.destroy({
        where: { Compraid: req.params.Compraid }
    }).then(function () {
        return res.json({
            error: false,
            message: "Item excluido com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            error: true,
            message: 'Erro ao excluir item!'
        });
    });
});



let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log('Servidor ativo: http://localhost:3001');
})