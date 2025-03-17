<template>
  <div class="app-container">
    <!-- Primeira Linha: Título -->
    <div class="linha-titulo">
      <h1>Aqua32 - Pico Reef 30 litros</h1>
    </div>

    <!-- Segunda Linha: Duas Colunas -->
    <div class="linha-conteudo">
      <!-- Primeira Coluna: Texto Provisório -->
      <div class="coluna-texto">
        <h2>Informações Gerais</h2>
        <p>Modelo: Boyu MT30</p>
        <p>Volume bruto: 30 litros</p>
        <p>Volume líquido: 23 litros</p>
      </div>

      <!-- Segunda Coluna: Tabela de Temperaturas -->
      <div class="coluna-tabela">
        <TabelaTemperatura ref="tabelaTemperatura" />
      </div>
    </div>

    <!-- Terceira Linha: Gráfico de Temperatura -->
    <div class="linha-grafico">
      
      <GraficoTemperatura :dadosFiltrados="dadosFiltrados" />
    </div>
  </div>
</template>

<script>
import TabelaTemperatura from './components/TabelaTemperatura.vue';
import GraficoTemperatura from './components/GraficoTemperatura.vue';

export default {
  name: 'App',
  components: {
    TabelaTemperatura,
    GraficoTemperatura,
  },
  data() {
    return {
      dadosFiltrados: [], // Dados filtrados que serão passados para o gráfico
    };
  },
  mounted() {
    // Observa mudanças nos dados filtrados da tabela
    this.$refs.tabelaTemperatura.$watch('dadosFiltrados', (novosDados) => {
      this.dadosFiltrados = novosDados;
    });
  },
};
</script>

<style>
/* Estilos globais */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  color: #333;
}

/* Container principal */
.app-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Primeira Linha: Título */
.linha-titulo {
  text-align: center;
  margin-bottom: 30px;
}

.linha-titulo h1 {
  font-size: 2.5rem;
  color: #2c3e50;
}

/* Segunda Linha: Duas Colunas */
.linha-conteudo {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

/* Primeira Coluna: Texto Provisório */
.coluna-texto {
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.coluna-texto h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 15px;
}

.coluna-texto p {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
}

/* Segunda Coluna: Tabela de Temperaturas */
.coluna-tabela {
  flex: 2;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Terceira Linha: Espaço para o Gráfico */
.linha-grafico {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.linha-grafico h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 15px;
}

.grafico-placeholder {
  text-align: center;
  padding: 50px;
  background-color: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
}

.grafico-placeholder p {
  font-size: 1.2rem;
  color: #888;
}
</style>