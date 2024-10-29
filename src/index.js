// Array para armazenar os produtos  na loja
let produtos = [];

// Função para criar um produto
function criarProduto(nome, quantidadeInicial, vendasDiariasPrevistas) {
  if (quantidadeInicial < 0 || vendasDiariasPrevistas < 0) {
    throw new Error("Quantidade inicial e vendas diárias previstas devem ser maiores ou iguais a zero.");
  }
  return {
    nome: nome,
    estoque: quantidadeInicial,
    vendasDiariasPrevistas: vendasDiariasPrevistas,
    vendasDiariasHistorico: []
  };
}

// Função para adicionar um produto à loja
function adicionarProdutoNaLoja(produto) {
  produtos.push(produto);
}

// Função para vender produtos por um dia e atualizar o estoque
function venderDia(produto) {
  const vendas = produto.vendasDiariasPrevistas;
  
  if (produto.estoque < vendas) {
    throw new Error("Estoque insuficiente para realizar a venda.");
  }

  produto.estoque -= vendas;
  produto.vendasDiariasHistorico.push(vendas);
  return produto; // Retorna o produto atualizado
}

// Função para calcular quantos dias até o estoque zerar
function diasAteEstoqueZerado(produto) {
  if (produto.estoque <= 0) return 0;
  return Math.ceil(produto.estoque / produto.vendasDiariasPrevistas);
}

// Função para verificar qual produto está mais próximo de esgotar o estoque
function produtoMaisProximoDeEsgotar() {
  if (produtos.length === 0) return null;
  return produtos.reduce((maisCritico, produto) => {
    const diasMaisCriticos = diasAteEstoqueZerado(maisCritico);
    const diasProduto = diasAteEstoqueZerado(produto);
    return diasProduto < diasMaisCriticos ? produto : maisCritico;
  });
}

// Função para sugerir uma quantidade de reabastecimento com base no histórico de vendas
function sugerirReabastecimento(produto) {
  const totalVendas = produto.vendasDiariasHistorico.reduce((acc, val) => acc + val, 0);
  const mediaVendasDiarias = produto.vendasDiariasHistorico.length > 0 
      ? totalVendas / produto.vendasDiariasHistorico.length 
      : 0;
  const quantidadeSugerida = Math.ceil(mediaVendasDiarias * 30);
  return quantidadeSugerida;
}

// Função para simular vendas por 30 dias
function simularVendasPor30Dias(produto) {
  for (let i = 0; i < 30; i++) {
    try {
      venderDia(produto);
    } catch (error) {
      console.error(`Erro no dia ${i + 1}: ${error.message}`);
      break; // Para a simulação se não houver estoque suficiente
    }
  }
}

// Função para simular as vendas para todos os produtos da loja
function simularVendasNaLoja() {
  produtos.forEach(produto => simularVendasPor30Dias(produto));
}

// Exportar funções para uso externo
module.exports = {
  criarProduto,
  venderDia,
  diasAteEstoqueZerado,
  adicionarProdutoNaLoja,
  produtoMaisProximoDeEsgotar,
  sugerirReabastecimento,
  simularVendasNaLoja,
  simularVendasPor30Dias,
};
