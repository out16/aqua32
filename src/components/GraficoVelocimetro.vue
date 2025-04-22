<template>
  <div class="gauge-container">
    <div ref="chartDom" style="width: 100%; height: 180px;"></div>
    <div class="ideal-temperature">
      Ideal: {{ formatTemperature(temperaturaPadrao) }}°C
    </div>
    <button 
      @click="toggleDetalhes" 
      class="botao-detalhar"
    >
      {{ mostrarDetalhes ? 'Ocultar Detalhes' : 'Detalhar' }}
    </button>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { database, ref, onValue } from '../firebase';

export default {
  name: 'GraficoVelocimetro',
  props: {
    mostrarDetalhes: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myChart: null,
      firebaseUnsubscribe: null,
      temperaturaPadrao: 27.0,
      option: {
        series: [
          {
            type: 'gauge',
            min: 24.5,
            max: 28.5,
            startAngle: 200,
            endAngle: -20,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.35, '#67e0e3'],
                  [0.65, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              show: true,
              length: '80%',
              width: 8,
              itemStyle: {
                color: '#FFFFFF'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              valueAnimation: true,
              color: '#FFFFFF',
              fontSize: 28,
              offsetCenter: [0, '70%'],
              borderWidth: 0,
              formatter: (params) => {
                return this.formatTemperature(params) + '°C';
              }
            },
            data: [{
              value: 27.0
            }]
          }
        ]
      }
    };
  },
  methods: {
    formatTemperature(value) {
      return parseFloat(value).toFixed(2);
    },
    initChart() {
      this.myChart = echarts.init(this.$refs.chartDom);
      this.myChart.setOption(this.option);
    },
    setupFirebaseListener() {
      const dadosRef = ref(database, 'dadosMomentaneos');
      
      this.firebaseUnsubscribe = onValue(dadosRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          if (data.temperatura !== undefined) {
            const tempValue = parseFloat(data.temperatura);
            if (!isNaN(tempValue)) {
              this.updateChart(tempValue);
            }
          }
          
          if (data.temperatura_ideal !== undefined) {
            const novaTemperaturaPadrao = parseFloat(data.temperatura_ideal);
            if (!isNaN(novaTemperaturaPadrao)) {
              this.temperaturaPadrao = novaTemperaturaPadrao;
              this.updateGaugeRange();
            }
          }
        }
      });
    },
    updateChart(temperature) {
      this.myChart.setOption({
        series: [{
          data: [{
            value: parseFloat(temperature)
          }]
        }]
      });
    },
    updateGaugeRange() {
      const min = this.temperaturaPadrao - 1;
      const max = this.temperaturaPadrao + 1;
      
      this.myChart.setOption({
        series: [{
          min: min,
          max: max,
          axisLine: {
            lineStyle: {
              color: [
                [(this.temperaturaPadrao - 0.3 - min)/(max-min), '#67e0e3'],
                [(this.temperaturaPadrao + 0.3 - min)/(max-min), '#37a2da'],
                [1, '#fd666d']
              ]
            }
          }
        }]
      });
    },
    toggleDetalhes() {
      this.$emit('toggle-detalhes');
    }
  },
  mounted() {
    this.initChart();
    this.setupFirebaseListener();
  },
  beforeUnmount() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    if (this.firebaseUnsubscribe) {
      this.firebaseUnsubscribe();
    }
  }
};
</script>

<style scoped>
.gauge-container {
  position: relative;
  width: 100%;
  height: 250px;
}

.ideal-temperature {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: #AAAAAA;
  padding: 4px 8px;
  width: auto;
  max-width: 150px;
  margin: 0 auto;
}

.botao-detalhar {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background-color: #3a45a3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  width: 80%;
  max-width: 150px;
}

.botao-detalhar:hover {
  background-color: #4d5ac4;
}
</style>