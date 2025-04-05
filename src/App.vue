<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="linha-titulo">
            <h2>Aqua32 - Pico Reef 30 litros</h2>
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

.linha-titulo {
  background-color: #00064A;
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
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  text-align: center;
  min-width: 250px;
  flex: 1 1 300px;
  height: 250px
}

.linha-grafico {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
