const { pool } = require('../config');
const Livro = require('../entities/Livro');

const getLivrosDB = async () => {
    try {
        const { rows } = await pool.query(`
SELECT l.codigo as codigo, l.nome as nome, l.descricao as descricao, 
l.valor as valor,  l.ativo as ativo, 
l.genero as genero, g.nome as genero_nome
FROM livros l
join generos g on l.genero = g.codigo
order by l.codigo`);
        return rows.map((livro) =>
            new Livro(livro.codigo, livro.nome, livro.descricao,
                livro.ativo, livro.valor,
                livro.genero, livro.genero_nome));
    } catch (err) {
        throw "Erro: " + err;
    }
}

const addLivroDB = async (body) => {
    try {
        const { nome, descricao, valor, ativo, genero } = body;
        const results = await pool.query(`INSERT INTO livros (nome, descricao, 
            valor, ativo, genero) 
            VALUES ($1, $2, $3, $4, $5)
        returning codigo,nome, descricao, valor, ativo, genero`,
            [nome, descricao, valor, ativo, genero]);
        const livro = results.rows[0];
        return new Livro(livro.codigo, livro.nome, livro.descricao,
            livro.ativo, livro.valor, livro.genero, "");
    } catch (err) {
        throw "Erro ao inserir o livro: " + err;
    }
}

const updateLivroDB = async (body) => {
    try {
        const { codigo, nome, descricao, valor, ativo, genero } = body;
        const results = await pool.query(`UPDATE livros set nome = $2, 
            descricao = $3, valor = $4, ativo = $5, genero = $6
        WHERE codigo = $1 returning codigo,nome, descricao, valor, 
        ativo, genero`,
            [codigo, nome, descricao, valor, ativo, genero]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser alterado`;
        }
        const livro = results.rows[0];
        return new Livro(livro.codigo, livro.nome, livro.descricao,
            livro.ativo, livro.valor, livro.genero, "");
    } catch (err) {
        throw "Erro ao alterar a livro: " + err;
    }
}

const deleteLivroDB = async (codigo) => {
    try {
        const results = await pool.query(`DELETE FROM livros
        WHERE codigo = $1`, [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return `livro de código ${codigo} removido com sucesso!`;
        }
    } catch (err) {
        throw "Erro ao remover a livro: " + err;
    }
}

const getLivroPorCodigoDB = async (codigo) => {
    try {
        const results = await pool.query(`SELECT l.codigo as codigo, l.nome as nome, l.descricao as descricao, 
l.valor as valor,  l.ativo as ativo, 
l.genero as genero
FROM livros l
join generos g on l.genero = g.codigo
where l.codigo = $1`, [codigo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${codigo}`;
        } else {
            const livro = results.rows[0];
            return new Livro(livro.codigo, livro.nome, livro.descricao,
                livro.ativo, livro.valor, livro.genero,
                 "");
        }
    } catch (err) {
        throw "Erro ao recuperar a livro: " + err;
    }
}

module.exports = {
    getLivrosDB, addLivroDB, updateLivroDB, deleteLivroDB, getLivroPorCodigoDB
}
