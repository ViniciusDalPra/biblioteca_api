class Livro {
    constructor(codigo, nome, descricao, ativo, valor, genero, genero_nome
    ){
        this.codigo = codigo;
        this.nome = nome;
        this.descricao = descricao;
        this.ativo = ativo;
        this.valor = valor;
        this.genero = genero;
        this.genero_nome = genero_nome
    }
}

module.exports = Livro;