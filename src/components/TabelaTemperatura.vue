<template>
    <div>
        
      <!-- Campo de seleção de data -->
      <div class="filtro-data">
        <label for="dataSelecionada">Selecione uma data:</label>
        <input
          type="date"
          id="dataSelecionada"
          v-model="dataSelecionada"
          @change="filtrarPorData"
        />
      </div>
  
      <!-- Tabela de dados -->
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Temperatura Interna</th>
            <th>Aquecedor</th>
            <th>Ventilador</th>
          </tr>
        </thead>
        <tbody>
          <!-- Exibe apenas os registros da página atual -->
          <tr
            v-for="(item, index) in registrosPaginaAtual"
            :key="index"
            :class="{
              'linha-ventilador-ligado': item.ventilador === 1,
              'linha-aquecedor-ligado': item.aquecedor === 1,
            }"
          >
            <td>{{ extrairHora(item.dataHora) }}</td>
            <td>{{ item.tempAtual.toFixed(2) }} °C</td>
            <td>{{ item.aquecedor ? 'Ligado' : 'Desligado' }}</td>
            <td>{{ item.ventilador ? 'Ligado' : 'Desligado' }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Controles de paginação -->
      <div class="paginacao">
        <button @click="paginaAnterior" :disabled="paginaAtual === 1">Anterior</button>
        <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
        <button @click="proximaPagina" :disabled="paginaAtual === totalPaginas">Próxima</button>
      </div>
  
      <!-- Mensagem de limite de registros -->
      <p v-if="dadosFiltrados.length > 10" class="mensagem-limite">
        Exibindo {{ registrosPaginaAtual.length }} de {{ dadosFiltrados.length }} registros.
      </p>
    </div>
  </template>
  
  <script>
  import { database, ref, onValue } from '../firebase';
  
  export default {
    data() {
      return {
        dados: [], // Armazena todos os dados do Firebase
        dadosFiltrados: [], // Armazena os dados filtrados por data
        dataSelecionada: '', // Armazena a data selecionada pelo usuário
        paginaAtual: 1, // Página atual da paginação
        registrosPorPagina: 10, // Quantidade de registros por página
      };
    },
    computed: {
      // Calcula os registros da página atual
      registrosPaginaAtual() {
        const inicio = (this.paginaAtual - 1) * this.registrosPorPagina;
        const fim = inicio + this.registrosPorPagina;
        return this.dadosFiltrados.slice(inicio, fim);
      },
      // Calcula o total de páginas
      totalPaginas() {
        return Math.ceil(this.dadosFiltrados.length / this.registrosPorPagina);
      },
    },
    mounted() {
      // Define a data atual como padrão no formato YYYY-MM-DD
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
      const day = String(today.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
      this.dataSelecionada = `${year}-${month}-${day}`;
  
      // Referência para o nó do Firebase onde os dados estão armazenados
      const dadosRef = ref(database, 'dadosAqua32');
  
      // Observa mudanças no nó do Firebase
      onValue(dadosRef, (snapshot) => {
        const dadosFirebase = snapshot.val();
  
        if (dadosFirebase) {
          // Converte o objeto do Firebase em um array
          this.dados = Object.values(dadosFirebase);
          this.filtrarPorData(); // Aplica o filtro automaticamente
        } else {
          console.log('Nenhum dado encontrado no Firebase.');
        }
      }, (error) => {
        console.error('Erro ao buscar dados do Firebase:', error);
      });
    },
    methods: {
      filtrarPorData() {
        if (!this.dataSelecionada) {
          // Se nenhuma data for selecionada, exibe todos os dados
          this.dadosFiltrados = this.dados;
          return;
        }
  
        // Filtra os dados para incluir apenas o dia selecionado
        this.dadosFiltrados = this.dados.filter((item) => {
          // Extrai a parte da data (YYYY-MM-DD) do campo "dataHora"
          const itemDate = item.dataHora.split(' ')[0]; // Divide a string no espaço e pega a primeira parte
          return itemDate === this.dataSelecionada;
        });
  
        // Ordena os dados em ordem decrescente com base na dataHora
        this.dadosFiltrados.sort((a, b) => {
          // Converte as strings de dataHora para objetos Date
          const dataA = new Date(a.dataHora);
          const dataB = new Date(b.dataHora);
  
          // Ordena em ordem decrescente (mais recente primeiro)
          return dataB - dataA;
        });
  
        // Reinicia a paginação para a primeira página
        this.paginaAtual = 1;
  
        console.log('Dados filtrados e ordenados:', this.dadosFiltrados); // Debug: Verifique os dados filtrados
      },
      // Extrai apenas a hora do campo dataHora
      extrairHora(dataHora) {
        return dataHora.split(' ')[1]; // Divide a string no espaço e pega a segunda parte (HH:mm:ss)
      },
      // Navega para a página anterior
      paginaAnterior() {
        if (this.paginaAtual > 1) {
          this.paginaAtual--;
        }
      },
      // Navega para a próxima página
      proximaPagina() {
        if (this.paginaAtual < this.totalPaginas) {
          this.paginaAtual++;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .filtro-data {
    margin-bottom: 20px;
    color: #FFFFFF;
  }
  
  .filtro-data label {
    margin-right: 10px;
    margin-top: 30px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #000533; /* Adiciona fundo branco para a tabela */
    color: #FFFFFF;
  }
  
  th, td {
    border: 1px solid #4F58AA;
    padding: 8px;
    text-align: center;
    background-color: inherit; /* Herda o background da linha */
  }
  
  th {
    background-color: #000533;
  }
  
  /* Linhas alternadas (cinza e branco) */
  tr:nth-child(even) {
    background-color: #0B1355;
  }
  
  /* Efeito hover nas linhas */
  tr:hover {
    background-color: #262F80;
  }
  
  /* Classes para cores de fundo dinâmicas */
  .linha-ventilador-ligado {
    /* background-color: #add8e6 !important; Azul claro */
    color: #3749e8;
    font-weight: bold;
  }
  
  .linha-aquecedor-ligado {
    /* background-color: #ffcccb !important; Vermelho claro */
    color: #ab1717;
    font-weight: bold;

  }
  
  /* Controles de paginação */
  .paginacao {
    margin-top: 20px;
    text-align: center;
    color: #FFFFFF;
  }
  
  .paginacao button {
    padding: 8px 16px;
    margin: 0 5px;
    border: none;
    background-color: #262F80;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .paginacao button:disabled {
    background-color: #0B1355;
    cursor: not-allowed;
  }
  
  .paginacao span {
    margin: 0 10px;
    font-size: 1rem;
    color: #FFFFFF;
  }
  
  /* Mensagem de limite de registros */
  .mensagem-limite {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #888;
    text-align: center;
  }
  </style>