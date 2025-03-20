<template>
  <div>
    <!-- Linha do título -->
    <v-row class="linha-titulo">
      <v-col>
        <h1>Aqua32 - Pico Reef 30 litros</h1>
      </v-col>
    </v-row>

    <!-- Linha das informações e tabela -->
    <v-row>
      <!-- Coluna de texto (4 colunas) -->
      <v-col cols="4">
        <div class="coluna-texto">
          <h2>Informações Gerais</h2>
          <p>Modelo: Boyu MT30</p>
          <p>Volume bruto: 30 litros</p>
          <p>Volume líquido: 23 litros</p>
        </div>
      </v-col>

      <!-- Coluna de texto (4 colunas) -->
      <v-col cols="4">
        <div class="coluna-texto">
          <h2>Informações Gerais</h2>
          <p>Modelo: Boyu MT30</p>
          <p>Volume bruto: 30 litros</p>
          <p>Volume líquido: 23 litros</p>
        </div>
      </v-col>

      <!-- Coluna da tabela (4 colunas) -->
      <v-col cols="4">
        <div class="coluna-tabela">
          <TabelaTemperatura ref="tabelaTemperatura" />
        </div>
      </v-col>
    </v-row>

    <!-- Linha do gráfico -->
    <v-row>
      <v-col>
        <div class="linha-grafico">
          <GraficoTemperatura :dadosFiltrados="dadosFiltrados" />
        </div>
      </v-col>
    </v-row>
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
    this.$watch(
      () => this.$refs.tabelaTemperatura.dadosFiltrados,
      (novosDados) => {
        this.dadosFiltrados = novosDados;
      }
    );
  },
};
</script>

<style scoped>
/* Estilo básico para o título */
.linha-titulo {
  background-color: #00064A; /* Azul escuro */
  color: #0089BF; /* Cor do texto */
  padding: 10px 0; /* Espaçamento interno */
  text-align: center; /* Centraliza o texto */
}

/* Estilo básico para o conteúdo */
.coluna-texto {
  background-color: #f9f9f9; /* Fundo claro */
  margin-bottom: 20px; /* Margem inferior de 20px */
  padding: 15px; /* Espaçamento interno */
  border-radius: 5px; /* Bordas arredondadas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra leve */
  box-sizing: border-box; /* Garante que padding e border não aumentem a largura */
}

/* Estilo básico para a área da tabela */
.coluna-tabela {
  background-color: #ffffff; /* Fundo branco */
  padding: 15px; /* Espaçamento interno */
  border-radius: 5px; /* Bordas arredondadas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra leve */
}

/* Estilo básico para a linha do gráfico */
.linha-grafico {
  margin-top: 20px; /* Espaçamento superior */
  background-color: #ffffff; /* Fundo branco */
  padding: 15px; /* Espaçamento interno */
  border-radius: 5px; /* Bordas arredondadas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra leve */
}
</style>