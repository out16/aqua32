<template>
  <div>
    <v-row>
      <div class="linha-titulo">
      <h1>Aqua32 - Pico Reef 30 litros</h1>
    </div>
    </v-row>
    <v-row>
      <v-col cols="4">
        <div class="coluna-texto">
        <h2>Informações Gerais</h2>
        <p>Modelo: Boyu MT30</p>
        <p>Volume bruto: 30 litros</p>
        <p>Volume líquido: 23 litros</p>
      </div>
      </v-col>
      <v-col cols="8">
        <div class="coluna-tabela">
        <TabelaTemperatura ref="tabelaTemperatura" />
      </div>
      </v-col>
    </v-row>
    <v-row>
      <div class="linha-grafico">
      <GraficoTemperatura :dadosFiltrados="dadosFiltrados" />
    </div>
    </v-row>
  </div>
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
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Container principal */
.app-container {
  padding: 20px;
  width: 90vw;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Primeira Linha: Título */
.linha-titulo {
  text-align: center;
  margin-bottom: 20px;
}

.linha-titulo h1 {
  font-size: 2rem;
  color: #2c3e50;
}

/* Segunda Linha: Duas Colunas */
.linha-conteudo {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex: 1;
}

/* Primeira Coluna: Texto Provisório */
.coluna-texto {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.coluna-texto h2 {
  font-size: 1.5rem;
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
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Terceira Linha: Gráfico de Temperatura */
.linha-grafico {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 2;
}

/* Media Queries para Responsividade */
@media (max-width: 768px) {
  .linha-conteudo {
    flex-direction: column;
  }

  .coluna-texto, .coluna-tabela {
    flex: none;
    width: 100%;
  }

  .linha-titulo h1 {
    font-size: 1.5rem;
  }

  .coluna-texto h2 {
    font-size: 1.2rem;
  }

  .coluna-texto p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 10px;
    height: 95vh;
  }

  .linha-titulo h1 {
    font-size: 1.2rem;
  }

  .coluna-texto h2 {
    font-size: 1rem;
  }

  .coluna-texto p {
    font-size: 0.8rem;
  }
}
</style>