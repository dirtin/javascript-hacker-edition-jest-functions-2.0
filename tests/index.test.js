const {
  criarProduto,
  venderDia,
  diasAteEstoqueZerado,
  adicionarProdutoNaLoja,
  produtoMaisProximoDeEsgotar,
  sugerirReabastecimento,
  simularVendasNaLoja,
  simularVendasPor30Dias, 
} = require('../src/index');

// Mocks
let produtoMock;

beforeEach(() => {
  produtoMock = criarProduto("Produto A", 100, 5); // Cria um produto mock antes de cada teste
});

// Teste para a função criarProduto
test('Deve criar um produto com nome, quantidade e vendas previstas', () => {
  expect(produtoMock).toEqual({
    nome: "Produto A",
    estoque: 100,
    vendasDiariasPrevistas: 5,
    vendasDiariasHistorico: [],
  });
});

// Teste para a função venderDia
test('Deve reduzir o estoque do produto conforme as vendas diárias previstas', () => {
  venderDia(produtoMock);
  expect(produtoMock.estoque).toBe(95); // Verifica se o estoque foi reduzido corretamente
  expect(produtoMock.vendasDiariasHistorico).toContain(5); // Verifica se a venda foi registrada no histórico
});

// Teste para a função venderDia com estoque insuficiente
test('Deve lançar erro ao tentar vender com estoque insuficiente', () => {
  produtoMock.estoque = 0; // Define estoque como 0
  expect(() => venderDia(produtoMock)).toThrow("Estoque insuficiente para realizar a venda.");
});

// Teste para a função diasAteEstoqueZerado
test('Deve calcular corretamente os dias até o estoque zerar', () => {
  const dias = diasAteEstoqueZerado(produtoMock);
  expect(dias).toBe(20); // 100 / 5 = 20 dias
});

// Teste para a função sugerirReabastecimento
test('Deve sugerir reabastecimento baseado no histórico de vendas', () => {
  // Simulando algumas vendas
  for (let i = 0; i < 5; i++) {
    venderDia(produtoMock);
  }
  const quantidadeReabastecimento = sugerirReabastecimento(produtoMock);
  expect(quantidadeReabastecimento).toBe(150); // 5 * 30 dias
});

// Teste para a função produtoMaisProximoDeEsgotar
test('Deve identificar o produto mais próximo de esgotar', () => {
  const produto2 = criarProduto("Produto B", 50, 10);
  const produto3 = criarProduto("Produto C", 200, 1);
  
  adicionarProdutoNaLoja(produtoMock);
  adicionarProdutoNaLoja(produto2);
  adicionarProdutoNaLoja(produto3);
  
  const produtoCritico = produtoMaisProximoDeEsgotar();
  expect(produtoCritico).toBe(produto2); // Produto B deve ser o mais crítico
});

// Teste para a simulação de vendas
test('Deve simular vendas por 30 dias', () => {
  simularVendasPor30Dias(produtoMock);
  expect(produtoMock.estoque).toBe(0); // O estoque deve chegar a 0 após simular 30 dias
});