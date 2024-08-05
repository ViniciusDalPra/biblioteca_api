const { Router } = require('express');
const { login } = require('../controllers/segurancaController');
const { rotasGeneros} = require('./rotasGeneros');
const { rotasLivros} = require('./rotasLivros');



const rotas = new Router();

rotas.route('/login').post(login);

rotas.use(rotasGeneros);
rotas.use(rotasLivros);

module.exports = rotas;