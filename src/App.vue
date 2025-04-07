<template>
  <div class="app-container">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="linha-titulo">
            <h2>Aqua32</h2>
            <h3>Pico Reef 30 litros</h3>
          </div>
        </v-col>
      </v-row>

      <v-row class="info-geral-row">
        <v-col cols="12" sm="6" md="4">
          <div class="coluna-texto">
            <h2>Informações Gerais</h2>
            <p>Modelo: Boyu MT30</p>
            <p>Volume bruto: 30 litros</p>
            <p>Volume líquido: 23 litros</p>
            <p>Densidade: 1025ppm</p>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <div class="coluna-texto">
            <GraficoVelocimetro />
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <div class="coluna-texto">
            <status/>
          </div>
        </v-col>
      </v-row>
<v-row class="linha-espaco"></v-row>
      <v-row>
        <v-col cols="12">
          <div class="coluna-tabela">
            <TabelaTemperatura ref="tabelaTemperatura" />
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="linha-grafico">
            <GraficoTemperatura :dadosFiltrados="dadosFiltrados" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TabelaTemperatura from './components/TabelaTemperatura.vue';
import GraficoTemperatura from './components/GraficoTemperatura.vue';
import GraficoVelocimetro from './components/GraficoVelocimetro.vue';
import status from './components/Status.vue';

export default {
  name: 'App',
  components: {
    TabelaTemperatura,
    GraficoTemperatura,
    GraficoVelocimetro,
    status,
  },
  data() {
    return {
      dadosFiltrados: [],
    };
  },
  mounted() {
    this.$refs.tabelaTemperatura.$watch('dadosFiltrados', (novosDados) => {
      this.dadosFiltrados = novosDados;
    });
  },
};
</script>

<style scoped>
* {
  font-family: Arial, sans-serif;
}


.app-container {
  background-color: #000533; /* Cor de fundo desejada */
  min-height: 100vh; /* Garante que o fundo cubra toda a altura da tela */
}


.linha-titulo {
  background-color: #000533;
  color: #0089BF;
  padding: 10px 0;
  text-align: center;
}

.info-geral-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.coluna-texto {
  background-color: #262F80;
  padding: 15px;
  border-radius: 5px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  box-sizing: border-box;
  color: #ffffff;
  text-align: center;
  min-width: 250px;
  flex: 1 1 300px;
  height: 250px;
  box-shadow: inset 1px 1px 2px #6e73a8, inset -1px -1px 2px #a0a9fc;
}

.linha-grafico {
  margin-top: 20px;
  background-color: #000533;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.linha-espaco{
  padding: 100px;
}
</style>
